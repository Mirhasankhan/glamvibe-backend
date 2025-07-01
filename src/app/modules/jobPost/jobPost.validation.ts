import { z } from "zod";

const TLevelEnum = z.enum(["INTERNSHIP", "MID LEVEL", "SENIOR LEVEL"]);
const JobTypeEnum = z.enum(["FULL TIME", "PART TIME", "INTERNSHIP", "CONTRACT"]);

export const jobPostValidationSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  salary: z.string().min(1, "Salary is required"),
  description: z.string().min(1, "Job description is required"),
  requirements: z.string().min(1, "Job requirements are required"),
  experiencelevel: TLevelEnum,
  jobType: JobTypeEnum,
  lastDate: z.string().min(1, "Last application date is required") 
});

export const jobPostValidation = {
  jobPostValidationSchema,
};
