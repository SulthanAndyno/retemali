# Taman Baca Rete Mali - Backend REST API 📚✨

Backend REST API untuk **Taman Baca Rete Mali**, dibangun dengan **Express 5**, **TypeScript**, **PostgreSQL** via **Prisma 7**, **Zod Validation**, dan **JWT Authentication**.

Proyek ini dirancang menggunakan arsitektur modular (*Controller - Service - Repository*) yang terstruktur, aman, dan mudah diintegrasikan dengan Frontend Next.js.

---

## 🚀 Tech Stack

- **Runtime & Framework**: Node.js (v20+) & Express 5
- **Language**: TypeScript 5.8
- **Database & ORM**: PostgreSQL 16+ & Prisma ORM 7
- **Authentication**: JWT (JSON Web Token) & Argon2 / Bcrypt Password Hashing
- **Validation**: Zod Schemas
- **File Uploads**: Multer (Cover Buku, Avatar, E-Ticket, Bukti Donasi, Galeri Foto)
- **Code Generators**: Nanoid (Kode Buku `BK-XX-XXXX`, Member `#RM-YYYY-XXXX`, Invoice `INV-RM-YYYY-XXXX`, E-Ticket `RETEMALI-EV-XXXXXX`)

---

## 📂 Struktur Modul Bisnis & Endpoint API

Backend ini mencakup **12 modul bisnis utama** dengan total **77 Endpoints REST API** terverifikasi:

### 1. Authentication & Profile (`/api/auth`)
- `POST /api/auth/register`: Registrasi kartu anggota baru `#RM-YYYY-XXXX`.
- `POST /api/auth/login`: Login pengguna (Member, Relawan, Admin) dan menerbitkan JWT token.
- `GET /api/auth/me`: Mengambil profil pengguna yang sedang login.
- `PATCH /api/auth/me`: Update profil anggota (+ upload foto avatar).
- `PATCH /api/auth/change-password`: Ganti password akun.
- `POST /api/auth/role-switch`: Switch mode peran aktif (`MEMBER` ↔ `VOLUNTEER` ↔ `ADMIN`) & menerbitkan token JWT baru.

### 2. Katalog Buku & Koleksi (`/api/books`)
- `GET /api/books`: Daftar katalog buku dengan filter kategori, stok, rating, dan pencarian judul/penulis.
- `GET /api/books/bookmarks/me`: Alias daftar bookmark anggota sendiri.
- `GET /api/books/:id`: Detail informasi buku & ketersediaan stok fisik.
- `POST /api/books/:id/bookmark`: Alias toggle simpan/hapus bookmark buku.
- `POST /api/books`: Tambah buku baru (+ upload cover) & auto-generate barcode `BK-XX-XXXX`.
- `PATCH /api/books/:id`: Update data dan lokasi rak buku.
- `DELETE /api/books/:id`: Hapus buku dari katalog.

### 3. Daftar Bacaan / Bookmark (`/api/bookmarks`)
- `GET /api/bookmarks`: Daftar buku yang disimpan/dibookmark oleh anggota.
- `POST /api/bookmarks`: Simpan buku ke daftar bacaan favorit.
- `DELETE /api/bookmarks/:bookId`: Hapus buku dari daftar simpanan bacaan.

### 4. Sirkulasi Peminjaman & Otomasi 48 Jam (`/api/circulation`)
- `POST /api/circulation/reservations`: Reservasi buku online (tahan 48 jam sebelum auto-cancel).
- `GET /api/circulation/reservations/me`: Daftar reservasi aktif milik anggota.
- `PATCH /api/circulation/reservations/:id/cancel`: Pembatalan reservasi buku.
- `POST /api/circulation/quick-checkout`: Sirkulasi cepat (Peminjaman Baru) scan barcode anggota & buku + hook AuditLog.
- `POST /api/circulation/quick-return`: Sirkulasi cepat (Pengembalian Buku) scan barcode buku + hook AuditLog.
- `GET /api/circulation/loans`: Seluruh transaksi peminjaman (filter status: BORROWED, RETURNED, OVERDUE, LOST).
- `GET /api/circulation/loans/me`: Riwayat dan pinjaman aktif anggota sendiri.
- `PATCH /api/circulation/loans/:id/extend`: Perpanjang masa pinjam buku (+7 hari, maks 1x) + hook AuditLog.
- `PATCH /api/circulation/loans/:id/mark-lost`: Menandai buku sebagai hilang (LOST) dan penyesuaian stok.
- `POST /api/circulation/loans/:id/remind-wa`: Generate link WhatsApp langsung (`https://wa.me/...`) & catat reminder.
- `POST /api/circulation/cron/due-reminders`: Endpoint Cron Job H-2 jatuh tempo & auto-cancel reservasi lewat 48 jam.

