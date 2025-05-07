import { z } from "zod";

const categoryValidationSchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  mediaUrls: z
    .array(z.string().url("Each media URL must be a valid URL"))
    .min(1, "At least one media URL is required"),
});

export const categoryValidation = {
    categoryValidationSchema
}
