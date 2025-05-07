import express from "express";
import auth from "../../middlewares/auth";
import { serviceController } from "./services.controller";
import { FileUploadHelper } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = express.Router();

router.post(
  "/create/:id",
  FileUploadHelper.upload.array("files", 5), 
  parseBodyData,
  serviceController.createService
);
router.get("/", serviceController.getServices);
router.get("/:id", serviceController.getService);
router.delete("/:id", serviceController.deleteService);

export const serviceRoute = router;
