import { z } from "zod";

export const notificationQuerySchema = z.object({
  limit: z.string().regex(/^\d+$/).optional().default("20"),
});

export const createBroadcastSchema = z.object({
  title: z
    .string()
    .min(3, "Judul pengumuman minimal 3 karakter")
    .max(150, "Judul pengumuman maksimal 150 karakter")
    .trim(),
  description: z
    .string()
    .min(5, "Isi pengumuman minimal 5 karakter")
    .max(1000, "Isi pengumuman maksimal 1000 karakter")
    .trim(),
  target: z
    .string()
    .max(60, "Target penerima maksimal 60 karakter")
    .trim()
    .optional()
    .default("Semua Anggota & Relawan"),
});

export type NotificationQueryInput = z.infer<typeof notificationQuerySchema>;
export type CreateBroadcastInput = z.infer<typeof createBroadcastSchema>;
