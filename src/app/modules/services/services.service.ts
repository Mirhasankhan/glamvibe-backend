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
  const services = await prisma.service.findMany({});
  if (!services.length) {
    throw new ApiError(404, "Services not found!");
  }

  return services;
};
const getServiceFromDb = async (serviceId: string) => {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    throw new ApiError(404, "Service not found!");
  }
  return service;
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
};
