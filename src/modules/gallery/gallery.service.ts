import fs from "fs";
import path from "path";
import { GalleryPhoto } from "../../../generated/prisma";
import {
  buildPaginationMeta,
  parsePagination,
  PaginationMeta,
} from "../../utils/pagination";
import { GalleryRepository } from "./gallery.repository";
import {
  CreateGalleryPhotoInput,
  GalleryQueryInput,
  UpdateGalleryPhotoInput,
} from "./gallery.validation";
import { AppError } from "@/middlewares/error.middleware";

export class GalleryService {
  private readonly galleryRepository: GalleryRepository;

  constructor(galleryRepository: GalleryRepository) {
    this.galleryRepository = galleryRepository;
  }

  private deleteImageFile(imagePath: string): void {
    const fullPath = path.join(process.cwd(), imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async getAllPhotos(
    query: GalleryQueryInput,
  ): Promise<{ data: GalleryPhoto[]; meta: PaginationMeta }> {
    const { skip, take, page, limit } = parsePagination(query);
    const { data, total } = await this.galleryRepository.findAll({
      skip,
      take,
      category: query.category,
      isFeatured: query.isFeatured,
      search: query.search,
    });

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getPhotoById(id: string): Promise<GalleryPhoto> {
    const photo = await this.galleryRepository.findById(id);
    if (!photo) {
      throw new AppError("Foto galeri tidak ditemukan", 404);
    }
    return photo;
  }

  async createPhoto(
    data: CreateGalleryPhotoInput,
    file?: Express.Multer.File,
    actorId?: string,
  ): Promise<GalleryPhoto> {
    let imagePath = data.imageUrl;
    if (file) {
      imagePath = `uploads/gallery/${file.filename}`;
    }

    if (!imagePath) {
      throw new AppError("Berkas foto atau imageUrl wajib disertakan", 400);
    }

    return this.galleryRepository.create(data, imagePath, actorId);
  }

  async updatePhoto(
    id: string,
    data: UpdateGalleryPhotoInput,
    file?: Express.Multer.File,
  ): Promise<GalleryPhoto> {
    const existing = await this.getPhotoById(id);

    let imagePath: string | undefined;
    if (file) {
      if (existing.imageUrl) {
        this.deleteImageFile(existing.imageUrl);
      }
      imagePath = `uploads/gallery/${file.filename}`;
    }

    return this.galleryRepository.update(id, data, imagePath);
  }

  async deletePhoto(id: string, actorId?: string): Promise<void> {
    const existing = await this.getPhotoById(id);
    if (existing.imageUrl) {
      this.deleteImageFile(existing.imageUrl);
    }
    await this.galleryRepository.delete(id, actorId);
  }

  async getPlaceProfile() {
    return this.galleryRepository.getPlaceProfile();
  }
}
