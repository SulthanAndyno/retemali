import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { NotificationRepository } from "./notification.repository";
import { NotificationService } from "./notification.service";
import { prisma } from "@/lib/prisma";
import { authenticate, authorizeRoles } from "@/middlewares/auth.middleware";

const router: Router = Router();

const notificationRepository = new NotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(
  notificationService,
);

/**
 * @route   GET /api/notifications
 * @desc    Mengambil daftar notifikasi aktivitas terkini bagi pengguna
 * @access  Private (Token)
 */
router.get("/", authenticate, notificationController.getNotifications);

/**
 * @route   GET /api/notifications/broadcasts
 * @desc    Mengambil daftar riwayat siaran notifikasi (Admin)
 * @access  Private (Admin)
 */
router.get(
  "/broadcasts",
  authenticate,
  authorizeRoles("ADMIN"),
  notificationController.getBroadcasts,
);

/**
 * @route   POST /api/notifications/broadcast
 * @desc    Mengirim siaran pengumuman baru ke anggota & relawan (Admin)
 * @access  Private (Admin)
 */
router.post(
  "/broadcast",
  authenticate,
  authorizeRoles("ADMIN"),
  notificationController.createBroadcast,
);

export default router;
