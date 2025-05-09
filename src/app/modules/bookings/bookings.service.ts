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

export const bookingService = {
  createBookingIntoDB,
};
