import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { expertServices } from "./experts.service";

const createExpert = catchAsync(async (req, res) => {
  const result = await expertServices.createExpertIntoDB(req);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Expert Created Successfully",
    data: result,
  });
});
const getExpert = catchAsync(async (req, res) => {
  const result = await expertServices.getExpertsFromDB(
    req.query.categoryId as string
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Experts retrieved Successfully",
    data: result,
  });
});

export const expertController = {
  createExpert,
  getExpert
};
