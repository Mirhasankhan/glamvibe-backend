import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { bookingService } from "./bookings.service";

const createBooking = catchAsync(async (req, res) => {
  const result = await bookingService.createBookingIntoDB(
    req.user.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Booking created successfully",
    data: result,
  });
});
const getUserBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getBookingsFromDB(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Bookings retrieved successfully",
    data: result,
  });
});
const getBookingDetails = catchAsync(async (req, res) => {
  const result = await bookingService.getBookingDetailsFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Booking details got successfully",
    data: result,
  });
});
const getAllBookings = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1; 
  const result = await bookingService.getAllBookingsFromDB(page);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Bookings Retrieved Successfully",
    data: result,
  });
});
const cancelBooking = catchAsync(async (req, res) => {
  const result = await bookingService.cancelBookingFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Booking cancelled successfully",
    data: result,
  });
});
const confirmBooking = catchAsync(async (req, res) => {
  const result = await bookingService.confirmBookingFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Booking confirmed successfully",
    data: result,
  });
});
const monthlyEarnings = catchAsync(async (req, res) => {
  const result = await bookingService.getMonthlyEarnings();
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Earning Report retrieved successfully",
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getUserBookings,
  getBookingDetails,
  confirmBooking,
  cancelBooking,
  getAllBookings,
  monthlyEarnings
};
