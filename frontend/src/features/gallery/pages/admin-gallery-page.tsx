'use client';

import { SectionTitle } from '@/shared/components/ui/card';
import { Select } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/toast';
import { AdminGalleryForm } from '../components/admin-gallery-form';
import { AdminGalleryGrid } from '../components/admin-gallery-grid';
import { useAdminGallery } from '../hooks/use-admin-gallery';
import { GALLERY_CATEGORY_OPTIONS } from '../lib/gallery-options';
import type { GalleryCategory, GalleryPhoto } from '../types/gallery.types';

const CATEGORY_FILTER_OPTIONS = [
  { value: '', label: 'Semua kategori' },
  ...GALLERY_CATEGORY_OPTIONS,
];

export function AdminGalleryPage() {
  const { toast } = useToast();
  const gallery = useAdminGallery();

  const handleSubmit = async () => {
    const result = await gallery.submit();
    toast(result.message, result.ok ? 'success' : 'error');
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    const confirmed = window.confirm(
      `Hapus foto "${photo.title}" dari galeri? Tautan akan dihapus, berkas di Google Drive tidak tersentuh.`,
    );
    if (!confirmed) return;

    const result = await gallery.remove(photo);
    toast(result.message, result.ok ? 'success' : 'error');
  };

  const handleToggleFeatured = async (photo: GalleryPhoto) => {
    const result = await gallery.toggleFeatured(photo);
    toast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Galeri Kegiatan"
        description="Tambahkan foto dengan menempelkan tautan Google Drive. Berkas tetap di Drive; dashboard hanya menyimpan tautannya."
      />

      <AdminGalleryForm
        form={gallery.form}
        fieldErrors={gallery.fieldErrors}
        saving={gallery.saving}
        updateField={gallery.updateField}
        onSubmit={() => void handleSubmit()}
        onReset={gallery.resetForm}
      />

      <div className="space-y-3">
        <div className="max-w-xs">
          <Select
            id="gallery-category-filter"
            label="Filter kategori"
            value={gallery.category}
            options={CATEGORY_FILTER_OPTIONS}
            onChange={(event) =>
              gallery.setCategory(event.target.value as GalleryCategory | '')
            }
          />
        </div>

        <AdminGalleryGrid
          photos={gallery.photos}
          meta={gallery.meta}
          loading={gallery.loading}
          error={gallery.error}
          page={gallery.page}
          deletingId={gallery.deletingId}
          togglingId={gallery.togglingId}
          onDelete={(photo) => void handleDelete(photo)}
          onToggleFeatured={(photo) => void handleToggleFeatured(photo)}
          onPageChange={gallery.setPage}
          onReload={() => void gallery.reload()}
        />
      </div>
    </div>
  );
}
