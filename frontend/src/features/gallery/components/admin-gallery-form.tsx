'use client';

import { Link2, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { Input, Select, Textarea } from '@/shared/components/ui/input';
import { GALLERY_CATEGORY_OPTIONS } from '../lib/gallery-options';
import type { GalleryCategory, GalleryFormValues } from '../types/gallery.types';
import type { GalleryFormField } from '../hooks/use-admin-gallery';

interface AdminGalleryFormProps {
  form: GalleryFormValues;
  fieldErrors: Partial<Record<GalleryFormField, string>>;
  saving: boolean;
  updateField: <K extends GalleryFormField>(
    field: K,
    value: GalleryFormValues[K],
  ) => void;
  onSubmit: () => void;
  onReset: () => void;
}

/**
 * Form admin untuk menempelkan tautan Google Drive. Berkas tidak diunggah;
 * hanya link yang dikirim dan disimpan backend.
 */
export function AdminGalleryForm({
  form,
  fieldErrors,
  saving,
  updateField,
  onSubmit,
  onReset,
}: AdminGalleryFormProps) {
  return (
    <Card>
      <SectionTitle
        title="Tambah Foto dari Google Drive"
        description="Tempel link file atau folder Drive. Foto tetap tersimpan di Drive; yang disimpan di sini hanya tautannya."
      />

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Input
          id="gallery-drive-url"
          label="Link Google Drive"
          placeholder="https://drive.google.com/file/d/FILE_ID/view"
          value={form.driveUrl}
          error={fieldErrors.driveUrl}
          hint="Pastikan akses file disetel 'Anyone with the link'. Link folder akan mengimpor semua foto di dalamnya."
          leadingIcon={<Link2 className="h-4 w-4" aria-hidden />}
          onChange={(event) => updateField('driveUrl', event.target.value)}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="gallery-title"
            label="Judul Foto"
            placeholder="Kegiatan Membaca Bersama"
            value={form.title}
            error={fieldErrors.title}
            hint="Kosongkan untuk judul default."
            onChange={(event) => updateField('title', event.target.value)}
          />
          <Select
            id="gallery-category"
            label="Kategori"
            value={form.category}
            options={GALLERY_CATEGORY_OPTIONS}
            onChange={(event) =>
              updateField('category', event.target.value as GalleryCategory)
            }
          />
        </div>

        <Input
          id="gallery-location"
          label="Lokasi"
          value={form.location}
          error={fieldErrors.location}
          onChange={(event) => updateField('location', event.target.value)}
        />

        <Textarea
          id="gallery-caption"
          label="Keterangan"
          placeholder="Cerita singkat di balik foto ini (opsional)."
          value={form.caption}
          error={fieldErrors.caption}
          onChange={(event) => updateField('caption', event.target.value)}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30"
            checked={form.isFeatured}
            onChange={(event) => updateField('isFeatured', event.target.checked)}
          />
          Tandai sebagai foto unggulan
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" loading={saving}>
            {!saving ? <Plus className="h-4 w-4" aria-hidden /> : null}
            Tambah Foto
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            disabled={saving}
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
