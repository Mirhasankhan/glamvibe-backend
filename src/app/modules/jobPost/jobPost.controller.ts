import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { jobPostServices } from "./jobPost.service";

const createJobPost = catchAsync(async (req, res) => {
  const result = await jobPostServices.createJobPost(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Job posted successfully",
    data: result,
  });
});
const jobPosts = catchAsync(async (req, res) => {
  const result = await jobPostServices.getJobPostsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Job posts retrieved",
    data: result,
  });
});
const switchActive = catchAsync(async (req, res) => {
  const result = await jobPostServices.switchActiveInactive(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Job posts activation switched",
    data: result,
  });
});

export const jobPostController = {
  createJobPost,
  jobPosts,
  switchActive
};
