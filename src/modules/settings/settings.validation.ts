import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500, "URL terlalu panjang")
  .url("Format URL tidak valid (contoh: https://maps.google.com/...)")
  .or(z.literal(""))
  .optional();

/**
 * Semua field opsional supaya form admin bisa menyimpan sebagian perubahan
 * (mis. hanya jam operasional) tanpa mengirim ulang seluruh profil.
 */
export const updateSiteSettingSchema = z
  .object({
    siteName: z
      .string()
      .trim()
      .min(1, "Nama situs wajib diisi")
      .max(120, "Nama situs maksimal 120 karakter")
      .optional(),
    tagline: z.string().trim().max(160).optional(),
    address: z
      .string()
      .trim()
      .min(1, "Alamat wajib diisi")
      .max(255, "Alamat maksimal 255 karakter")
      .optional(),
    phone: z
      .string()
      .trim()
      .min(6, "Nomor telepon minimal 6 karakter")
      .max(32, "Nomor telepon maksimal 32 karakter")
      .optional(),
    email: z.string().trim().email("Format email tidak valid").max(120).optional(),
    mapsUrl: optionalUrl,
    instagramUrl: optionalUrl,
    openDays: z.string().trim().max(80).optional(),
    openHours: z.string().trim().max(80).optional(),
    donationInstructions: z.string().trim().max(2000).optional(),
  })
  .strict();

export type UpdateSiteSettingInput = z.infer<typeof updateSiteSettingSchema>;
