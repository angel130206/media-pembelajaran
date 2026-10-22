import { z } from "zod";
export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 huruf").max(100),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter").max(100),
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export const onboardingSchema = z.object({
  minat: z.enum(["kuliner","fashion","jasa","kerajinan","digital","lainnya"]),
  pengalaman: z.enum(["pemula","pernah_jualan"]),
});
export const materiSchema = z.object({
  judul: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).optional(),
  ringkasan: z.string().max(500).optional(),
  sampulUrl: z.string().url().optional().or(z.literal("")),
  isi: z.string().min(1, "Isi materi wajib diisi"),
  status: z.enum(["draf","terbit"]),
  urutan: z.number().int().optional(),
});
export const soalSetSchema = z.object({
  materiId: z.string().uuid().or(z.string().min(1)),
  judul: z.string().min(3),
});
export const soalSchema = z.object({
  pertanyaan: z.string().min(5),
  opsi: z.array(z.string().min(1)).length(4),
  kunci: z.number().int().min(0).max(3),
  pembahasan: z.string().optional(),
  urutan: z.number().int().optional(),
});
export const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  materiId: z.string().optional(),
  soalId: z.string().optional(),
});
export const csvSoalRow = z.object({
  pertanyaan: z.string(),
  opsi_a: z.string(),
  opsi_b: z.string(),
  opsi_c: z.string(),
  opsi_d: z.string(),
  kunci: z.string(), // A-D or 0-3
  pembahasan: z.string().optional(),
});
