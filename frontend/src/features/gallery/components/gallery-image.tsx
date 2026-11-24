'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getImageUrl } from '@/shared/lib/utils';
import type { GalleryPhoto } from '../types/gallery.types';

interface GalleryImageProps {
  photo: Pick<GalleryPhoto, 'imageUrl' | 'lh3ImageUrl' | 'title'>;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Menampilkan foto galeri hasil tautan Google Drive.
 *
 * Urutan sumber: `lh3ImageUrl` (CDN Google, paling andal hotlink) → `imageUrl`
 * (drive.google.com/thumbnail) → placeholder. Google sesekali membalas 403/HTML
 * untuk hotlink, jadi tiap kegagalan berpindah ke kandidat berikutnya alih-alih
 * menampilkan broken image.
 */
export function GalleryImage({
  photo,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 320px',
  className = 'object-cover',
  priority = false,
}: GalleryImageProps) {
  const candidates = [photo.lh3ImageUrl, getImageUrl(photo.imageUrl)].filter(
    (value): value is string => Boolean(value),
  );
  const [index, setIndex] = useState(0);
  const [exhausted, setExhausted] = useState(candidates.length === 0);
  const src = candidates[index];

  if (exhausted || !src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface-soft px-3 text-center text-xs text-ink-soft">
        {photo.title || 'Foto tidak tersedia'}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={photo.title || 'Foto galeri Rete Mali'}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => {
        if (index < candidates.length - 1) {
          setIndex(index + 1);
        } else {
          setExhausted(true);
        }
      }}
    />
  );
}
