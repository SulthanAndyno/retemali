import fs from "fs";
import path from "path";
import {
  GalleryCategory as PrismaGalleryCategory,
  GalleryPhoto,
} from "../../../generated/prisma";
import {
  buildPaginationMeta,
  parsePagination,
  PaginationMeta,
} from "../../utils/pagination";
import { GalleryRepository } from "./gallery.repository";
import {
  CreateGalleryPhotoInput,
  GalleryQueryInput,
  GoogleDriveGalleryInput,
  UpdateGalleryPhotoInput,
} from "./gallery.validation";
import {
  extractGoogleDriveFileId,
  extractGoogleDriveFolderId,
  fetchGoogleDriveFolderImages,
  normalizeGalleryImageUrl,
} from "../../utils/google-drive";
import { AppError } from "@/middlewares/error.middleware";

export class GalleryService {
  private readonly galleryRepository: GalleryRepository;

  constructor(galleryRepository: GalleryRepository) {
    this.galleryRepository = galleryRepository;
  }

  private deleteImageFile(imagePath: string): void {
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return;
    }
    const fullPath = path.join(process.cwd(), imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async getAllPhotos(
    query: GalleryQueryInput,
  ): Promise<{ data: GalleryPhoto[]; meta: PaginationMeta }> {
    // Jika env GOOGLE_DRIVE_GALLERY_FOLDER diatur, sinkronisasi otomatis di latar belakang
    const autoSyncFolder = process.env.GOOGLE_DRIVE_GALLERY_FOLDER;
    if (autoSyncFolder) {
      await this.syncGoogleDriveFolderSilent(autoSyncFolder);
    }

    const { skip, take, page, limit } = parsePagination(query);
    const { data, total } = await this.galleryRepository.findAll({
      skip,
      take,
      category: query.category as PrismaGalleryCategory | undefined,
      isFeatured: query.isFeatured,
      search: query.search,
    });

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  private async syncGoogleDriveFolderSilent(folderUrlOrId: string): Promise<void> {
    try {
      const { files } = await fetchGoogleDriveFolderImages(folderUrlOrId);
      for (const file of files) {
        await this.galleryRepository.upsertDrivePhoto({
          fileId: file.fileId,
          title: file.title,
          category: "KEGIATAN",
          isFeatured: true,
        });
      }
    } catch {
      // Abaikan jika gagal terhubung ke Google Drive di latar belakang
    }
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
    let rawImageSource =
      data.imageUrl ??
      data.driveUrl ??
      data.googleDriveUrl ??
      data.driveFileId;

    if (file) {
      rawImageSource = `uploads/gallery/${file.filename}`;
    }

    if (!rawImageSource) {
      throw new AppError(
        "Berkas foto, imageUrl, atau tautan Google Drive (driveUrl) wajib disertakan",
        400,
      );
    }

    // Jika yang diinput adalah tautan Folder Google Drive, tarik otomatis foto dari folder tersebut
    const folderId = extractGoogleDriveFolderId(rawImageSource);
    if (folderId) {
      const syncResult = await this.importFromGoogleDrive(
        {
          folderUrl: rawImageSource,
          title: data.title,
          category: data.category,
          caption: data.caption,
          location: data.location,
          isFeatured: data.isFeatured,
        },
        actorId,
      );
      if (syncResult.photos.length > 0) {
        return syncResult.photos[0];
      }
    }

    const imagePath = file
      ? rawImageSource
      : normalizeGalleryImageUrl(rawImageSource);

    return this.galleryRepository.create(data, imagePath, actorId);
  }

  /**
   * Input atau sinkronisasi foto galeri langsung dari tautan File atau Folder Google Drive.
   */
  async importFromGoogleDrive(
    input: GoogleDriveGalleryInput,
    actorId?: string,
  ): Promise<{
    importedCount: number;
    totalProcessed: number;
    photos: GalleryPhoto[];
  }> {
    const targetUrl =
      input.folderUrl ??
      input.driveUrl ??
      input.googleDriveUrl ??
      input.imageUrl;

    const category =
      (input.category as PrismaGalleryCategory | undefined) ?? "KEGIATAN";
    const photos: GalleryPhoto[] = [];
    let importedCount = 0;

    // 1. Jika user mengirimkan array driveUrls
    if (input.driveUrls && input.driveUrls.length > 0) {
      let index = 1;
      for (const url of input.driveUrls) {
        const fileId = extractGoogleDriveFileId(url);
        if (fileId) {
          const { photo, isNew } =
            await this.galleryRepository.upsertDrivePhoto({
              fileId,
              title:
                input.driveUrls.length > 1
                  ? `${input.title} #${index++}`
                  : input.title,
              category,
              caption: input.caption,
              location: input.location,
              isFeatured: input.isFeatured,
              uploadedById: actorId,
            });
          photos.push(photo);
          if (isNew) importedCount++;
        }
      }

      if (photos.length === 0) {
        throw new AppError(
          "Tidak ditemukan tautan file Google Drive yang valid pada driveUrls",
          400,
        );
      }

      return {
        importedCount,
        totalProcessed: photos.length,
        photos,
      };
    }

    if (!targetUrl) {
      throw new AppError(
        "Tautan Google Drive (driveUrl, googleDriveUrl, atau folderUrl) wajib diisi",
        400,
      );
    }

    // 2. Cek apakah targetUrl adalah tautan File Google Drive tunggal
    const singleFileId = extractGoogleDriveFileId(targetUrl);
    if (singleFileId) {
      const { photo, isNew } = await this.galleryRepository.upsertDrivePhoto({
        fileId: singleFileId,
        title: input.title || "Dokumentasi Kegiatan Rete Mali",
        category,
        caption: input.caption,
        location: input.location,
        isFeatured: input.isFeatured ?? true,
        uploadedById: actorId,
      });

      return {
        importedCount: isNew ? 1 : 0,
        totalProcessed: 1,
        photos: [photo],
      };
    }

    // 3. Cek apakah targetUrl adalah tautan Folder Google Drive
    const folderId = extractGoogleDriveFolderId(targetUrl);
    if (folderId) {
      const { files } = await fetchGoogleDriveFolderImages(targetUrl);

      if (files.length > 0) {
        for (const file of files) {
          const { photo, isNew } =
            await this.galleryRepository.upsertDrivePhoto({
              fileId: file.fileId,
              title: file.title || input.title,
              category,
              caption: input.caption,
              location: input.location,
              isFeatured: input.isFeatured ?? true,
              uploadedById: actorId,
            });
          photos.push(photo);
          if (isNew) importedCount++;
        }

        return {
          importedCount,
          totalProcessed: photos.length,
          photos,
        };
      }

      // Fallback jika folder valid namun tidak dapat diakses langsung (atau di sandbox offline):
      // simpan menggunakan ID folder sebagai referensi gambar Google Drive
      const { photo, isNew } = await this.galleryRepository.upsertDrivePhoto({
        fileId: folderId,
        title: input.title || "Album Dokumentasi Kegiatan Google Drive",
        category,
        caption:
          input.caption ??
          `Sinkronisasi Folder Google Drive (${targetUrl})`,
        location: input.location,
        isFeatured: input.isFeatured ?? true,
        uploadedById: actorId,
      });

      return {
        importedCount: isNew ? 1 : 0,
        totalProcessed: 1,
        photos: [photo],
      };
    }

    throw new AppError(
      "Tautan Google Drive tidak valid. Gunakan link share file (https://drive.google.com/file/d/ID/view) atau folder (https://drive.google.com/drive/folders/ID)",
      400,
    );
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
