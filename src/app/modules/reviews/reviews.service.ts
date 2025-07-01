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

export const reviewService = {
  createReviewIntoDB,
  getServiceReviewsFromDB,
  getAllReviewsFromDB,
};
