import { JobPost } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const createJobPost = async (payload: JobPost) => {
  const jobPost = await prisma.jobPost.create({
    data: payload,
  });
  return jobPost;
};

const getJobPostsFromDB = async () => {
  const jobPosts = await prisma.jobPost.findMany();

  if (jobPosts.length < 1) {
    throw new ApiError(404, "No Job Post Found");
  }
  return jobPosts;
};

const switchActiveInactive = async (jobId: string) => {
  const existingJob = await prisma.jobPost.findUnique({
    where: { id: jobId },
  });
  if (!existingJob) {
    throw new ApiError(404, "Job post not found");
  }

  const updatedPost = await prisma.jobPost.update({
    where: { id: jobId },
    data: { isActive: !existingJob.isActive },
  });
  return updatedPost
};

export const jobPostServices = {
  createJobPost,
  getJobPostsFromDB,
  switchActiveInactive
};
