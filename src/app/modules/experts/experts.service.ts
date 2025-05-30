import { Request } from "express";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { IUploadFile } from "../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploader";

const createExpertIntoDB = async (req: Request) => {
  const payload = req.body;
  const categoryId = req.params.id;
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }
  const files = req.files as IUploadFile[];
  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }
  if (files && files.length > 0) {
    const uploadedMedia = await FileUploadHelper.uploadToCloudinary(files);

    payload.imageUrl = uploadedMedia.map((media) => media.secure_url);
  }
  if (!payload.imageUrl) {
    throw new ApiError(409, "NO image Uploaded");
  }
  const expert = await prisma.expert.create({
    data: {
      categoryId,
      name: payload.name,
      imageUrl: payload.imageUrl[0],
    },
  });
  return expert;
};
const getExpertsFromDB = async (categoryId?: string) => {
  const experts = await prisma.expert.findMany({
    where: categoryId ? { categoryId } : {},
  });
  return experts;
};

export const expertServices = {
  createExpertIntoDB,
  getExpertsFromDB
};
