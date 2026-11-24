import { Router } from "express";
import { GalleryController } from "./gallery.controller";
import { GalleryRepository } from "./gallery.repository";
import { GalleryService } from "./gallery.service";
import { prisma } from "@/lib/prisma";
import { authenticate, authorizeRoles } from "@/middlewares/auth.middleware";
import { createUpload } from "@/middlewares/upload.middleware";

const upload = createUpload("gallery", "photo");

const router: Router = Router();

const galleryRepository = new GalleryRepository(prisma);
const galleryService = new GalleryService(galleryRepository);
const galleryController = new GalleryController(galleryService);

/**
 * @route   GET /api/gallery
 * @desc    Mengambil daftar foto galeri (filter kategori: SUASANA, KEGIATAN, FASILITAS, KOLEKSI)
 * @access  Public
 */
router.get("/", galleryController.getAll);

/**
 * @route   GET /api/gallery/place-info
 * @desc    Mengambil profil lokasi & kartu informasi tempat ala Google Maps + foto terbaru
 * @access  Public
 */
router.get("/place-info", galleryController.getPlaceProfile);

/**
 * @route   POST /api/gallery/google-drive
 * @desc    Input & sinkronisasi otomatis foto hasil kegiatan dari tautan File/Folder Google Drive
 * @access  Private (Volunteer / Admin)
 */
router.post(
  "/google-drive",
  authenticate,
  authorizeRoles("VOLUNTEER", "ADMIN"),
  galleryController.importFromGoogleDrive,
);

/**
 * @route   POST /api/gallery/drive-sync
 * @desc    Alias sinkronisasi foto galeri dari tautan File/Folder Google Drive
 * @access  Private (Volunteer / Admin)
 */
router.post(
  "/drive-sync",
  authenticate,
  authorizeRoles("VOLUNTEER", "ADMIN"),
  galleryController.importFromGoogleDrive,
);

/**
 * @route   GET /api/gallery/:id
 * @desc    Mengambil detail satu foto galeri
 * @access  Public
 */
router.get("/:id", galleryController.getById);

/**
 * @route   POST /api/gallery
 * @desc    Mengunggah foto baru ke galeri (+ upload image atau input link Google Drive)
 * @access  Private (Volunteer / Admin)
 */
router.post(
  "/",
  authenticate,
  authorizeRoles("VOLUNTEER", "ADMIN"),
  upload.single("image"),
  galleryController.create,
);

/**
 * @route   PATCH /api/gallery/:id
 * @desc    Mengupdate info / metadata foto galeri
 * @access  Private (Volunteer / Admin)
 */
router.patch(
  "/:id",
  authenticate,
  authorizeRoles("VOLUNTEER", "ADMIN"),
  upload.single("image"),
  galleryController.update,
);

/**
 * @route   DELETE /api/gallery/:id
 * @desc    Menghapus foto galeri secara permanen
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  galleryController.delete,
);

export default router;
