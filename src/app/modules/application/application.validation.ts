import { z } from "zod";

const applicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number can't exceed 15 digits"),
  email: z.string().email("Invalid email address"),
  expectedSalary: z
    .number({ invalid_type_error: "Expected salary must be a number" })
    .min(0, "Expected salary must be a positive number"),
  experience: z.string().optional(),
  education: z.string().min(1, "Education is required"),
});

export const applicationValidationSchema = {
  applicationSchema,
};
