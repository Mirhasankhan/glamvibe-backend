import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { bookingController } from "./bookings.controller";

const router = express.Router();

router.post("/create", auth(UserRole.USER), bookingController.createBooking);
router.get("/user-booking", auth(UserRole.USER), bookingController.getUserBookings);
router.get("/admin-bookings", auth(UserRole.ADMIN), bookingController.getAllBookings);
router.get("/details/:id", auth(UserRole.USER), bookingController.getBookingDetails);
router.patch("/confirm/:id", bookingController.confirmBooking);
router.patch("/cancel/:id", bookingController.cancelBooking);

export const bookingRoutes = router;
