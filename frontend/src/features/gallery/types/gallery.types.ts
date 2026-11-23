/**
 * Kontrak data Galeri (admin).
 *
 * Admin hanya menempelkan tautan Google Drive; yang disimpan ke database adalah
 * URL hasil normalisasi backend (bukan berkas foto). Untuk foto Drive, backend
 * menambahkan metadata turunan lewat `enrichGalleryPhotoWithDriveMeta`.
 */

export type GalleryCategory = 'SUASANA' | 'KEGIATAN' | 'FASILITAS' | 'KOLEKSI';

export interface GalleryUploader {
  id: string;
  name: string;
  memberCode?: string | null;
  avatar?: string | null;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: GalleryCategory;
  /** URL tersimpan; untuk Drive berupa https://drive.google.com/thumbnail?id=... */
  imageUrl: string;
  /** CDN Google Drive (https://lh3.googleusercontent.com/d/ID=w1600); null untuk non-Drive. */
  lh3ImageUrl?: string | null;
  /** URL halaman view Google Drive; null untuk non-Drive. */
  driveViewUrl?: string | null;
  driveFileId?: string | null;
  sourceType?: 'GOOGLE_DRIVE' | 'LOCAL_OR_EXTERNAL';
  directImageUrl?: string;
  caption?: string | null;
  location: string;
  isFeatured: boolean;
  sortOrder: number;
  uploadedById?: string | null;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: GalleryUploader | null;
}

/** Nilai form tambah foto pada dashboard admin. */
export interface GalleryFormValues {
  driveUrl: string;
  title: string;
  category: GalleryCategory;
  caption: string;
  location: string;
  isFeatured: boolean;
}

/** Respons POST /gallery/google-drive. */
export interface GalleryImportResult {
  importedCount: number;
  totalProcessed: number;
  photos: GalleryPhoto[];
}
