import { Review } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const createReviewIntoDB = async (userId: string, reviewData: Review) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!existingUser) {
    throw new ApiError(404, "User not found! Review failed.");
  }
  const existingService = await prisma.service.findUnique({
    where: { id: reviewData.serviceId },
  });
  if (!existingService) {
    throw new ApiError(404, "Service not found! Review failed.");
  }

  if (!reviewData.comment && !reviewData.rating) {
    throw new ApiError(404, "Either comment or rating is required");
  }
  const review = await prisma.review.create({
    data: {
      ...reviewData,
      userId,
    },
  });
  return review;
};

const getServiceReviewsFromDB = async (serviceId: string) => {
  const reviews = await prisma.review.findMany({
    where: { serviceId },
    include: {
      service: {
        select: {
          serviceName: true,
        },
      },
      user: {
        select: {
          username: true,
          profileImage: true,
        },
      },
    },
  });
  if (reviews.length < 1) {
    throw new ApiError(404, "No reviews found");
  }
  return reviews;
};
const getAllReviewsFromDB = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      service: {
        select: {
          serviceName: true,
        },
      },
      user: {
        select: {
          username: true,
          profileImage: true,
        },
      },
    },
  });
  if (reviews.length < 1) {
    throw new ApiError(404, "No reviews found");
  }
  return reviews;
};

const getDetailsForAdminFromDb = async () => {
  const activeOrderCount = await prisma.booking.count({
    where: { status: "ACTIVE" },
  });
  const totalBookingsCount = await prisma.booking.count({});
  const earnings = await prisma.booking.aggregate({
    where: { status: "COMPLETED" },
    _sum: { price: true },
  });

  const totalUserCount = await prisma.user.count({
    where: { role: "USER" },
  });

  return {
    activeOrderCount,
    totalUserCount,
    totalBookingsCount,
    earnings: earnings._sum.price || 0,
  };
};

export const reviewService = {
  createReviewIntoDB,
  getServiceReviewsFromDB,
  getAllReviewsFromDB,
  getDetailsForAdminFromDb
};
