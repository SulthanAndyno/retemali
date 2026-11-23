-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "siteName" TEXT NOT NULL DEFAULT 'Taman Baca Rete Mali',
    "tagline" TEXT NOT NULL DEFAULT 'Ruang belajar & literasi warga',
    "address" TEXT NOT NULL DEFAULT 'RT 05 RW 14 Kelurahan Jatirangga',
    "phone" TEXT NOT NULL DEFAULT '+62 812-0000-0000',
    "email" TEXT NOT NULL DEFAULT 'halo@retemali.id',
    "mapsUrl" TEXT,
    "instagramUrl" TEXT,
    "openDays" TEXT NOT NULL DEFAULT 'Selasa - Minggu',
    "openHours" TEXT NOT NULL DEFAULT '09:00 - 18:00 WIB',
    "donationInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- Seed baris tunggal supaya endpoint GET selalu punya data awal.
INSERT INTO "SiteSetting" ("id", "donationInstructions", "updatedAt")
VALUES (
    'default',
    'Transfer ke rekening resmi Rete Mali, lalu unggah bukti pembayaran pada halaman donasi.',
    CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;
