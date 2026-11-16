import fs from "fs";
import path from "path";

const BASE_URL = "{{base_url}}";

interface PostmanItem {
  name: string;
  request: {
    method: string;
    header: Array<{ key: string; value: string; type?: string }>;
    body?: {
      mode: string;
      raw?: string;
      options?: { raw: { language: string } };
      formdata?: Array<{ key: string; value?: string; type: string; src?: string }>;
    };
    url: {
      raw: string;
      host: string[];
      path: string[];
      query?: Array<{ key: string; value: string; description?: string }>;
    };
    description?: string;
  };
}

interface PostmanFolder {
  name: string;
  item: PostmanItem[];
}

export function generatePostmanCollection() {
  const collection = {
    info: {
      name: "Taman Baca Rete Mali - API Documentation & Testing",
      _postman_id: "retemali-api-collection-2026",
      description:
        "Postman Collection untuk Backend REST API Taman Baca Rete Mali (RT 05 / RW 14 Kel. Jatirangga).\nTech Stack: Express 5, TypeScript, PostgreSQL, Prisma 7, Zod, JWT RBAC.",
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    variable: [
      {
        key: "base_url",
        value: "http://localhost:2000",
        type: "string",
      },
      {
        key: "admin_token",
        value: "",
        type: "string",
      },
      {
        key: "volunteer_token",
        value: "",
        type: "string",
      },
      {
        key: "member_token",
        value: "",
        type: "string",
      },
    ],
    item: [
      {
        name: "0. System Health",
        item: [
          {
            name: "Health Check",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${BASE_URL}/health`,
                host: ["{{base_url}}"],
                path: ["health"],
              },
              description: "Mengecek status kesehatan server backend.",
            },
          },
        ],
      },
      {
        name: "1. Auth & Profile",
        item: [
          {
            name: "Register Member Baru",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    name: "Warga Baru Rete Mali",
                    email: "warga.baru@retemali.id",
                    password: "Password123",
                    phone: "081234567890",
                    rtRw: "RT05/RW14",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/auth/register`,
                host: ["{{base_url}}"],
                path: ["api", "auth", "register"],
              },
              description:
                "Registrasi anggota baru dan otomatis menerbitkan Kartu Anggota Digital (#RM-YYYY-XXXX).",
            },
          },
          {
            name: "Login Admin",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    email: "admin@retemali.id",
                    password: "Password123",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/auth/login`,
                host: ["{{base_url}}"],
                path: ["api", "auth", "login"],
              },
              description: "Login untuk role ADMIN.",
            },
          },
          {
            name: "Login Relawan",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    email: "relawan@retemali.id",
                    password: "Password123",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/auth/login`,
                host: ["{{base_url}}"],
                path: ["api", "auth", "login"],
              },
              description: "Login untuk role VOLUNTEER.",
            },
          },
          {
            name: "Login Member",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    email: "rifky@retemali.id",
                    password: "Password123",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/auth/login`,
                host: ["{{base_url}}"],
                path: ["api", "auth", "login"],
              },
              description: "Login untuk role MEMBER.",
            },
          },
          {
            name: "Get Profile Sendiri (/me)",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/auth/me`,
                host: ["{{base_url}}"],
                path: ["api", "auth", "me"],
              },
              description:
                "Mengambil data profil, kartu anggota, target baca, dan poin literasi.",
            },
          },
          {
            name: "Update Profile Sendiri",
            request: {
              method: "PATCH",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    name: "Rifky Darmawan Updated",
                    phone: "081299998888",
                    readingTarget: 25,
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/auth/me`,
                host: ["{{base_url}}"],
                path: ["api", "auth", "me"],
              },
              description: "Memperbarui info profil pengguna.",
            },
          },
          {
            name: "Change Password",
            request: {
              method: "PATCH",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    currentPassword: "Password123",
                    newPassword: "NewPassword2026",
                    confirmPassword: "NewPassword2026",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/auth/change-password`,
                host: ["{{base_url}}"],
                path: ["api", "auth", "change-password"],
              },
              description: "Mengganti password akun.",
            },
          },
          {
            name: "Role Switch (Volunteer / Member)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    role: "MEMBER",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/auth/role-switch`,
                host: ["{{base_url}}"],
                path: ["api", "auth", "role-switch"],
              },
              description: "Beralih peran aktif antara MEMBER dan VOLUNTEER.",
            },
          },
        ],
      },
      {
        name: "2. Books & Catalog",
        item: [
          {
            name: "Get All Books (Filter, Search, Sort)",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${BASE_URL}/api/books?page=1&limit=10&category=PSIKOLOGI&status=AVAILABLE&sortBy=popular&search=Filosofi`,
                host: ["{{base_url}}"],
                path: ["api", "books"],
                query: [
                  { key: "page", value: "1" },
                  { key: "limit", value: "10" },
                  { key: "category", value: "PSIKOLOGI" },
                  { key: "status", value: "AVAILABLE" },
                  { key: "sortBy", value: "popular" },
                  { key: "search", value: "Filosofi" },
                ],
              },
              description: "Menampilkan katalog buku dengan pagination dan filter.",
            },
          },
          {
            name: "Get Detail Book by ID / Code / Slug",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${BASE_URL}/api/books/filosofi-teras`,
                host: ["{{base_url}}"],
                path: ["api", "books", "filosofi-teras"],
              },
              description: "Mengambil detail satu buku.",
            },
          },
          {
            name: "Create New Book (Admin / Volunteer)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{admin_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    title: "Buku Panduan Astronomi",
                    author: "Prof. Hidayat",
                    category: "SAINS_FAKTA",
                    shelfLocation: "Rak D-02",
                    totalStock: 3,
                    isbn: "9786029990001",
                    synopsis: "Panduan lengkap memahami rasi bintang dan langit malam.",
                    publisher: "Sains Media",
                    publishYear: 2024,
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/books`,
                host: ["{{base_url}}"],
                path: ["api", "books"],
              },
              description: "Menambahkan koleksi buku baru.",
            },
          },
        ],
      },
      {
        name: "3. Bookmarks (Simpan Bacaan)",
        item: [
          {
            name: "Get My Bookmarks",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/bookmarks?page=1&limit=10`,
                host: ["{{base_url}}"],
                path: ["api", "bookmarks"],
              },
              description: "Mengambil daftar buku yang disimpan oleh anggota.",
            },
          },
          {
            name: "Toggle / Simpan Bacaan",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    bookId: "filosofi-teras",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/bookmarks`,
                host: ["{{base_url}}"],
                path: ["api", "bookmarks"],
              },
              description: "Menyimpan atau menghapus buku dari daftar bacaan (toggle).",
            },
          },
          {
            name: "Hapus Bookmark",
            request: {
              method: "DELETE",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/bookmarks/filosofi-teras`,
                host: ["{{base_url}}"],
                path: ["api", "bookmarks", "filosofi-teras"],
              },
              description: "Menghapus buku dari simpanan bacaan.",
            },
          },
        ],
      },
      {
        name: "4. Circulation (Reservasi & Pinjam)",
        item: [
          {
            name: "Buat Reservasi Online (Member)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    bookId: "filosofi-teras",
                    pickupCounter: "Loket Sirkulasi A-2",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/circulation/reservations`,
                host: ["{{base_url}}"],
                path: ["api", "circulation", "reservations"],
              },
              description: "Reservasi buku online (tahan stok 48 jam).",
            },
          },
          {
            name: "Get Reservasi Saya",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/circulation/reservations/me`,
                host: ["{{base_url}}"],
                path: ["api", "circulation", "reservations", "me"],
              },
              description: "Mengambil daftar reservasi aktif milik anggota.",
            },
          },
          {
            name: "Sirkulasi Cepat - Checkout Peminjaman (Relawan)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    memberIdentifier: "RM-2024-089",
                    bookIdentifier: "BK-PS-0899",
                    durationDays: 14,
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/circulation/quick-checkout`,
                host: ["{{base_url}}"],
                path: ["api", "circulation", "quick-checkout"],
              },
              description:
                "Sirkulasi cepat di Meja Piket Relawan dengan scan barcode.",
            },
          },
          {
            name: "Sirkulasi Cepat - Pengembalian Buku (Relawan)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    bookIdentifier: "BK-PS-0899",
                    memberIdentifier: "RM-2024-089",
                    returnCondition: "GOOD",
                    notes: "Buku mulus dan tepat waktu",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/circulation/quick-return`,
                host: ["{{base_url}}"],
                path: ["api", "circulation", "quick-return"],
              },
              description:
                "Verifikasi pengembalian buku dan penambahan poin literasi.",
            },
          },
          {
            name: "List Seluruh Peminjaman",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/circulation/loans?page=1&limit=10`,
                host: ["{{base_url}}"],
                path: ["api", "circulation", "loans"],
              },
              description: "Mengambil semua riwayat peminjaman.",
            },
          },
          {
            name: "Cron Check Due Date & Reminder H-2",
            request: {
              method: "POST",
              header: [],
              url: {
                raw: `${BASE_URL}/api/circulation/cron/due-reminders`,
                host: ["{{base_url}}"],
                path: ["api", "circulation", "cron", "due-reminders"],
              },
              description: "Menjalankan pemrosesan cron peringatan jatuh tempo.",
            },
          },
          {
            name: "Remind WhatsApp (Deep Link)",
            request: {
              method: "POST",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/circulation/loans/{{loan_id}}/remind-wa`,
                host: ["{{base_url}}"],
                path: ["api", "circulation", "loans", "{{loan_id}}", "remind-wa"],
              },
              description: "Membuat link WhatsApp langsung ke peminjam yang jatuh tempo.",
            },
          },
        ],
      },
      {
        name: "5. Community Events",
        item: [
          {
            name: "Get All Events",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${BASE_URL}/api/events?page=1&limit=10`,
                host: ["{{base_url}}"],
                path: ["api", "events"],
              },
              description: "Melihat agenda dan kegiatan warga.",
            },
          },
          {
            name: "Create New Event (Admin / Volunteer)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{admin_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    title: "Pojok Sains Eksperimen Cilik: Roket Air",
                    category: "SAINS",
                    description: "Belajar sains fisika sederhana dengan membuat roket air dari botol bekas.",
                    facilitatorName: "Dimas Rizky (Relawan)",
                    location: "Halaman Saung Rete Mali",
                    eventDate: "2026-05-17T00:00:00.000Z",
                    startTime: "15:30",
                    endTime: "17:00",
                    quota: 30,
                    feeType: "FREE",
                    materialsNote: "Bahan Disediakan",
                    isFeatured: true,
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/events`,
                host: ["{{base_url}}"],
                path: ["api", "events"],
              },
              description: "Menambahkan agenda kegiatan baru.",
            },
          },
          {
            name: "Daftar Kegiatan & Terbitkan E-Tiket QR",
            request: {
              method: "POST",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/events/festival-dongeng-nusantara-panggung-boneka/register`,
                host: ["{{base_url}}"],
                path: [
                  "api",
                  "events",
                  "festival-dongeng-nusantara-panggung-boneka",
                  "register",
                ],
              },
              description: "Mendaftar acara dan menghasilkan tiket QR.",
            },
          },
          {
            name: "Get My Tickets",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/events/tickets/me`,
                host: ["{{base_url}}"],
                path: ["api", "events", "tickets", "me"],
              },
              description: "Melihat tiket kegiatan milik anggota.",
            },
          },
          {
            name: "Presensi Gerbang Check-In (Scan Tiket)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    ticketCode: "RETEMALI-EV-2026-0001",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/events/check-in`,
                host: ["{{base_url}}"],
                path: ["api", "events", "check-in"],
              },
              description: "Presensi gerbang check-in peserta dengan QR tiket.",
            },
          },
          {
            name: "Laporan Kehadiran Event (Attendance Report)",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/events/attendance`,
                host: ["{{base_url}}"],
                path: ["api", "events", "attendance"],
              },
              description: "Melihat laporan metrik kehadiran peserta kegiatan.",
            },
          },
          {
            name: "Auto Close Event Timeline Trigger",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{admin_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/events/auto-close`,
                host: ["{{base_url}}"],
                path: ["api", "events", "auto-close"],
              },
              description: "Menjalankan trigger otomatis menutup kegiatan lampau.",
            },
          },
          {
            name: "List Registrasi Peserta Event",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/events/registrations?page=1&limit=10`,
                host: ["{{base_url}}"],
                path: ["api", "events", "registrations"],
              },
              description: "Melihat daftar pendaftaran peserta kegiatan.",
            },
          },
          {
            name: "Verifikasi Pembayaran Tiket Infaq",
            request: {
              method: "PATCH",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    status: "VERIFIED",
                    adminNotes: "Bukti transfer valid dan sesuai nominal infaq.",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/events/registrations/{{registration_id}}/verify`,
                host: ["{{base_url}}"],
                path: [
                  "api",
                  "events",
                  "registrations",
                  "{{registration_id}}",
                  "verify",
                ],
              },
              description: "Memverifikasi atau menolak bukti pembayaran infaq tiket.",
            },
          },
        ],
      },
      {
        name: "6. Volunteer Management",
        item: [
          {
            name: "Apply Calon Relawan Baru",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    majorOrJob: "Teknik Informatika",
                    institution: "Universitas Indonesia",
                    division: "Teknologi IT",
                    motivation: "Ingin berkontribusi membangun sistem digital dan literasi warga.",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/volunteers/apply`,
                host: ["{{base_url}}"],
                path: ["api", "volunteers", "apply"],
              },
              description: "Pendaftaran calon relawan baru.",
            },
          },
          {
            name: "Get All Volunteer Applications (Admin)",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{admin_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/volunteers/applications`,
                host: ["{{base_url}}"],
                path: ["api", "volunteers", "applications"],
              },
              description: "Melihat berkas pendaftaran calon relawan.",
            },
          },
          {
            name: "Clock-In Shift Piket (Relawan)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    shiftType: "SHIFT_PAGI",
                    location: "RT 05 RW 14 Jatirangga • Pos Utama",
                    taskSummary: "Penyortiran Buku Anak & Registrasi Pengunjung",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/volunteers/shifts/clock-in`,
                host: ["{{base_url}}"],
                path: ["api", "volunteers", "shifts", "clock-in"],
              },
              description: "Mulai sesi piket relawan.",
            },
          },
          {
            name: "Clock-Out Shift Piket (Relawan)",
            request: {
              method: "PATCH",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    taskSummary: "Penyortiran selesai 40 buku, melayani 15 pengunjung.",
                    durationHours: 4.0,
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/volunteers/shifts/clock-out`,
                host: ["{{base_url}}"],
                path: ["api", "volunteers", "shifts", "clock-out"],
              },
              description: "Mengakhiri sesi piket relawan.",
            },
          },
          {
            name: "Approve All Shifts (Admin)",
            request: {
              method: "PATCH",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{admin_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/volunteers/shifts/approve-all`,
                host: ["{{base_url}}"],
                path: ["api", "volunteers", "shifts", "approve-all"],
              },
              description: "Menyetujui semua jam piket relawan antrean.",
            },
          },
        ],
      },
      {
        name: "7. Handover Notes (Catatan Piket)",
        item: [
          {
            name: "Get Handover Notes",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/handover-notes?page=1&limit=10`,
                host: ["{{base_url}}"],
                path: ["api", "handover-notes"],
              },
              description: "Melihat catatan pergantian shift relawan.",
            },
          },
          {
            name: "Create Handover Note",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    shiftType: "SHIFT_PAGI",
                    tags: ["Stok Sanitizer Tipis", "Rak Ensiklopedia Rapi"],
                    content: "Kondisi saung rapi, ada 2 donatur drop buku sains, hand sanitizer di meja pos jaga sisa 1 botol.",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/handover-notes`,
                host: ["{{base_url}}"],
                path: ["api", "handover-notes"],
              },
              description: "Menyimpan catatan kendala & logistik piket.",
            },
          },
        ],
      },
      {
        name: "8. Donations (Finansial & Buku)",
        item: [
          {
            name: "Get Donation Summary & Live Feed",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${BASE_URL}/api/donations/summary`,
                host: ["{{base_url}}"],
                path: ["api", "donations", "summary"],
              },
              description: "Mengambil data capaian target donasi dan live feed donatur.",
            },
          },
          {
            name: "Create Financial Donation (QRIS)",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    donorName: "Dian Kusuma",
                    amount: 500000,
                    paymentMethod: "QRIS",
                    purposeLabel: "Donasi Operasional & Snack",
                    isAnonymous: false,
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/donations/financial`,
                host: ["{{base_url}}"],
                path: ["api", "donations", "financial"],
              },
              description: "Membuat transaksi donasi finansial.",
            },
          },
          {
            name: "Create Physical Book Donation",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    donorName: "Budi Santoso",
                    donorBadge: "Warga RW 14",
                    packageTitle: "25 Buku Sains Populer & Ensiklopedia",
                    totalBooks: 25,
                    conditionNote: "Kondisi sangat mulus 90% layak baca",
                    deliveryMethod: "DROP_OFF",
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/donations/books`,
                host: ["{{base_url}}"],
                path: ["api", "donations", "books"],
              },
              description: "Mendaftarkan batch donasi buku fisik.",
            },
          },
          {
            name: "Get Book Donations (Relawan / Admin)",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/donations/books?page=1&limit=10`,
                host: ["{{base_url}}"],
                path: ["api", "donations", "books"],
              },
              description: "Melihat antrean verifikasi buku donasi masuk.",
            },
          },
          {
            name: "Get Cash Report (Laporan Arus Kas Masuk)",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{admin_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/donations/cash-report`,
                host: ["{{base_url}}"],
                path: ["api", "donations", "cash-report"],
              },
              description: "Melihat laporan agregasi kas masuk (donasi, infaq event, denda sirkulasi).",
            },
          },
          {
            name: "Get Payment Accounts (Kanal Pembayaran)",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${BASE_URL}/api/donations/payment-accounts`,
                host: ["{{base_url}}"],
                path: ["api", "donations", "payment-accounts"],
              },
              description: "Mengambil daftar rekening bank & QRIS aktif.",
            },
          },
          {
            name: "Get Payment Setting (Global Gateway)",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${BASE_URL}/api/donations/payment-setting`,
                host: ["{{base_url}}"],
                path: ["api", "donations", "payment-setting"],
              },
              description: "Mengambil pengaturan global rekening dan QRIS.",
            },
          },
        ],
      },
      {
        name: "9. Dashboard Aggregations",
        item: [
          {
            name: "Dashboard Public",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${BASE_URL}/api/dashboard/public`,
                host: ["{{base_url}}"],
                path: ["api", "dashboard", "public"],
              },
              description: "Metrik agregat untuk beranda umum.",
            },
          },
          {
            name: "Dashboard Member",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/dashboard/member`,
                host: ["{{base_url}}"],
                path: ["api", "dashboard", "member"],
              },
              description: "Metrik agregat untuk portal anggota.",
            },
          },
          {
            name: "Dashboard Volunteer",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/dashboard/volunteer`,
                host: ["{{base_url}}"],
                path: ["api", "dashboard", "volunteer"],
              },
              description: "Metrik agregat untuk meja operasional relawan.",
            },
          },
          {
            name: "Dashboard Admin",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{admin_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/dashboard/admin`,
                host: ["{{base_url}}"],
                path: ["api", "dashboard", "admin"],
              },
              description: "Metrik agregat untuk konsol administrator.",
            },
          },
        ],
      },
      {
        name: "10. Audit Logs",
        item: [
          {
            name: "Get System Audit Logs (Admin)",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{admin_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/audit-logs?page=1&limit=10`,
                host: ["{{base_url}}"],
                path: ["api", "audit-logs"],
              },
              description: "Melihat log aktivitas sistem.",
            },
          },
        ],
      },
      {
        name: "11. Gallery Module (Google Maps Style)",
        item: [
          {
            name: "Get Place Info (Google Maps Profile)",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${BASE_URL}/api/gallery/place-info`,
                host: ["{{base_url}}"],
                path: ["api", "gallery", "place-info"],
              },
              description: "Profil tempat: Koordinat GPS, jam operasional, rating, fasilitas.",
            },
          },
          {
            name: "Get All Gallery Photos",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${BASE_URL}/api/gallery?page=1&limit=12&category=KEGIATAN`,
                host: ["{{base_url}}"],
                path: ["api", "gallery"],
              },
              description: "Melihat galeri foto dengan filter kategori (SUASANA, KEGIATAN, FASILITAS, KOLEKSI).",
            },
          },
          {
            name: "Upload Gallery Photo",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                {
                  key: "Authorization",
                  value: "Bearer {{volunteer_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    title: "Kegiatan Membaca Bersama Anak",
                    caption: "Antusiasme anak-anak membaca buku cerita bergambar.",
                    category: "KEGIATAN",
                    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
                    isFeatured: true,
                  },
                  null,
                  2,
                ),
                options: { raw: { language: "json" } },
              },
              url: {
                raw: `${BASE_URL}/api/gallery`,
                host: ["{{base_url}}"],
                path: ["api", "gallery"],
              },
              description: "Mengunggah foto galeri baru (file multipart atau imageUrl).",
            },
          },
          {
            name: "Delete Gallery Photo",
            request: {
              method: "DELETE",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{admin_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/gallery/{{photo_id}}`,
                host: ["{{base_url}}"],
                path: ["api", "gallery", "{{photo_id}}"],
              },
              description: "Menghapus foto galeri.",
            },
          },
        ],
      },
      {
        name: "12. Notification Feed",
        item: [
          {
            name: "Get Notification Feed",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{member_token}}",
                },
              ],
              url: {
                raw: `${BASE_URL}/api/notifications`,
                host: ["{{base_url}}"],
                path: ["api", "notifications"],
              },
              description: "Feed terpadu notifikasi kegiatan baru, closing event, pengingat pengembalian H-2, dll.",
            },
          },
        ],
      },
    ],
  };

  const outputPath = path.resolve(
    "/workspace/Projects/Retemali/Retemali_Backend_Postman_Collection.json",
  );
  fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), "utf-8");
  console.log(`[SUCCESS] Postman Collection exported to: ${outputPath}`);

  const environment = {
    id: "retemali-local-env",
    name: "Retemali Local Environment",
    values: [
      {
        key: "base_url",
        value: "http://localhost:2000",
        enabled: true,
      },
      {
        key: "admin_token",
        value: "",
        enabled: true,
      },
      {
        key: "volunteer_token",
        value: "",
        enabled: true,
      },
      {
        key: "member_token",
        value: "",
        enabled: true,
      },
    ],
    _postman_variable_scope: "environment",
  };

  const envOutputPath = path.resolve(
    "/workspace/Projects/Retemali/Retemali_Postman_Environment.json",
  );
  fs.writeFileSync(envOutputPath, JSON.stringify(environment, null, 2), "utf-8");
  console.log(`[SUCCESS] Postman Environment exported to: ${envOutputPath}`);
}

generatePostmanCollection();
