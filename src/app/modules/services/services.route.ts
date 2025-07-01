import express from "express";
import auth from "../../middlewares/auth";
import { serviceController } from "./services.controller";
import { FileUploadHelper } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { serviceValidation } from "./services.validation";

const router = express.Router();

router.post(
  "/create",
  FileUploadHelper.upload.array("files", 5), 
  parseBodyData,
  validateRequest(serviceValidation.serviceValidationSchema),
  serviceController.createService
);
router.get("/all",auth(UserRole.ADMIN), serviceController.getServices);
router.get("/category/:id", serviceController.getCategoryServices);
router.get("/single/:id", serviceController.getService);
router.delete("/:id", serviceController.deleteService);

export const serviceRoute = router;
