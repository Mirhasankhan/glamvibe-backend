import express from "express";
import { FileUploadHelper } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { categoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { categoryValidation } from "./category.validation";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  FileUploadHelper.upload.array("files", 5),
  parseBodyData,
  validateRequest(categoryValidation.categoryValidationSchema),
  categoryController.createCategory
);
router.get("/all", categoryController.getCategories);

export const categoryRoutes = router;
