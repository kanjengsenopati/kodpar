
import { z } from "zod";
import { sanitizeInput } from "@/utils/security";

export const anggotaFormSchema = z.object({
  anggotaId: z.string()
    .min(1, "ID Anggota harus diisi")
    .max(20, "ID Anggota maksimal 20 karakter")
    .regex(/^[A-Z0-9]+$/, "ID Anggota hanya boleh huruf besar dan angka")
    .transform(sanitizeInput),
  password: z.string()
    .min(1, "Password harus diisi")
});

export const anggotaChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password lama harus diisi"),
  newPassword: z.string()
    .min(8, "Password baru minimal 8 karakter")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 
      "Password harus mengandung huruf besar, kecil, angka, dan karakter khusus"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi password tidak sama",
  path: ["confirmPassword"]
});
