import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { jobPostValidation } from "./jobPost.validation";
import { jobPostController } from "./jobPost.controller";

const router = express.Router();

router.post(
  "/create",
  validateRequest(jobPostValidation.jobPostValidationSchema),
  jobPostController.createJobPost
);

router.get("/", jobPostController.jobPosts)
router.patch("/switch/:id", jobPostController.switchActive)

export const jobPostRoutes = router;
