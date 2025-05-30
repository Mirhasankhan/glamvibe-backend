import express from "express";
import { FileUploadHelper } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { expertController } from "./experts.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create/:id",
  auth(UserRole.ADMIN),  
  FileUploadHelper.upload.array("files", 1),
  parseBodyData,
  expertController.createExpert
);
router.get(
  "/all",  
  expertController.getExpert
);

export const expertRoutes = router;
