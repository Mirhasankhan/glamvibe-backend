import express from "express";
import { FileUploadHelper } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { applicationController } from "./appliation.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create/:id",
  FileUploadHelper.upload.array("files", 1),
  parseBodyData,
  applicationController.createApplication
);

router.get("/", auth(UserRole.ADMIN), applicationController.getApplications)

export const applicationRoutes = router;
