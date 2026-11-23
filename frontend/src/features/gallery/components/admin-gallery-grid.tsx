'use client';

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Star,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button, buttonClasses } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { ErrorMessage } from '@/shared/components/ui/error-message';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { formatDate } from '@/shared/lib/utils';
import type { PaginatedMeta } from '@/shared/types/api';
import { galleryCategoryLabel } from '../lib/gallery-options';
import type { GalleryPhoto } from '../types/gallery.types';
import { GalleryImage } from './gallery-image';

interface AdminGalleryGridProps {
  photos: GalleryPhoto[];
  meta: PaginatedMeta | null;
  loading: boolean;
  error: string | null;
  page: number;
  deletingId: string | null;
  togglingId: string | null;
  onDelete: (photo: GalleryPhoto) => void;
  onToggleFeatured: (photo: GalleryPhoto) => void;
  onPageChange: (page: number) => void;
  onReload: () => void;
}

export function AdminGalleryGrid({
  photos,
  meta,
  loading,
  error,
  page,
  deletingId,
  togglingId,
  onDelete,
  onToggleFeatured,
  onPageChange,
  onReload,
}: AdminGalleryGridProps) {
  if (error) {
    return <ErrorMessage message={error} onRetry={() => void onReload()} />;
  }

  if (loading && photos.length === 0) {
    return (
      <div className="py-12">
        <LoadingSpinner label="Memuat galeri..." />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <EmptyState
        title="Belum ada foto galeri"
        description="Tambahkan foto pertama dengan menempelkan link Google Drive di form atas."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <Card key={photo.id} padded={false} className="overflow-hidden">
            <div className="relative aspect-[4/3] w-full bg-surface-soft">
              <GalleryImage photo={photo} />
              {photo.isFeatured ? (
                <Badge tone="warning" className="absolute left-2 top-2">
                  Unggulan
                </Badge>
              ) : null}
            </div>

            <div className="space-y-2.5 p-3">
              <p className="line-clamp-2 text-sm font-semibold text-ink">
                {photo.title}
              </p>

              <div className="flex items-center justify-between gap-2">
                <Badge tone="info">{galleryCategoryLabel(photo.category)}</Badge>
                <span className="text-[11px] text-ink-soft">
                  {formatDate(photo.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <Button
                  size="sm"
                  variant={photo.isFeatured ? 'success' : 'secondary'}
                  loading={togglingId === photo.id}
                  onClick={() => onToggleFeatured(photo)}
                  className="flex-1"
                >
                  {togglingId === photo.id ? null : (
                    <Star className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {photo.isFeatured ? 'Unggulan' : 'Jadikan unggulan'}
                </Button>

                {photo.driveViewUrl ? (
                  <a
                    href={photo.driveViewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonClasses('secondary', 'sm')}
                    aria-label="Buka foto di Google Drive"
                    title="Buka di Google Drive"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ) : null}

                <Button
                  size="sm"
                  variant="danger"
                  loading={deletingId === photo.id}
                  onClick={() => onDelete(photo)}
                  aria-label="Hapus foto"
                  title="Hapus foto"
                >
                  {deletingId === photo.id ? null : (
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {meta && meta.totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-surface-soft bg-white px-4 py-3">
          <p className="text-xs text-ink-soft">
            Halaman {meta.page} dari {meta.totalPages} · {meta.total} foto
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={!meta.hasPrevPage || loading}
              onClick={() => onPageChange(page - 1)}
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Sebelumnya
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={!meta.hasNextPage || loading}
              onClick={() => onPageChange(page + 1)}
              aria-label="Halaman berikutnya"
            >
              Berikutnya
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
