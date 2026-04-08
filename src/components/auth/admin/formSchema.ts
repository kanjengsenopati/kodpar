
import { z } from "zod";
import { validatePassword } from "@/utils/security";

export const adminLoginFormSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().refine((password) => {
    const validation = validatePassword(password);
    return validation.isValid;
  }, {
    message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
  }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
