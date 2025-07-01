import { z } from "zod";

const categoryValidationSchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  overview: z.string().min(1, "Category overview required"),
  description: z.string().min(1, "Category description required"),
});

export const categoryValidation = {
  categoryValidationSchema,
};
