import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { applicationService } from "./application.service";

const createApplication = catchAsync(async (req, res) => {
  const result = await applicationService.createApplicationIntoDB(req);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Application submitted successfully",
    data: result,
  });
});
const getApplications = catchAsync(async (req, res) => {
  const result = await applicationService.getAllApplicationFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Applications retrieved successfully",
    data: result,
  });
});

export const applicationController = {
  createApplication,
  getApplications
};
