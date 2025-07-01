import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { serviceRoute } from "../modules/services/services.route";
import { categoryRoutes } from "../modules/category/category.route";
import { bookingRoutes } from "../modules/bookings/bookings.route";
import { reviewRoutes } from "../modules/reviews/reviews.route";
import { expertRoutes } from "../modules/experts/experts.route";
import { jobPostRoutes } from "../modules/jobPost/jobPost.route";
import { applicationRoutes } from "../modules/application/application.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },

  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/category",
    route: categoryRoutes,
  },
  {
    path: "/service",
    route: serviceRoute,
  },
  {
    path: "/booking",
    route: bookingRoutes,
  },
  {
    path: "/review",
    route: reviewRoutes,
  },
  {
    path: "/expert",
    route: expertRoutes,
  },
  {
    path: "/job-post",
    route: jobPostRoutes,
  },
  {
    path: "/application",
    route: applicationRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
