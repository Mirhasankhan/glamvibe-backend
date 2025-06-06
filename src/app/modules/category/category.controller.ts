import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { categoryServices } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  const result = await categoryServices.createCategoryIntoDB(req);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Category Created Successfully",
    data: result,
  });
});
const getCategories = catchAsync(async (req, res) => {
  const result = await categoryServices.getCategoriesFromDB();
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Categories retrieved Successfully",
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getCategories,
};