### 5. Agenda Komunitas & Tiket QR Code (`/api/events`)
- `GET /api/events`: Daftar agenda kegiatan komunitas (filter kategori, biaya, status).
- `GET /api/events/auto-close`: Evaluasi status timeline & kuota (kegiatan otomatis ditutup jika waktu lewat).
- `GET /api/events/attendance`: Laporan Presensi Kegiatan (Attendance Report) per event & rekap hadir.
- `GET /api/events/registrations`: Daftar pendaftar kegiatan khusus verifikasi tiket infaq/berbayar.
- `PATCH /api/events/registrations/:registrationId/verify`: Approve/Reject bukti bayar event berbayar (kuota kembali jika ditolak).
- `GET /api/events/tickets/me`: Daftar E-Tiket kegiatan milik anggota sendiri.
- `POST /api/events/check-in`: Presensi scan QR E-Tiket peserta di lokasi kegiatan.
- `POST /api/events/propose`: Usulkan kegiatan baru oleh relawan/warga (Status: DRAFT).
- `GET /api/events/:id`: Detail kegiatan komunitas.
- `POST /api/events`: Buat kegiatan baru (+ upload banner) + hook otomatis AuditLog.
- `PATCH /api/events/:id`: Update info kegiatan.
- `DELETE /api/events/:id`: Hapus kegiatan komunitas + hook AuditLog.
- `POST /api/events/:id/register`: Daftar kegiatan, generate E-Tiket QR `RETEMALI-EV-XXX` (+ upload bukti transfer jika berbayar).
- `POST /api/events/:id/report`: Submit laporan paska-acara oleh relawan pelaksana.
- `PATCH /api/events/:id/approve-report`: Persetujuan laporan kegiatan oleh Admin.

### 6. Program Relawan & Jam Kerja (`/api/volunteers`)
- `POST /api/volunteers/apply`: Formulir pendaftaran relawan baru (+ upload CV/dokumen).
- `GET /api/volunteers/applications`: Daftar antrean kurasi aplikasi relawan (khusus Admin).
- `PATCH /api/volunteers/applications/:id/review`: Setujui/Tolak pendaftar relawan (Approve/Reject).
- `POST /api/volunteers/shifts/clock-in`: Presensi kehadiran shift relawan (Clock-In).
- `PATCH /api/volunteers/shifts/clock-out`: Selesai shift jaga (Clock-Out) & auto-kalkulasi durasi jam kontribusi.
- `GET /api/volunteers/shifts`: Monitoring seluruh shift relawan (khusus Admin).
- `PATCH /api/volunteers/shifts/approve-all`: Persetujuan massal (Batch Approve) shift relawan oleh Admin.
- `PATCH /api/volunteers/shifts/:id/approve`: Persetujuan satu shift relawan oleh Admin.
- `GET /api/volunteers/handover-notes`: Alias catatan serah terima shift relawan.
- `POST /api/volunteers/handover-notes`: Alias pembuatan catatan serah terima shift relawan.

### 7. Catatan Operasional / Handover Shift (`/api/handover-notes`)
- `GET /api/handover-notes`: Daftar catatan operasional pergantian shift (filter tag: URGENT, FACILITY, EVENT, GENERAL).
- `POST /api/handover-notes`: Buat catatan kendala & logistik piket untuk shift berikutnya.
- `DELETE /api/handover-notes/:id`: Hapus catatan piket.

### 8. Donasi Keuangan & Buku Fisik (`/api/donations`)
- `GET /api/donations/cash-report`: Rekap Laporan Kas Terpadu (Cash Report) dari donasi uang, infaq event, dan denda pinjaman.
- `GET /api/donations/payment-accounts`: Daftar rekening bank & QRIS aktif.
- `GET /api/donations/payment-setting`: Pengaturan rekening pembayaran default yayasan.
- `GET /api/donations/summary`: Capaian target donasi kuartal & live feed ticker donatur.
- `POST /api/donations/financial`: Transaksi donasi keuangan (QRIS Statis NMID `ID1024389271649` / Transfer Bank).
- `POST /api/donations/webhook`: Callback webhook payment gateway verifikasi otomatis.
- `GET /api/donations/financial/:receiptCode`: Unduh digital receipt/invoice resmi `INV-RM-YYYY-XXXX`.
- `POST /api/donations/books`: Formulir donasi buku fisik (Drop-off / Kurir ekspedisi).
- `GET /api/donations/books`: Antrean kurasi donasi buku masuk di meja operasional.
- `PATCH /api/donations/books/:id/verify`: Verifikasi & terima batch buku oleh relawan.

