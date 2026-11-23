import "dotenv/config";
import app from "../src/app";
import http from "http";

const PORT = 2000;
let server: http.Server;
const BASE_URL = `http://localhost:${PORT}`;

interface TestResult {
  name: string;
  status: "PASS" | "FAIL";
  httpStatus: number;
  expectedStatus: number;
  details?: string;
}

const results: TestResult[] = [];

async function request(
  method: string,
  endpoint: string,
  body?: any,
  token?: string,
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = {};
  if (body) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return { status: res.status, data };
}

function record(
  name: string,
  actual: number,
  expected: number,
  data?: any,
) {
  const isPass = actual === expected;
  results.push({
    name,
    status: isPass ? "PASS" : "FAIL",
    httpStatus: actual,
    expectedStatus: expected,
    details: isPass
      ? undefined
      : `Response: ${JSON.stringify(data)?.slice(0, 150)}`,
  });

  const icon = isPass ? "✅" : "❌";
  console.log(`${icon} [${actual}] ${name}`);
  if (!isPass) {
    console.error(`   Error details:`, data);
  }
}

async function runTests() {
  console.log("==========================================================");
  console.log("🚀 STARTING RETEMALI BACKEND COMPREHENSIVE E2E TEST SUITE");
  console.log("==========================================================\n");

  // 1. Health
  console.log("--- 0. SYSTEM HEALTH ---");
  const health = await request("GET", "/health");
  record("GET /health", health.status, 200, health.data);

  // 2. Auth & Profiles
  console.log("\n--- 1. AUTH & PROFILE MODULE ---");
  const regEmail = `testuser.${Date.now()}@retemali.id`;
  const register = await request("POST", "/api/auth/register", {
    name: "Pengujian Anggota Baru",
    email: regEmail,
    password: "Password123",
    phone: "081234567890",
    rtRw: "RT05/RW14",
  });
  record("POST /api/auth/register (Member Baru)", register.status, 201, register.data);
  const newMemberToken = register.data?.data?.token;
  const newMemberCode = register.data?.data?.user?.memberCode;

  const loginAdmin = await request("POST", "/api/auth/login", {
    email: "admin@retemali.id",
    password: "Password123",
  });
  record("POST /api/auth/login (Admin)", loginAdmin.status, 200, loginAdmin.data);
  const adminToken = loginAdmin.data?.data?.token;

  const loginVol = await request("POST", "/api/auth/login", {
    email: "relawan@retemali.id",
    password: "Password123",
  });
  record("POST /api/auth/login (Volunteer)", loginVol.status, 200, loginVol.data);
  let volunteerToken = loginVol.data?.data?.token;

  const loginMem = await request("POST", "/api/auth/login", {
    email: "rifky@retemali.id",
    password: "Password123",
  });
  record("POST /api/auth/login (Member Rifky)", loginMem.status, 200, loginMem.data);
  const memberToken = loginMem.data?.data?.token;

  const profile = await request("GET", "/api/auth/me", undefined, memberToken);
  record("GET /api/auth/me (Profil & Poin)", profile.status, 200, profile.data);

  const updateProfile = await request(
    "PATCH",
    "/api/auth/me",
    { readingTarget: 25 },
    memberToken,
  );
  record("PATCH /api/auth/me (Update Target Baca)", updateProfile.status, 200, updateProfile.data);

  // 2b. Role Switch Feature
  console.log("\n--- 1b. VOLUNTEER ROLE SWITCH FEATURE ---");
  const switchRoleToMember = await request(
    "POST",
    "/api/auth/role-switch",
    { role: "MEMBER" },
    volunteerToken,
  );
  record("POST /api/auth/role-switch (Volunteer -> MEMBER mode)", switchRoleToMember.status, 200, switchRoleToMember.data);
  const switchedMemberToken = switchRoleToMember.data?.data?.token;

  // Test that in MEMBER mode, volunteer cannot access volunteer-only endpoint
  const testDeniedAccess = await request(
    "GET",
    "/api/volunteers/applications",
    undefined,
    switchedMemberToken,
  );
  record("GET /api/volunteers/applications in MEMBER mode (Forbidden 403)", testDeniedAccess.status, 403, testDeniedAccess.data);

  // Switch back to VOLUNTEER mode
  const switchBackToVolunteer = await request(
    "POST",
    "/api/auth/role-switch",
    { role: "VOLUNTEER" },
    switchedMemberToken,
  );
  record("POST /api/auth/role-switch (Switch back -> VOLUNTEER mode)", switchBackToVolunteer.status, 200, switchBackToVolunteer.data);
  volunteerToken = switchBackToVolunteer.data?.data?.token;

  // 3. Dashboard
  console.log("\n--- 2. DASHBOARD AGGREGATIONS ---");
  const dashPublic = await request("GET", "/api/dashboard/public");
  record("GET /api/dashboard/public (Statistik Beranda)", dashPublic.status, 200, dashPublic.data);

  const dashMem = await request("GET", "/api/dashboard/member", undefined, memberToken);
  record("GET /api/dashboard/member (Portal Anggota)", dashMem.status, 200, dashMem.data);

  const dashVol = await request("GET", "/api/dashboard/volunteer", undefined, volunteerToken);
  record("GET /api/dashboard/volunteer (Meja Operasional)", dashVol.status, 200, dashVol.data);

  const dashAdmin = await request("GET", "/api/dashboard/admin", undefined, adminToken);
  record("GET /api/dashboard/admin (Konsol Administrator)", dashAdmin.status, 200, dashAdmin.data);

  // 4. Books & Catalog
  console.log("\n--- 3. BOOKS & CATALOG MODULE ---");
  const books = await request("GET", "/api/books?page=1&limit=5&category=PSIKOLOGI");
  record("GET /api/books (Katalog & Filter)", books.status, 200, books.data);

  const searchBooks = await request("GET", "/api/books?search=Filosofi");
  record("GET /api/books?search=Filosofi (Pencarian)", searchBooks.status, 200, searchBooks.data);

  const detailBook = await request("GET", "/api/books/filosofi-teras");
  record("GET /api/books/:slug (Detail Buku)", detailBook.status, 200, detailBook.data);
  const targetBookId = detailBook.data?.data?.id;

  const createBook = await request(
    "POST",
    "/api/books",
    {
      title: `Buku Uji Sains E2E ${Date.now()}`,
      author: "Pakar Sains Komunitas",
      category: "SAINS_FAKTA",
      shelfLocation: "Rak D-05",
      totalStock: 3,
      synopsis: "Buku uji coba otomatis.",
    },
    adminToken,
  );
  record("POST /api/books (Tambah Buku Baru)", createBook.status, 201, createBook.data);
  const createdBookId = createBook.data?.data?.id;

  const updateBook = await request(
    "PATCH",
    `/api/books/${createdBookId}`,
    { shelfLocation: "Rak D-06" },
    adminToken,
  );
  record("PATCH /api/books/:id (Update Buku)", updateBook.status, 200, updateBook.data);

  // 5. Bookmarks
  console.log("\n--- 4. BOOKMARK / SIMPAN BACAAN MODULE ---");
  const addBookmark = await request(
    "POST",
    "/api/bookmarks",
    { bookId: targetBookId },
    memberToken,
  );
  record("POST /api/bookmarks (Simpan Bacaan)", addBookmark.status === 200 || addBookmark.status === 201 ? addBookmark.status : 0, addBookmark.status, addBookmark.data);

  const getBookmarks = await request("GET", "/api/bookmarks", undefined, memberToken);
  record("GET /api/bookmarks (Daftar Simpanan Bacaan)", getBookmarks.status, 200, getBookmarks.data);

  const delBookmark = await request(
    "DELETE",
    `/api/bookmarks/${targetBookId}`,
    undefined,
    memberToken,
  );
  record("DELETE /api/bookmarks/:bookId (Hapus Simpanan)", delBookmark.status, 200, delBookmark.data);

  // 6. Circulation
  console.log("\n--- 5. CIRCULATION MODULE ---");
  const reserve = await request(
    "POST",
    "/api/circulation/reservations",
    { bookId: targetBookId, pickupCounter: "Loket Sirkulasi A-2" },
    newMemberToken,
  );
  record("POST /api/circulation/reservations (Reservasi 48 Jam)", reserve.status, 201, reserve.data);
  const resCode = reserve.data?.data?.reservationCode;

  const myRes = await request(
    "GET",
    "/api/circulation/reservations/me",
    undefined,
    newMemberToken,
  );
  record("GET /api/circulation/reservations/me", myRes.status, 200, myRes.data);

  const checkout = await request(
    "POST",
    "/api/circulation/quick-checkout",
    {
      memberIdentifier: newMemberCode,
      bookIdentifier: "BK-PS-0899",
      reservationCode: resCode,
      durationDays: 14,
    },
    volunteerToken,
  );
  record("POST /api/circulation/quick-checkout (Sirkulasi Cepat)", checkout.status, 201, checkout.data);
  const loanId = checkout.data?.data?.id;

  const loans = await request(
    "GET",
    "/api/circulation/loans?page=1&limit=5",
    undefined,
    volunteerToken,
  );
  record("GET /api/circulation/loans (List Transaksi Pinjam)", loans.status, 200, loans.data);

  const myLoans = await request(
    "GET",
    "/api/circulation/loans/me",
    undefined,
    memberToken,
  );
  record("GET /api/circulation/loans/me (Pinjaman Aktif Saya)", myLoans.status, 200, myLoans.data);

  if (loanId) {
    const remindWa = await request(
      "POST",
      `/api/circulation/loans/${loanId}/remind-wa`,
      undefined,
      volunteerToken,
    );
    record("POST /api/circulation/loans/:id/remind-wa (Link WhatsApp)", remindWa.status, 200, remindWa.data);
  }

  const cronDue = await request("POST", "/api/circulation/cron/due-reminders");
  record("POST /api/circulation/cron/due-reminders (Cron Pengingat H-2)", cronDue.status, 200, cronDue.data);

  const quickReturn = await request(
    "POST",
    "/api/circulation/quick-return",
    {
      bookIdentifier: "BK-PS-0899",
      memberIdentifier: newMemberCode,
      returnCondition: "GOOD",
      notes: "Kondisi buku baik dan rapi",
    },
    volunteerToken,
  );
  record("POST /api/circulation/quick-return (Pengembalian & Poin)", quickReturn.status, 200, quickReturn.data);

  // 7. Community Events Module (Including Reports, Auto-Close, and Quota Restrictions)
  console.log("\n--- 6. COMMUNITY EVENTS MODULE ---");
  const events = await request("GET", "/api/events?page=1&limit=5");
  record("GET /api/events (Daftar Agenda Kegiatan)", events.status, 200, events.data);

  // Test Auto-Close on Past Event: festival-dongeng-nusantara-panggung-boneka is in the past
  const pastEventReg = await request(
    "POST",
    "/api/events/festival-dongeng-nusantara-panggung-boneka/register",
    undefined,
    memberToken,
  );
  record("POST /api/events/:slug/register past event (Auto-Close Guard 400)", pastEventReg.status, 400, pastEventReg.data);

  // Create a Future Event
  const createEvent = await request(
    "POST",
    "/api/events",
    {
      title: `Workshop Koding Warga ${Date.now()}`,
      category: "SAINS",
      description: "Pelatihan logika komputasi untuk warga remaja.",
      facilitatorName: "Kak Dimas",
      location: "Pendopo Rete Mali",
      eventDate: "2026-12-20T00:00:00.000Z",
      startTime: "10:00",
      endTime: "12:00",
      quota: 10,
      feeType: "PAID",
      ticketPrice: 25000,
    },
    adminToken,
  );
  record("POST /api/events (Tambah Agenda Baru)", createEvent.status, 201, createEvent.data);
  const createdEventId = createEvent.data?.data?.id;
  const createdEventSlug = createEvent.data?.data?.slug;

  // Try registering to Paid Event WITHOUT payment proof -> Should fail 400
  const regNoProof = await request(
    "POST",
    `/api/events/${createdEventSlug}/register`,
    {},
    memberToken,
  );
  record("POST /api/events/:id/register (Wajib Bukti Pembayaran Event Berbayar 400)", regNoProof.status, 400, regNoProof.data);

  // Register to Future Event (with payment proof URL)
  const regEvent = await request(
    "POST",
    `/api/events/${createdEventSlug}/register`,
    { paymentProofUrl: "https://drive.google.com/file/d/1PaymentProofDriveId1234567890/view?usp=sharing" },
    memberToken,
  );
  record("POST /api/events/:id/register (Daftar Event + Bukti Pembayaran & Kredensial Tiket)", regEvent.status, 201, regEvent.data);
  const ticketCode = regEvent.data?.data?.ticketCode;
  const registrationId = regEvent.data?.data?.id;

  if (ticketCode) {
    const ticketDetail = await request("GET", `/api/events/tickets/${ticketCode}`, undefined, memberToken);
    record("GET /api/events/tickets/:ticketCode (Detail Kredensial Tiket & Bukti Bayar)", ticketDetail.status, 200, ticketDetail.data);
  }

  // Test H-3 Auto-Close Rule: Create event 2 days from now (H-2) -> Registration must be closed (400)
  const h2Date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
  const h2Event = await request(
    "POST",
    "/api/events",
    {
      title: `Kegiatan H-2 Sudah Tutup H-3 ${Date.now()}`,
      category: "UMUM",
      description: "Pengujian penutupan otomatis H-3 sebelum kegiatan.",
      facilitatorName: "Kak Andi",
      location: "Pendopo Rete Mali",
      eventDate: h2Date,
      startTime: "09:00",
      endTime: "11:00",
      quota: 20,
      feeType: "FREE",
    },
    adminToken,
  );
  const h2EventId = h2Event.data?.data?.id;
  const h2EventSlug = h2Event.data?.data?.slug;
  if (h2EventSlug) {
    const regH2 = await request("POST", `/api/events/${h2EventSlug}/register`, undefined, memberToken);
    record("POST /api/events/:slug/register (Penutupan Otomatis H-3 Ditolak 400)", regH2.status, 400, regH2.data);
  }
  if (h2EventId) {
    await request("DELETE", `/api/events/${h2EventId}`, undefined, adminToken);
  }

  // Test Quota Limit Protection: create event with quota = 1
  const limitedEvent = await request(
    "POST",
    "/api/events",
    {
      title: `Kelas Terbatas Kuota 1 ${Date.now()}`,
      category: "KLUB_BUKU",
      description: "Kelas privat satu peserta.",
      facilitatorName: "Kak Budi",
      location: "Ruang Baca 1",
      eventDate: "2026-12-25T00:00:00.000Z",
      startTime: "14:00",
      endTime: "15:00",
      quota: 1,
      feeType: "FREE",
    },
    adminToken,
  );
  record("POST /api/events (Event Kuota 1)", limitedEvent.status, 201, limitedEvent.data);
  const limitedSlug = limitedEvent.data?.data?.slug;

  // 1st participant registers -> 201
  const reg1 = await request("POST", `/api/events/${limitedSlug}/register`, undefined, memberToken);
  record("POST /api/events/:slug/register (Peserta 1 Masuk Kuota)", reg1.status, 201, reg1.data);

  // 2nd participant attempts to register -> 400 Full Quota
  const reg2 = await request("POST", `/api/events/${limitedSlug}/register`, undefined, newMemberToken);
  record("POST /api/events/:slug/register (Peserta 2 Kuota Penuh 400)", reg2.status, 400, reg2.data);

  // Clean up limited event
  if (limitedEvent.data?.data?.id) {
    await request("DELETE", `/api/events/${limitedEvent.data?.data?.id}`, undefined, adminToken);
  }

  // Get My Tickets
  const myTickets = await request("GET", "/api/events/tickets/me", undefined, memberToken);
  record("GET /api/events/tickets/me (Daftar Tiket Saya)", myTickets.status, 200, myTickets.data);

  // Volunteer checks in participant QR
  if (ticketCode) {
    const checkIn = await request(
      "POST",
      "/api/events/check-in",
      { ticketCode },
      volunteerToken,
    );
    record("POST /api/events/check-in (Presensi QR Gerbang)", checkIn.status, 200, checkIn.data);
  }

  // Event Attendance Report (Admin & Volunteer)
  const attendanceReport = await request("GET", "/api/events/attendance", undefined, adminToken);
  record("GET /api/events/attendance (Laporan Kehadiran Event)", attendanceReport.status, 200, attendanceReport.data);

  // Event Auto-Close Execution
  const autoClose = await request("GET", "/api/events/auto-close", undefined, adminToken);
  record("GET /api/events/auto-close (Auto-Close Timeline Trigger)", autoClose.status, 200, autoClose.data);

  // Event Registrations List (Admin)
  const listRegistrations = await request("GET", "/api/events/registrations", undefined, adminToken);
  record("GET /api/events/registrations (Daftar Registrasi Peserta)", listRegistrations.status, 200, listRegistrations.data);

  // Verify Registration Payment (Approve)
  if (registrationId) {
    const verifyReg = await request(
      "PATCH",
      `/api/events/registrations/${registrationId}/verify`,
      { status: "VERIFIED", adminNotes: "Bukti transfer valid dan sesuai nominal tiket masuk." },
      adminToken,
    );
    record("PATCH /api/events/registrations/:id/verify (Verifikasi Pembayaran Tiket)", verifyReg.status, 200, verifyReg.data);
  }

  // 8. Volunteers & Shifts
  console.log("\n--- 7. VOLUNTEER & SHIFT MODULE ---");
  const applyVol = await request(
    "POST",
    "/api/volunteers/apply",
    {
      majorOrJob: "Sastra Indonesia",
      institution: "Universitas Indonesia",
      division: "Kelas Cerita",
      motivation: "Ingin mendongeng dan membimbing adik-adik membaca.",
    },
    newMemberToken,
  );
  record("POST /api/volunteers/apply (Daftar Calon Relawan)", applyVol.status, 201, applyVol.data);
  const appId = applyVol.data?.data?.id;

  const listApps = await request("GET", "/api/volunteers/applications", undefined, adminToken);
  record("GET /api/volunteers/applications (List Berkas)", listApps.status, 200, listApps.data);

  if (appId) {
    const reviewApp = await request(
      "PATCH",
      `/api/volunteers/applications/${appId}/review`,
      { status: "APPROVED" },
      adminToken,
    );
    record("PATCH /api/volunteers/applications/:id/review (Approval Relawan)", reviewApp.status, 200, reviewApp.data);
  }

  const clockIn = await request(
    "POST",
    "/api/volunteers/shifts/clock-in",
    {
      shiftType: "SHIFT_PAGI",
      taskSummary: "Penyortiran Buku Anak & Registrasi Pengunjung",
    },
    volunteerToken,
  );
  record("POST /api/volunteers/shifts/clock-in (Mulai Piket)", clockIn.status, 201, clockIn.data);

  const clockOut = await request(
    "PATCH",
    "/api/volunteers/shifts/clock-out",
    {
      taskSummary: "Tugas selesai dengan melayani 20 pengunjung.",
      durationHours: 4.0,
    },
    volunteerToken,
  );
  record("PATCH /api/volunteers/shifts/clock-out (Selesai Piket)", clockOut.status, 200, clockOut.data);

  const approveShifts = await request(
    "PATCH",
    "/api/volunteers/shifts/approve-all",
    undefined,
    adminToken,
  );
  record("PATCH /api/volunteers/shifts/approve-all (Setujui Jam Piket)", approveShifts.status, 200, approveShifts.data);

  // 9. Handover Notes
  console.log("\n--- 8. SHIFT HANDOVER NOTE MODULE ---");
  const createNote = await request(
    "POST",
    "/api/handover-notes",
    {
      shiftType: "SHIFT_PAGI",
      tags: ["Stok Sanitizer Tipis", "Rak Ensiklopedia Rapi"],
      content: "Catatan pergantian shift: kondisi pos jaga aman dan bersih.",
    },
    volunteerToken,
  );
  record("POST /api/handover-notes (Catatan Logistik Piket)", createNote.status, 201, createNote.data);
  const noteId = createNote.data?.data?.id;

  const getNotes = await request("GET", "/api/handover-notes", undefined, volunteerToken);
  record("GET /api/handover-notes (Daftar Catatan Piket)", getNotes.status, 200, getNotes.data);

  if (noteId) {
    const delNote = await request(
      "DELETE",
      `/api/handover-notes/${noteId}`,
      undefined,
      volunteerToken,
    );
    record("DELETE /api/handover-notes/:id (Hapus Catatan)", delNote.status, 200, delNote.data);
  }

  // 10. Donations, Cash Report & Payment Settings
  console.log("\n--- 9. DONATION, CASH REPORT & PAYMENT CHANNELS MODULE ---");
  const donSummary = await request("GET", "/api/donations/summary");
  record("GET /api/donations/summary (Capaian & Live Feed)", donSummary.status, 200, donSummary.data);

  const createFin = await request("POST", "/api/donations/financial", {
    donorName: "Dian Kusuma",
    amount: 500000,
    paymentMethod: "QRIS",
    purposeLabel: "Donasi Operasional & Snack",
  });
  record("POST /api/donations/financial (Donasi QRIS Instan)", createFin.status, 201, createFin.data);
  const receiptCode = createFin.data?.data?.receiptCode;

  if (receiptCode) {
    const getReceipt = await request("GET", `/api/donations/financial/${receiptCode}`);
    record("GET /api/donations/financial/:code (Kuitansi Digital)", getReceipt.status, 200, getReceipt.data);
  }

  const createBookDon = await request("POST", "/api/donations/books", {
    donorName: "Budi Santoso",
    donorBadge: "Warga RW 14",
    packageTitle: "25 Buku Sains Populer",
    totalBooks: 25,
    conditionNote: "Kondisi sangat mulus 90%",
    deliveryMethod: "DROP_OFF",
  });
  record("POST /api/donations/books (Submit Donasi Buku)", createBookDon.status, 201, createBookDon.data);
  const batchId = createBookDon.data?.data?.id;

  const listBookDons = await request("GET", "/api/donations/books", undefined, volunteerToken);
  record("GET /api/donations/books (Antrean Kurasi Relawan)", listBookDons.status, 200, listBookDons.data);

  if (batchId) {
    const verifyBookDon = await request(
      "PATCH",
      `/api/donations/books/${batchId}/verify`,
      { status: "ACCEPTED", curationNote: "Diterima dan masuk rak koleksi." },
      volunteerToken,
    );
    record("PATCH /api/donations/books/:id/verify (Verifikasi Donasi Masuk)", verifyBookDon.status, 200, verifyBookDon.data);
  }

  // Cash Report (Cash Flow & Financial Audit)
  const cashReport = await request("GET", "/api/donations/cash-report", undefined, adminToken);
  record("GET /api/donations/cash-report (Laporan Kas Inflow/Outflow)", cashReport.status, 200, cashReport.data);

  // Payment Channels & Accounts
  const paymentAccounts = await request("GET", "/api/donations/payment-accounts");
  record("GET /api/donations/payment-accounts (Daftar Kanal Pembayaran Aktif)", paymentAccounts.status, 200, paymentAccounts.data);

  const paymentSetting = await request("GET", "/api/donations/payment-setting");
  record("GET /api/donations/payment-setting (Pengaturan Payment Gateway)", paymentSetting.status, 200, paymentSetting.data);

  // 11. Gallery Module (Google Maps-Style)
  console.log("\n--- 10. GALLERY MODULE (GOOGLE MAPS STYLE) ---");
  const placeInfo = await request("GET", "/api/gallery/place-info");
  record("GET /api/gallery/place-info (Profil Tempat, Lokasi & Fasilitas)", placeInfo.status, 200, placeInfo.data);

  const addPhoto = await request(
    "POST",
    "/api/gallery",
    {
      title: "Kegiatan Membaca Bersama Anak",
      caption: "Antusiasme anak-anak membaca buku bergambar di pendopo.",
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
      category: "KEGIATAN",
      isFeatured: true,
    },
    volunteerToken,
  );
  record("POST /api/gallery (Unggah Foto Galeri Google Maps)", addPhoto.status, 201, addPhoto.data);
  const photoId = addPhoto.data?.data?.id;

  const addDrivePhoto = await request(
    "POST",
    "/api/gallery/google-drive",
    {
      driveUrl: "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P/view?usp=sharing",
      title: "Dokumentasi Kegiatan dari Google Drive",
      category: "KEGIATAN",
      isFeatured: true,
    },
    adminToken,
  );
  record("POST /api/gallery/google-drive (Input & Sinkron Foto dari Google Drive)", addDrivePhoto.status, 201, addDrivePhoto.data);
  const drivePhotoId = addDrivePhoto.data?.data?.photos?.[0]?.id;

  const getGallery = await request("GET", "/api/gallery?category=KEGIATAN");
  record("GET /api/gallery?category=KEGIATAN (Filter Kategori Galeri)", getGallery.status, 200, getGallery.data);

  if (photoId) {
    const delPhoto = await request("DELETE", `/api/gallery/${photoId}`, undefined, adminToken);
    record("DELETE /api/gallery/:id (Hapus Foto Galeri)", delPhoto.status, 200, delPhoto.data);
  }
  if (drivePhotoId) {
    await request("DELETE", `/api/gallery/${drivePhotoId}`, undefined, adminToken);
  }

  // 12. Notifications Module
  console.log("\n--- 11. NOTIFICATION FEED MODULE ---");
  const notifications = await request("GET", "/api/notifications", undefined, memberToken);
  record("GET /api/notifications (Feed Notifikasi & Pengingat)", notifications.status, 200, notifications.data);

  // 13. Audit Logs Module
  console.log("\n--- 12. AUDIT LOGS MODULE ---");
  const auditLogs = await request("GET", "/api/audit-logs", undefined, adminToken);
  record("GET /api/audit-logs (Live Feed Audit Admin)", auditLogs.status, 200, auditLogs.data);

  // Cleanup test items
  if (createdBookId) {
    await request("DELETE", `/api/books/${createdBookId}`, undefined, adminToken);
  }
  if (createdEventId) {
    await request("DELETE", `/api/events/${createdEventId}`, undefined, adminToken);
  }

  // Summary
  console.log("\n==========================================================");
  console.log("📊 HASIL AKHIR PENGUJIAN ENDPOINT (POSTMAN TEST SUITE)");
  console.log("==========================================================");
  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;

  console.log(`Total Endpoint Diuji: ${total}`);
  console.log(`✅ Lolos (PASS)     : ${passed}`);
  console.log(`❌ Gagal (FAIL)     : ${failed}`);

  if (failed === 0) {
    console.log("\n🎉 SEMUA TEST LOLOS 100%! BACKEND AMAN & SIAP DIGUNAKAN.");
  } else {
    console.error("\n⚠️ ADA TEST YANG GAGAL. CEK DETAIL LOG DI ATAS.");
  }

  server.close(() => {
    process.exit(failed === 0 ? 0 : 1);
  });
}

server = app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}...`);
  runTests();
});
