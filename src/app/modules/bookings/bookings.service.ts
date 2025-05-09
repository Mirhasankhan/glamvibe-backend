import { Booking } from "@prisma/client";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import Stripe from "stripe";

const stripe = new Stripe(config.stripe.stripe_secret as string);

const createBookingIntoDB = async (userId: string, bookingData: Booking) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const existingService = await prisma.service.findUnique({
    where: { id: bookingData.serviceId },
  });
  if (!existingService) {
    throw new ApiError(404, "Service not found! Booking Failed.");
  }

  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      serviceId: bookingData.serviceId,
      date: bookingData.date,
      status: { not: "CANCELLED" },
      OR: [
        {
          startTime: {
            lt: bookingData.endTime,
          },
          endTime: {
            gt: bookingData.startTime,
          },
        },
      ],
    },
  });

  if (conflictingBooking) {
    throw new ApiError(
      409,
      "Time slot already booked. Please choose another slot."
    );
  }

  await stripe.paymentMethods.attach(bookingData.paymentMethodId, {
    customer: user.stripeCustomerId,
  });
  const paymentIntent = await stripe.paymentIntents.create({
    amount: bookingData.price * 100,
    currency: "usd",
    customer: user?.stripeCustomerId,
    confirm: true,
    payment_method: bookingData.paymentMethodId,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  if (paymentIntent.status === "succeeded") {
    const booking = await prisma.booking.create({
      data: {
        ...bookingData,
        userId: userId,
        paymentIntentId: paymentIntent.id,
      },
    });
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        paymentMethodId: bookingData.paymentMethodId,
        paymentIntentId: paymentIntent.id,
        amount: booking.price,
        userId,
      },
    });
    return booking;
  } else {
    throw new ApiError(400, "Booking Failed");
  }
};
const getBookingsFromDB = async (userId: string) => {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    select: {
      id: true,
      date: true,
      startTime: true,
      endTime: true,
      price: true,
      status:true,
      service: {
        select: {
          id: true,
          serviceName: true,
          imageUrls: true,
        },
      },
    },
  });
  if (bookings.length < 1) {
    throw new ApiError(404, "No booking found");
  }
  return bookings;
};
const getBookingDetailsFromDB = async (bookingId: string) => {
  const bookings = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      date: true,
      startTime: true,
      endTime: true,
      phone: true,
      status:true,
      service: {
        select: {
          id: true,
          serviceName: true,
          imageUrls: true,
        },
      },
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });

  if (!bookings) {
    throw new ApiError(404, "No booking found");
  }
  // const avgRating = await prisma.review.aggregate({
  //   where: {
  //     hotelId: bookings.hotel?.id,
  //   },
  //   _avg: {
  //     rating: true,
  //   },
  // });
  // const avg = avgRating._avg.rating ?? 0;
  return {
    bookings,
    // hotelRating: avg,
  };
};

const getAllBookingsFromDB = async (page: number = 1) => {
  const limit = 5;
  const skip = (page - 1) * limit;
  const totalBookings = await prisma.booking.count();

  const totalPages = Math.ceil(totalBookings / limit);

  const bookings = await prisma.booking.findMany({
    skip: skip,
    take: limit,
    include: {
      user: {
        select: {
          username: true,
        },
      },
      service: {
        select: {
          id: true,
          serviceName: true,
          imageUrls: true,
        },
      },
    },
  });

  if (bookings.length < 1) {
    throw new ApiError(404, "Booking not found");
  }

  return {
    bookings,
    totalPages,
  };
};

const confirmBookingFromDB = async (bookingId: string) => {
  const existingBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });
  if (!existingBooking) {
    throw new ApiError(404, "No Booking Found To Delete");
  }
  if (existingBooking.status == "CANCELLED") {
    throw new ApiError(404, "this booking is already cancelled");
  }

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" },
  });

  return {
    booking: booking,
  };
};

const cancelBookingFromDB = async (bookingId: string) => {
  const existingBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });
  if (!existingBooking) {
    throw new ApiError(404, "No Booking Found To Delete");
  }
  if (existingBooking.status == "COMPLETED") {
    throw new ApiError(404, "this booking is already completed");
  }
  if (existingBooking.paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        existingBooking.paymentIntentId
      );

      if (paymentIntent.status === "succeeded") {
        await stripe.refunds.create({
          payment_intent: paymentIntent.id,
        });
      } else {
        throw new ApiError(
          400,
          "Payment not confirmed, refund cannot be processed."
        );
      }
    } catch (error) {
      console.error("Refund Error: ", error);
      throw new ApiError(500, "Refund process failed.");
    }
  } else {
    throw new ApiError(
      500,
      "No payment found for this booking, skipping refund."
    );
  }

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });

  return {
    booking: booking,
  };
};

export const bookingService = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getBookingDetailsFromDB,
  getBookingsFromDB,
  confirmBookingFromDB,
  cancelBookingFromDB,
};
