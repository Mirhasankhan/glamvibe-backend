import { Applications } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IUploadFile } from "../../interfaces/file";
import { Request } from "express";
import { FileUploadHelper } from "../../../helpers/fileUploader";

const createApplicationIntoDB = async (req: Request) => {
  const postId = req.params.id;
  const payload = req.body;

  const existingPost = await prisma.jobPost.findUnique({
    where: { id: postId, isActive: true },
  });

  if (!existingPost) {
    throw new ApiError(404, "Job post not found, application failed.");
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
    throw new ApiError(409, "No image Uploaded");
  }
  const { imageUrls, ...rest } = payload;

  const application = await prisma.applications.create({
    data: {
      ...rest,
      resumeUrl: payload?.imageUrls[0],
      postId,
    },
  });
  return application;
};

const getAllApplicationFromDB = async () => {
  const applications = await prisma.applications.findMany();

  if (applications.length < 1) {
    throw new ApiError(404, "No application found");
  }
  return applications;
};

export const applicationService = {
  createApplicationIntoDB,
  getAllApplicationFromDB
};
