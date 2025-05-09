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

export const bookingController = {
    createBooking
}