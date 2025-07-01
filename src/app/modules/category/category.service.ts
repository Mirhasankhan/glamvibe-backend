import { Request } from "express";
import { IUploadFile } from "../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploader";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const createCategoryIntoDB = async (req: Request) => {
  const payload = req.body;

  const existingCategory = await prisma.category.findFirst({
    where: { categoryName: payload.categoryName },
  });
  if (existingCategory) {
    throw new ApiError(404, "This category already exists.");
  }

  const files = req.files as IUploadFile[];
  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }

  if (files && files.length > 0) {
    const uploadedMedia = await FileUploadHelper.uploadToCloudinary(files);

    payload.mediaUrls = uploadedMedia.map((media) => media.secure_url);
  }
  if (!payload.mediaUrls) {
    throw new ApiError(409, "NO image Uploaded");
  }

  const category = await prisma.category.create({
    data: {
      ...payload,
    },
  });
  return category;
};

const getCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany({
    include: {
      service: true,
    },
  });
  if (!categories) {
    throw new ApiError(404, "Categories Not Found");
  }
  return categories;
};

export const categoryServices = {
  createCategoryIntoDB,
  getCategoriesFromDB,
};
