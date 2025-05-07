import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { serviceRoute } from "../modules/services/services.route";
import { categoryRoutes } from "../modules/category/category.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
