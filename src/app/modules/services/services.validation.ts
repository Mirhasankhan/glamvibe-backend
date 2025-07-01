import { z } from "zod";

const serviceValidationSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  description: z.string().min(1, "Service description required"),
});

export const serviceValidation = {
  serviceValidationSchema,
};
