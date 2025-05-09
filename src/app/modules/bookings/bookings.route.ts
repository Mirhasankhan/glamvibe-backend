import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { bookingController } from "./bookings.controller";

const router = express.Router();

router.post("/create", auth(UserRole.USER), bookingController.createBooking);

export const bookingRoutes = router;
