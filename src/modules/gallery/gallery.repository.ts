import {
  GalleryCategory,
  GalleryPhoto,
  PrismaClient,
} from "../../../generated/prisma";
import {
  CreateGalleryPhotoInput,
  UpdateGalleryPhotoInput,
} from "./gallery.validation";
import {
  buildGoogleDriveDirectImageUrl,
  enrichGalleryPhotoWithDriveMeta,
  extractGoogleDriveFileId,
  normalizeGalleryImageUrl,
} from "../../utils/google-drive";

interface FindAllGalleryOptions {
  skip: number;
  take: number;
  category?: GalleryCategory;
  isFeatured?: boolean;
  search?: string;
}

export class GalleryRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(
    options: FindAllGalleryOptions,
  ): Promise<{ data: GalleryPhoto[]; total: number }> {
    const { skip, take, category, isFeatured, search } = options;

    const where: Record<string, unknown> = {
      ...(category && { category }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { caption: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.galleryPhoto.findMany({
        where,
        skip,
        take,
        include: {
          uploadedBy: {
            select: { id: true, name: true, memberCode: true, avatar: true },
          },
        },
        orderBy: [
          { isFeatured: "desc" },
          { sortOrder: "asc" },
          { createdAt: "desc" },
        ],
      }),
      this.prisma.galleryPhoto.count({ where }),
    ]);

    return {
      data: data.map((p) => enrichGalleryPhotoWithDriveMeta(p)),
      total,
    };
  }

  async findById(id: string): Promise<GalleryPhoto | null> {
    const photo = await this.prisma.galleryPhoto.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, name: true, memberCode: true, avatar: true },
        },
      },
    });

    return photo ? enrichGalleryPhotoWithDriveMeta(photo) : null;
  }

  async findByDriveFileId(fileId: string): Promise<GalleryPhoto | null> {
    const existing = await this.prisma.galleryPhoto.findFirst({
      where: {
        imageUrl: {
          contains: fileId,
        },
      },
    });
    return existing ? enrichGalleryPhotoWithDriveMeta(existing) : null;
  }

  async create(
    data: CreateGalleryPhotoInput,
    imageUrl: string,
    uploadedById?: string,
  ): Promise<GalleryPhoto> {
    const normalizedUrl = normalizeGalleryImageUrl(imageUrl);
    const driveFileId = extractGoogleDriveFileId(imageUrl);

    return this.prisma.$transaction(async (tx) => {
      const photo = await tx.galleryPhoto.create({
        data: {
          title: data.title || "Dokumentasi Kegiatan Rete Mali",
          category: (data.category as GalleryCategory) ?? "KEGIATAN",
          imageUrl: normalizedUrl,
          caption: data.caption ?? null,
          location: data.location || "Saung Baca Rete Mali, Jatirangga",
          isFeatured: data.isFeatured ?? false,
          sortOrder: data.sortOrder ?? 0,
          uploadedById: uploadedById ?? null,
        },
        include: {
          uploadedBy: {
            select: { id: true, name: true, memberCode: true },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: uploadedById ?? null,
          title: driveFileId
            ? "Penambahan Foto Galeri via Google Drive"
            : "Penambahan Foto Galeri Baru",
          description: `Foto "${photo.title}" ditambahkan ke galeri kategori ${photo.category}${driveFileId ? ` (Google Drive ID: ${driveFileId})` : ""}.`,
          category: "GALLERY",
        },
      });

      return enrichGalleryPhotoWithDriveMeta(photo);
    });
  }

  async upsertDrivePhoto(params: {
    fileId: string;
    title: string;
    category: GalleryCategory;
    caption?: string;
    location?: string;
    isFeatured?: boolean;
    uploadedById?: string;
  }): Promise<{ photo: GalleryPhoto; isNew: boolean }> {
    const existing = await this.findByDriveFileId(params.fileId);
    if (existing) {
      return { photo: existing, isNew: false };
    }

    const directUrl = buildGoogleDriveDirectImageUrl(params.fileId);
    const created = await this.create(
      {
        title: params.title,
        category: params.category as any,
        caption: params.caption,
        location: params.location ?? "Saung Baca Rete Mali, Jatirangga",
        isFeatured: params.isFeatured ?? true,
        sortOrder: 0,
      },
      directUrl,
      params.uploadedById,
    );

    return { photo: created, isNew: true };
  }

  async update(
    id: string,
    data: UpdateGalleryPhotoInput,
    imageUrl?: string,
  ): Promise<GalleryPhoto> {
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.category !== undefined)
      updateData.category = data.category as GalleryCategory;
    if (data.caption !== undefined) updateData.caption = data.caption;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const rawUrl =
      imageUrl ??
      data.imageUrl ??
      data.driveUrl ??
      data.googleDriveUrl ??
      data.driveFileId;
    if (rawUrl !== undefined) {
      updateData.imageUrl = normalizeGalleryImageUrl(rawUrl);
    }

    const updated = await this.prisma.galleryPhoto.update({
      where: { id },
      data: updateData,
    });

    return enrichGalleryPhotoWithDriveMeta(updated);
  }

  async delete(id: string, actorId?: string): Promise<GalleryPhoto> {
    return this.prisma.$transaction(async (tx) => {
      const deleted = await tx.galleryPhoto.delete({ where: { id } });

      await tx.auditLog.create({
        data: {
          actorId: actorId ?? null,
          title: "Penghapusan Foto Galeri",
          description: `Foto "${deleted.title}" telah dihapus dari galeri.`,
          category: "GALLERY",
        },
      });

      return deleted;
    });
  }

  /**
   * Info Tempat & Lokasi Ala Google Maps Place Profile + Preview Foto Kegiatan Terbaru
   */
  async getPlaceProfile() {
    const totalPhotos = await this.prisma.galleryPhoto.count();
    const [
      suasanaCount,
      kegiatanCount,
      fasilitasCount,
      koleksiCount,
      recentPhotos,
    ] = await Promise.all([
      this.prisma.galleryPhoto.count({ where: { category: "SUASANA" } }),
      this.prisma.galleryPhoto.count({ where: { category: "KEGIATAN" } }),
      this.prisma.galleryPhoto.count({ where: { category: "FASILITAS" } }),
      this.prisma.galleryPhoto.count({ where: { category: "KOLEKSI" } }),
      this.prisma.galleryPhoto.findMany({
        take: 12,
        orderBy: [
          { isFeatured: "desc" },
          { sortOrder: "asc" },
          { createdAt: "desc" },
        ],
      }),
    ]);

    return {
      placeName: "Taman Baca Masyarakat Rete Mali",
      tagline: "Pojok Literasi & Belajar Ramah Anak Warga Jatirangga",
      address:
        "Jl. Rete Mali No. 12, RT.005/RW.014, Kel. Jatirangga, Kec. Jatisampurna, Kota Bekasi, Jawa Barat 17434",
      coordinates: {
        latitude: -6.3685,
        longitude: 106.9248,
      },
      googleMapsUrl: "https://maps.google.com/?q=-6.3685,106.9248",
      openingHours: [
        { day: "Senin - Kamis", hours: "14:00 - 17:30 WIB" },
        { day: "Jumat", hours: "13:30 - 17:30 WIB" },
        { day: "Sabtu - Minggu", hours: "09:00 - 17:00 WIB" },
      ],
      facilities: [
        "Pendopo Terbuka Ramah Anak",
        "Koleksi 1.500+ Buku Berkualitas",
        "Area Baca Lesehan Bersih & Nyaman",
        "Wi-Fi Edukasi Gratis",
        "Toilet & Tempat Wudhu",
        "Area Parkir Sepeda & Motor Warga",
      ],
      photoStats: {
        total: totalPhotos,
        categories: {
          SUASANA: suasanaCount,
          KEGIATAN: kegiatanCount,
          FASILITAS: fasilitasCount,
          KOLEKSI: koleksiCount,
        },
      },
      recentPhotos: recentPhotos.map((p) => enrichGalleryPhotoWithDriveMeta(p)),
    };
  }
}
