import z from "zod";

export const createProductSchema = z.object({
  name: z.string("Name must be a string").min(1, "Name is required"),
  description: z.string("Description must be a string").optional(),
  price: z.coerce
    .number("Price must be a number")
    .positive("Price must be positive"),
  stock: z.coerce
    .number("Stock must be a number")
    .nonnegative("Stock cannot be negative"),
  category: z
    .string("Category must be a string")
    .min(1, "Category is required"),
});

export const updateProductSchema = createProductSchema.partial();
