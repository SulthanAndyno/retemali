import { NextFunction, Response } from "express";
import { paginatedResponse, successResponse } from "../../utils/response";
import { GalleryService } from "./gallery.service";
import {
  createGalleryPhotoSchema,
  galleryQuerySchema,
  updateGalleryPhotoSchema,
} from "./gallery.validation";
import { AuthRequest } from "@/middlewares/auth.middleware";

export class GalleryController {
  private readonly galleryService: GalleryService;

  constructor(galleryService: GalleryService) {
    this.galleryService = galleryService;
  }

  getAll = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = galleryQuerySchema.parse(req.query);
      const { data, meta } = await this.galleryService.getAllPhotos(query);

      paginatedResponse({
        res,
        message: "Berhasil mengambil daftar galeri foto Rete Mali",
        data,
        meta,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      const photo = await this.galleryService.getPhotoById(id);

      successResponse({
        res,
        message: "Berhasil mengambil detail foto galeri",
        data: photo,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = createGalleryPhotoSchema.parse(req.body);
      const photo = await this.galleryService.createPhoto(
        data,
        req.file,
        req.userId,
      );

      successResponse({
        res,
        statusCode: 201,
        message: "Foto galeri berhasil ditambahkan",
        data: photo,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      const data = updateGalleryPhotoSchema.parse(req.body);
      const photo = await this.galleryService.updatePhoto(id, data, req.file);

      successResponse({
        res,
        message: "Foto galeri berhasil diperbarui",
        data: photo,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      await this.galleryService.deletePhoto(id, req.userId);

      successResponse({
        res,
        message: "Foto galeri berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  };

  getPlaceProfile = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const profile = await this.galleryService.getPlaceProfile();

      successResponse({
        res,
        message: "Berhasil mengambil profil lokasi ala Google Maps",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };
}
