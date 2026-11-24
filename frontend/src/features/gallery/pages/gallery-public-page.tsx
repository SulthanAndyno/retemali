'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { ErrorMessage } from '@/shared/components/ui/error-message';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { cn } from '@/shared/lib/utils';
import { GalleryImage } from '../components/gallery-image';
import { usePublicGallery } from '../hooks/use-public-gallery';
import {
  GALLERY_CATEGORY_OPTIONS,
  galleryCategoryLabel,
} from '../lib/gallery-options';
import type { GalleryCategory, GalleryPhoto } from '../types/gallery.types';

const FILTERS: { value: GalleryCategory | ''; label: string }[] = [
  { value: '', label: 'Semua' },
  ...GALLERY_CATEGORY_OPTIONS,
];

function GalleryCard({ photo }: { photo: GalleryPhoto }) {
  const body = (
    <Card
      padded={false}
      className="h-full overflow-hidden transition-shadow hover:shadow-drawer"
    >
      <div className="relative aspect-video w-full bg-surface-soft">
        <GalleryImage photo={photo} sizes="(max-width: 768px) 100vw, 50vw" />
        {photo.isFeatured ? (
          <Badge tone="warning" className="absolute left-2 top-2">
            Unggulan
          </Badge>
        ) : null}
      </div>
      <div className="space-y-1.5 p-3">
        <p className="line-clamp-2 text-sm font-semibold text-ink">
          {photo.title}
        </p>
        <div className="flex items-center justify-between gap-2">
          <Badge tone="info">{galleryCategoryLabel(photo.category)}</Badge>
          {photo.location ? (
            <span className="truncate text-[11px] text-ink-soft">
              {photo.location}
            </span>
          ) : null}
        </div>
        {photo.caption ? (
          <p className="line-clamp-2 text-xs text-ink-soft">{photo.caption}</p>
        ) : null}
      </div>
    </Card>
  );

  if (photo.driveViewUrl) {
    return (
      <a
        href={photo.driveViewUrl}
        target="_blank"
        rel="noreferrer"
        className="block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        title="Buka foto di Google Drive"
      >
        {body}
      </a>
    );
  }

  return body;
}

export function GalleryPublicPage() {
  const gallery = usePublicGallery();

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Dokumentasi Kegiatan"
        description="Momen dan cerita dari kegiatan literasi ReteMali bersama warga Jatirangga."
      />

      <nav aria-label="Filter dokumentasi" className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = gallery.category === filter.value;
          return (
            <button
              key={filter.value || 'semua'}
              type="button"
              onClick={() => gallery.setCategory(filter.value)}
              aria-pressed={active}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                active
                  ? 'border-primary bg-primary text-white'
                  : 'border-surface-soft bg-white text-ink-soft hover:bg-surface-blue hover:text-primary-deep',
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </nav>

      {gallery.error ? (
        <ErrorMessage
          message={gallery.error}
          onRetry={() => void gallery.reload()}
        />
      ) : gallery.loading && gallery.photos.length === 0 ? (
        <div className="py-16">
          <LoadingSpinner label="Memuat dokumentasi..." />
        </div>
      ) : gallery.photos.length === 0 ? (
        <EmptyState
          title="Belum ada dokumentasi kegiatan"
          description="Foto akan muncul di sini setelah pengelola menambahkan dokumentasi kegiatan."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {gallery.photos.map((photo) => (
              <GalleryCard key={photo.id} photo={photo} />
            ))}
          </div>

          {gallery.meta && gallery.meta.totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-surface-soft bg-white px-4 py-3">
              <p className="text-xs text-ink-soft">
                Halaman {gallery.meta.page} dari {gallery.meta.totalPages} ·{' '}
                {gallery.meta.total} foto
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!gallery.meta.hasPrevPage || gallery.loading}
                  onClick={() => gallery.setPage(gallery.page - 1)}
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Sebelumnya
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!gallery.meta.hasNextPage || gallery.loading}
                  onClick={() => gallery.setPage(gallery.page + 1)}
                  aria-label="Halaman berikutnya"
                >
                  Berikutnya
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
