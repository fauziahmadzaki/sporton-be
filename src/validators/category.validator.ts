import z from "zod";

export const createCategorySchema = z.object({
  name: z.string("Name must be a string").min(1, "Name is required"),
  description: z.string("Description must be a string").optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
