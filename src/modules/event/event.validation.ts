import { z } from "zod";

export enum EventCategory {
  ANAK = "ANAK",
  SAINS = "SAINS",
  KLUB_BUKU = "KLUB_BUKU",
  MENULIS = "MENULIS",
  DONGENG = "DONGENG",
  UMUM = "UMUM",
}

export enum EventFeeType {
  FREE = "FREE",
  PAID = "PAID",
}

export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export const createEventSchema = z.object({
  title: z
    .string()
    .min(5, "Judul kegiatan minimal 5 karakter")
    .max(150, "Judul kegiatan maksimal 150 karakter")
    .trim(),

  category: z.nativeEnum(EventCategory, {
    error:
      "Kategori kegiatan tidak valid. Pilih: ANAK, SAINS, KLUB_BUKU, MENULIS, DONGENG, atau UMUM",
  }),

  description: z
    .string()
    .min(10, "Deskripsi kegiatan minimal 10 karakter")
    .max(2000, "Deskripsi kegiatan maksimal 2000 karakter")
    .trim(),

  facilitatorName: z
    .string()
    .min(2, "Nama fasilitator/pemateri wajib diisi")
    .max(100, "Nama fasilitator maksimal 100 karakter")
    .trim(),

  location: z
    .string()
    .min(2, "Lokasi ruang pelaksanaan wajib diisi")
    .max(150, "Lokasi maksimal 150 karakter")
    .trim()
    .default("Pendopo Terbuka Rete Mali"),

  eventDate: z
    .string()
    .min(1, "Tanggal kegiatan wajib diisi")
    .transform((val) => new Date(val)),

  startTime: z.string().min(1, "Jam mulai wajib diisi (contoh: 09:00)").trim(),

  endTime: z.string().min(1, "Jam selesai wajib diisi (contoh: 11:30)").trim(),

  quota: z.union([
    z
      .string()
      .regex(/^\d+$/, "Kuota peserta harus berupa angka")
      .transform((val) => parseInt(val, 10)),
    z.number().int().min(1),
  ]),

  feeType: z.nativeEnum(EventFeeType).default(EventFeeType.FREE),

  /**
   * Harga tiket masuk (Rp). 0 / kosong berarti kegiatan gratis.
   */
  ticketPrice: z
    .union([
      z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Harga tiket masuk harus berupa angka")
        .transform((val) => parseFloat(val)),
      z.number().min(0),
    ])
    .optional(),

  /**
   * Alias lama untuk `ticketPrice` (kolom sebelumnya bernama `infaqAmount`).
   * Dipertahankan agar klien lama tidak langsung rusak; nilai baru menang.
   */
  infaqAmount: z
    .union([
      z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/)
        .transform((val) => parseFloat(val)),
      z.number().min(0),
    ])
    .optional(),

  /**
   * Berapa hari sebelum pelaksanaan pendaftaran ditutup otomatis: H-3, H-2, H-1.
   */
  registrationCloseOffsetDays: z
    .union([
      z
        .string()
        .regex(/^[123]$/, "Batas pendaftaran harus H-3, H-2, atau H-1")
        .transform((val) => parseInt(val, 10)),
      z.number().int().min(1).max(3),
    ])
    .optional()
    .default(1),

  materialsNote: z.string().max(100).trim().optional(),

  isFeatured: z
    .union([z.string().transform((v) => v === "true"), z.boolean()])
    .optional()
    .default(false),

  status: z.nativeEnum(EventStatus).optional().default(EventStatus.PUBLISHED),
});

export const updateEventSchema = createEventSchema.partial();

export const eventQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().default("1"),
  limit: z.string().regex(/^\d+$/).optional().default("10"),
  category: z.nativeEnum(EventCategory).optional(),
  feeType: z.nativeEnum(EventFeeType).optional(),
  status: z.nativeEnum(EventStatus).optional(),
  isFeatured: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  search: z.string().max(100).trim().optional(),
});

export const registerEventSchema = z.object({
  paymentProofUrl: z.string().trim().optional(),
  paymentProof: z.string().trim().optional(),
  paymentNote: z.string().max(255).trim().optional(),
});

export const checkInTicketSchema = z.object({
  ticketCode: z
    .string()
    .min(1, "Kode Tiket peserta wajib diisi (contoh: TKT-882901)")
    .trim(),
});

export const submitEventReportSchema = z.object({
  reportSummary: z
    .string()
    .min(10, "Ringkasan laporan paska-acara minimal 10 karakter")
    .max(3000, "Ringkasan laporan maksimal 3000 karakter")
    .trim(),
});

export const attendanceReportQuerySchema = z.object({
  from: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  to: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  eventId: z.string().optional(),
});

export const eventRegistrationsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().default("1"),
  limit: z.string().regex(/^\d+$/).optional().default("20"),
  eventId: z.string().optional(),
  status: z.enum(["REGISTERED", "CHECKED_IN", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["PENDING", "VERIFIED", "FAILED"]).optional(),
});

export const verifyRegistrationPaymentSchema = z
  .object({
    status: z.enum(["VERIFIED", "FAILED"], {
      error: "Status verifikasi harus VERIFIED atau FAILED",
    }),
    paymentNote: z.string().max(255).optional(),
    adminNotes: z.string().max(255).optional(),
  })
  .transform((val) => ({
    status: val.status,
    paymentNote: val.paymentNote ?? val.adminNotes,
  }));

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventQueryInput = z.infer<typeof eventQuerySchema>;
export type RegisterEventInput = z.infer<typeof registerEventSchema>;
export type CheckInTicketInput = z.infer<typeof checkInTicketSchema>;
export type SubmitEventReportInput = z.infer<typeof submitEventReportSchema>;
export type AttendanceReportQueryInput = z.infer<
  typeof attendanceReportQuerySchema
>;
export type EventRegistrationsQueryInput = z.infer<
  typeof eventRegistrationsQuerySchema
>;
export type VerifyRegistrationPaymentInput = z.infer<
  typeof verifyRegistrationPaymentSchema
>;
