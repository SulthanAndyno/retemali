import { Router } from "express";
import { DonationController } from "./donation.controller";
import { DonationRepository } from "./donation.repository";
import { DonationService } from "./donation.service";
import { prisma } from "@/lib/prisma";
import { authenticate, authorizeRoles } from "@/middlewares/auth.middleware";
import { createUpload } from "@/middlewares/upload.middleware";

const upload = createUpload("donations", "donation");
const paymentUpload = createUpload("payment-accounts", "qris");

const router: Router = Router();

const donationRepository = new DonationRepository(prisma);
const donationService = new DonationService(donationRepository);
const donationController = new DonationController(donationService);

/**
 * @route   GET /api/donations/cash-report
 * @desc    Mengambil rekap laporan kas terpadu (donasi, tiket masuk kegiatan, denda)
 * @access  Private (Admin)
 */
router.get(
  "/cash-report",
  authenticate,
  authorizeRoles("ADMIN"),
  donationController.getCashReport,
);

/**
 * @route   GET /api/donations/payment-accounts/admin
 * @desc    Mengambil seluruh kanal pembayaran (termasuk nonaktif) untuk admin
 * @access  Private (Admin)
 */
router.get(
  "/payment-accounts/admin",
  authenticate,
  authorizeRoles("ADMIN"),
  donationController.getAdminPaymentAccounts,
);

/**
 * @route   POST /api/donations/payment-accounts
 * @desc    Menambah kanal pembayaran (bank transfer / QRIS + gambar QR)
 * @access  Private (Admin)
 */
router.post(
  "/payment-accounts",
  authenticate,
  authorizeRoles("ADMIN"),
  paymentUpload.single("qrisImage"),
  donationController.createPaymentAccount,
);

/**
 * @route   PATCH /api/donations/payment-accounts/:id
 * @desc    Memperbarui kanal pembayaran (termasuk status aktif & urutan)
 * @access  Private (Admin)
 */
router.patch(
  "/payment-accounts/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  paymentUpload.single("qrisImage"),
  donationController.updatePaymentAccount,
);

/**
 * @route   DELETE /api/donations/payment-accounts/:id
 * @desc    Menghapus kanal pembayaran
 * @access  Private (Admin)
 */
router.delete(
  "/payment-accounts/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  donationController.deletePaymentAccount,
);

/**
 * @route   GET /api/donations/payment-accounts
 * @desc    Mengambil daftar kanal rekening pembayaran aktif
 * @access  Public
 */
router.get("/payment-accounts", donationController.getPaymentAccounts);

/**
 * @route   GET /api/donations/payment-setting
 * @desc    Mengambil pengaturan rekening pembayaran default
 * @access  Public
 */
router.get("/payment-setting", donationController.getPaymentSetting);

/**
 * @route   GET /api/donations/summary
 * @desc    Mengambil capaian kampanye kuartal & Live Feed Jejak Kebaikan Donatur
 * @access  Public
 */
router.get("/summary", donationController.getSummary);

/**
 * @route   GET /api/donations/financial
 * @desc    Mengambil daftar transaksi donasi finansial (untuk Admin / Relawan)
 * @access  Private (Volunteer / Admin)
 */
router.get(
  "/financial",
  authenticate,
  authorizeRoles("VOLUNTEER", "ADMIN"),
  donationController.getAllFinancialDonations,
);

/**
 * @route   POST /api/donations/financial
 * @desc    Membuat transaksi Donasi Finansial (QRIS / Transfer / Sahabat Literasi)
 * @access  Public
 */
router.post(
  "/financial",
  upload.single("proofImage"),
  donationController.createFinancial,
);

/**
 * @route   PATCH /api/donations/financial/:id/verify
 * @desc    Memverifikasi atau menolak donasi finansial oleh Admin
 * @access  Private (Admin)
 */
router.patch(
  "/financial/:id/verify",
  authenticate,
  authorizeRoles("ADMIN"),
  donationController.verifyFinancialDonation,
);

/**
 * @route   POST /api/donations/webhook
 * @desc    Webhook callback untuk verifikasi otomatis pembayaran donasi
 * @access  Public (Webhook)
 */
router.post("/webhook", donationController.webhook);

/**
 * @route   GET /api/donations/financial/:receiptCode
 * @desc    Mengambil kuitansi digital donasi finansial
 * @access  Public
 */
router.get("/financial/:receiptCode", donationController.getReceipt);

/**
 * @route   POST /api/donations/books
 * @desc    Mengirim form pendataan Donasi Buku Fisik (+ upload conditionImage)
 * @access  Public
 */
router.post(
  "/books",
  upload.single("conditionImage"),
  donationController.createBookDonation,
);

/**
 * @route   GET /api/donations/books
 * @desc    Mengambil daftar antrean kurasi donasi buku fisik masuk
 * @access  Private (Volunteer / Admin)
 */
router.get(
  "/books",
  authenticate,
  authorizeRoles("VOLUNTEER", "ADMIN"),
  donationController.getAllBookDonations,
);

/**
 * @route   GET /api/donations/books/:batchCode
 * @desc    Mengambil detail status paket donasi buku fisik berdasarkan kode batch
 * @access  Public
 */
router.get("/books/:batchCode", donationController.getBookDonationByCode);

/**
 * @route   PATCH /api/donations/books/:id/verify
 * @desc    Memverifikasi & menerima batch donasi buku fisik oleh relawan
 * @access  Private (Volunteer / Admin)
 */
router.patch(
  "/books/:id/verify",
  authenticate,
  authorizeRoles("VOLUNTEER", "ADMIN"),
  donationController.verifyBookDonation,
);

export default router;
