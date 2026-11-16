import { z } from "zod";

export enum GalleryCategory {
  SUASANA = "SUASANA",
  KEGIATAN = "KEGIATAN",
  FASILITAS = "FASILITAS",
  KOLEKSI = "KOLEKSI",
}

export const createGalleryPhotoSchema = z.object({
  title: z
    .string()
    .min(3, "Judul foto minimal 3 karakter")
    .max(150, "Judul foto maksimal 150 karakter")
    .trim(),

  category: z.nativeEnum(GalleryCategory, {
    error:
      "Kategori galeri tidak valid. Pilih: SUASANA, KEGIATAN, FASILITAS, atau KOLEKSI",
  }),

  imageUrl: z
    .string()
    .url("Format URL gambar tidak valid")
    .trim()
    .optional(),

  caption: z
    .string()
    .max(1000, "Keterangan/caption foto maksimal 1000 karakter")
    .trim()
    .optional(),

  location: z
    .string()
    .max(150, "Lokasi maksimal 150 karakter")
    .trim()
    .default("Saung Baca Rete Mali, Jatirangga"),

  isFeatured: z
    .union([z.string().transform((v) => v === "true"), z.boolean()])
    .optional()
    .default(false),

  sortOrder: z
    .union([
      z
        .string()
        .regex(/^\d+$/)
        .transform((val) => parseInt(val, 10)),
      z.number().int(),
    ])
    .optional()
    .default(0),
});

export const updateGalleryPhotoSchema = createGalleryPhotoSchema.partial();

export const galleryQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().default("1"),
  limit: z.string().regex(/^\d+$/).optional().default("12"),
  category: z.nativeEnum(GalleryCategory).optional(),
  isFeatured: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  search: z.string().max(100).trim().optional(),
});

export type CreateGalleryPhotoInput = z.infer<typeof createGalleryPhotoSchema>;
export type UpdateGalleryPhotoInput = z.infer<typeof updateGalleryPhotoSchema>;
export type GalleryQueryInput = z.infer<typeof galleryQuerySchema>;
