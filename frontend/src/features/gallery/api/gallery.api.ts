import { del, get, patch, post } from '@/shared/lib/api';
import type { ApiEnvelope, PaginatedMeta } from '@/shared/types/api';
import type {
  GalleryCategory,
  GalleryFormValues,
  GalleryImportResult,
  GalleryPhoto,
} from '../types/gallery.types';

export interface GalleryQuery {
  page?: number;
  limit?: number;
  category?: GalleryCategory | '';
  search?: string;
}

/** GET /gallery — daftar foto terpaginasi (public). */
export function getGallery({
  page = 1,
  limit = 12,
  category,
  search,
}: GalleryQuery = {}) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (category) query.set('category', category);
  if (search?.trim()) query.set('search', search.trim());

  return get<ApiEnvelope<GalleryPhoto[]> & { meta: PaginatedMeta }>(
    `/gallery?${query.toString()}`,
  );
}

/**
 * POST /gallery/google-drive — simpan tautan Drive sebagai foto galeri.
 * Yang dikirim hanya metadata + link; berkas tetap di Google Drive.
 * `isFeatured` selalu dikirim eksplisit karena default backend `true`.
 */
export function importFromGoogleDrive(values: GalleryFormValues) {
  return post<ApiEnvelope<GalleryImportResult>>('/gallery/google-drive', {
    driveUrl: values.driveUrl.trim(),
    title: values.title.trim(),
    category: values.category,
    caption: values.caption.trim() || undefined,
    location: values.location.trim() || undefined,
    isFeatured: values.isFeatured,
  });
}

export type GalleryUpdateValues = Partial<GalleryFormValues> & {
  sortOrder?: number;
};

/** PATCH /gallery/:id — ubah metadata foto (belum dipakai UI MVP). */
export function updateGalleryPhoto(id: string, values: GalleryUpdateValues) {
  const body: Record<string, unknown> = {};
  if (values.title !== undefined) body.title = values.title.trim();
  if (values.category !== undefined) body.category = values.category;
  if (values.caption !== undefined) body.caption = values.caption.trim();
  if (values.location !== undefined) body.location = values.location.trim();
  if (values.isFeatured !== undefined) body.isFeatured = values.isFeatured;
  if (values.sortOrder !== undefined) body.sortOrder = values.sortOrder;
  if (values.driveUrl?.trim()) body.driveUrl = values.driveUrl.trim();

  return patch<ApiEnvelope<GalleryPhoto>>(`/gallery/${id}`, body);
}

/** DELETE /gallery/:id — hapus foto (khusus ADMIN). */
export function deleteGalleryPhoto(id: string) {
  return del<ApiEnvelope<null>>(`/gallery/${id}`);
}