### 9. Galeri Foto ala Google Maps (`/api/gallery`)
- `GET /api/gallery`: Daftar foto galeri dengan filter kategori (`SUASANA`, `KEGIATAN`, `FASILITAS`, `KOLEKSI`).
- `GET /api/gallery/place-info`: Kartu profil tempat ala Google Maps (alamat lengkap, koordinat GPS, jam operasional, fasilitas, dan statistik foto).
- `GET /api/gallery/:id`: Detail satu foto galeri.
- `POST /api/gallery`: Unggah foto baru ke galeri (+ upload gambar) oleh Relawan/Admin.
- `PATCH /api/gallery/:id`: Update keterangan foto atau kategori.
- `DELETE /api/gallery/:id`: Hapus foto galeri secara permanen.

### 10. Notifikasi Aktivitas (`/api/notifications`)
- `GET /api/notifications`: Feed notifikasi aktivitas sistem (audit log terbaru, event baru diumumkan, penutupan event, dan reminder pinjaman buku).

### 11. Multi-Dashboard Real-time (`/api/dashboard`)
- `GET /api/dashboard/public`: Metrik ringkasan publik (koleksi buku, anggota aktif, kegiatan pekan ini).
- `GET /api/dashboard/member`: Portal Anggota (Kartu Digital, pinjaman aktif, reservasi 48 jam, tiket event saya).
- `GET /api/dashboard/volunteer`: Meja Operasional Relawan (shift jaga aktif, metrik hari ini, antrean kurasi donasi).
- `GET /api/dashboard/admin`: Konsol Administrator Utama (4 KPI utama, peringatan terlambat, approval relawan, audit live feed).

### 12. Audit Log System (`/api/audit-logs`)
- `GET /api/audit-logs`: Rekam jejak seluruh aktivitas penting sistem secara permanen (filter per kategori: `DONATION`, `VOLUNTEER`, `CIRCULATION`, `EVENT`, `GALLERY`).

---

## 🛠️ Panduan Instalasi & Menjalankan Lokal

### 1. Clone Repository
```bash
git clone https://github.com/SulthanAndyno/retemali_be.git
cd retemali_be
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment (`.env`)
Salin file `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi koneksi database PostgreSQL dan secret key:
```env
PORT=2000
NODE_ENV=development
CLIENT_URL="http://localhost:3000"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/retemali_db?schema=public"
JWT_SECRET="retemali_super_secret_jwt_key_2026_literasi_tanpa_batas"
CRON_SECRET="retemali-cron-secret-2026"
```

### 4. Sinkronisasi Database & Seed Data
```bash
# Push schema Prisma ke database PostgreSQL
npx prisma db push

# Jalankan seeder akun default dan master data
npm run prisma:seed
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Server akan aktif di `http://localhost:2000` (API endpoint di `http://localhost:2000/api`).

---

## 🔑 Akun Demo Testing (Default Seed)

Data akun bawaan yang digenerate oleh `prisma/seed.ts` dan digunakan pada rangkaian automated test:

| Role | Nama Akun | Email | Password | Keterangan |
|---|---|---|---|---|
| **Admin** | Koordinator Rete Mali | `admin@retemali.id` | `Password123` | Akses penuh seluruh sistem, approval relawan & laporan kas |
| **Relawan (Volunteer)** | Bunga Lestari | `relawan@retemali.id` | `Password123` | Meja sirkulasi, kurasi donasi, presensi shift & agenda komunitas |
| **Member** | Rifky Darmawan | `rifky@retemali.id` | `Password123` | Peminjaman buku, bookmark, pendaftaran event & donasi |

---

## 🧪 Testing

Jalankan pengujian otomatis untuk memastikan seluruh modul dan endpoint berfungsi dengan baik:
```bash
# Compile TypeScript check
npm run build

# Jalankan testing komprehensif E2E (End-to-End) 67 skenario test
npm run test:e2e
```
