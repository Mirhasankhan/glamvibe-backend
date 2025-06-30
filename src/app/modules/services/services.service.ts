import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IUploadFile } from "../../interfaces/file";
import { Request } from "express";
import { FileUploadHelper } from "../../../helpers/fileUploader";

const createServiceIntoDb = async (req: Request) => {
  const payload = req.body;
  const existingCategory = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });
  if (!existingCategory) {
    throw new ApiError(404, "Category not found, service creation failed!");
  }
  const existingService = await prisma.service.findFirst({
    where: {
      serviceName: payload.serviceName,
      categoryId: payload.categoryId,
    },
  });
  if (existingService) {
    throw new ApiError(
      404,
      "Service creation failed! This category already have this service"
    );
  }
  const files = req.files as IUploadFile[];
  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }
  if (files && files.length > 0) {
    const uploadedMedia = await FileUploadHelper.uploadToCloudinary(files);

    payload.imageUrls = uploadedMedia.map((media) => media.secure_url);
  }
  if (!payload.imageUrls) {
    throw new ApiError(409, "NO image Uploaded");
  }
  const newService = await prisma.service.create({
    data: {
      ...payload,
    },
  });
  return newService;
};

const getAllServiceFromDb = async () => {
  const services = await prisma.service.findMany({
    include: {
      review: {
        select: {
          rating: true,
        },
      },
    },
  });

  if (!services.length) {
    throw new ApiError(404, "Services not found!");
  }

  const servicesWithAvgRating = services.map((service) => {
    const ratings = service.review.map((r) => r.rating);
    const avgRating = ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : null;

    return {
      ...service,
      avgRating,
    };
  });

  return servicesWithAvgRating;
};
const getCategoriesServiceFromDb = async (categoryId: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!existingCategory) {
    throw new ApiError(404, "Category not found!");
  }
  const services = await prisma.service.findMany({
    where: { categoryId },
    include: {
      review: {
        select: {
          rating: true,
        },
      },
    },
  });

  if (!services.length) {
    throw new ApiError(404, "Services not found!");
  }

  const servicesWithAvgRating = services.map((service) => {
    const ratings = service.review.map((r) => r.rating);
    const avgRating = ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : null;

    return {
      ...service,
      avgRating,
    };
  });

  return {
    categoryName: existingCategory.categoryName,
    iconUrl: existingCategory.mediaUrls[0],
    mediaUrl: existingCategory.mediaUrls[1],
    servicesWithAvgRating,
    
  };
};

const getServiceFromDb = async (serviceId: string) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      category: {
        select: {
          categoryName:true,          
        }
      },
      review: {
        select: {
          id:true,
          comment:true,
          rating:true,
          user: {
            select: {
              id:true,
              profileImage:true,
              username:true
            }
          }
        }
      }
    }
  });

  if (!service) {
    throw new ApiError(404, "Service not found!");
  }

  const avgResult = await prisma.review.aggregate({
    where: { serviceId },
    _avg: { rating: true },
  });

  return {
    ...service,
    avgRating: avgResult._avg.rating ?? null,
  };
};

const deleteServiceFromDb = async (serviceId: string) => {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    throw new ApiError(404, "Service not found!");
  }
  const result = await prisma.service.delete({ where: { id: serviceId } });
  return result;
};

export const servicesService = {
  createServiceIntoDb,
  getAllServiceFromDb,
  getServiceFromDb,
  deleteServiceFromDb,
  getCategoriesServiceFromDb,
};
