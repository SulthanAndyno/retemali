import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { NotificationRepository } from "./notification.repository";
import { NotificationService } from "./notification.service";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/middlewares/auth.middleware";

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

export default router;
