import { Router } from "express";
import { SettingsController } from "./settings.controller";
import { SettingsRepository } from "./settings.repository";
import { SettingsService } from "./settings.service";
import { prisma } from "@/lib/prisma";
import { authenticate, authorizeRoles } from "@/middlewares/auth.middleware";

const router: Router = Router();

const settingsRepository = new SettingsRepository(prisma);
const settingsService = new SettingsService(settingsRepository);
const settingsController = new SettingsController(settingsService);

/**
 * @route   GET /api/settings
 * @desc    Mengambil profil komunitas & pengaturan website (dipakai landing page)
 * @access  Public
 */
router.get("/", settingsController.getSiteSetting);

/**
 * @route   PATCH /api/settings
 * @desc    Menyimpan perubahan pengaturan website
 * @access  Private (Admin)
 */
router.patch(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  settingsController.updateSiteSetting,
);

export default router;
