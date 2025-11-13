import { z } from "zod";

// Schema untuk registrasi
export const registerSchema = z.object({
  username: z
    .string({ message: "Username wajib diisi" })
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh berisi huruf, angka, dan underscore"
    ),
  email: z
    .string({ message: "Email wajib diisi" })
    .email("Format email tidak valid")
    .toLowerCase(),
  password: z
    .string({ message: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password terlalu panjang"),
});

// Schema untuk login
export const loginSchema = z.object({
  email: z
    .string({ message: "Email wajib diisi" })
    .email("Format email tidak valid")
    .toLowerCase(),
  password: z
    .string({ message: "Password wajib diisi" })
    .min(1, "Password tidak boleh kosong"),
});

// Schema untuk create todo
export const createTodoSchema = z.object({
  title: z
    .string({ message: "Judul wajib diisi" })
    .min(1, "Judul tidak boleh kosong")
    .max(200, "Judul terlalu panjang"),
  description: z
    .string({ message: "Deskripsi wajib diisi" })
    .min(1, "Deskripsi tidak boleh kosong")
    .max(1000, "Deskripsi terlalu panjang"),
  deadline: z
    .string()
    .datetime("Format tanggal tidak valid")
    .optional()
    .nullable(),
});

// Schema untuk update todo
export const updateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(1000).optional(),
  completed: z.boolean().optional(),
  deadline: z.string().datetime().optional().nullable(),
});

// Types yang dihasilkan dari schema
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
