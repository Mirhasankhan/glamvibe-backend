import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { reviewService } from "./reviews.service";

const createReview = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await reviewService.createReviewIntoDB(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review submitted successully",
    data: result,
  });
});
const getServiceReviews = catchAsync(async (req, res) => {
  const serviceId = req.params.id;
  const result = await reviewService.getServiceReviewsFromDB(serviceId);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Reviews retrieved successully",
    data: result,
  });
});
const getAllReviews = catchAsync(async (req, res) => { 
  const result = await reviewService.getAllReviewsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Reviews retrieved successully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getServiceReviews,
  getAllReviews
};
