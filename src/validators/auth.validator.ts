import z from "zod";

export const signinSchema = z.object({
  email: z
    .string("Email must be a string")
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string("Password must be a string")
    .min(6, "Password must be at least 6 characters long"),
});

export const initiateAdminUserSchema = z.object({
  email: z
    .string("Email must be a string")
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string("Password must be a string")
    .min(6, "Password must be at least 6 characters long"),
  name: z.string("Name must be a string").min(1, "Name is required"),
});
