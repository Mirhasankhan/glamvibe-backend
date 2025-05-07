import express from "express";
import { FileUploadHelper } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { categoryController } from "./category.controller";
import { categoryValidation } from "./category.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  FileUploadHelper.upload.array("files", 5),
  parseBodyData,
  // validateRequest(categoryValidation.categoryValidationSchema),
  categoryController.createCategory
);

export const categoryRoutes = router;
