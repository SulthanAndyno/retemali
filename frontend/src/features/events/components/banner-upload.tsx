import { Upload } from 'lucide-react';

interface BannerUploadProps {
  preview: string | null;
  onSelect: (file: File | null) => void;
}

export function BannerUpload({ preview, onSelect }: BannerUploadProps) {
  return (
    <div>
      <label className="font-semibold text-slate-700 block mb-1">
        Upload Poster / Banner Kegiatan
      </label>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors shadow-2xs">
          <Upload size={14} className="text-blue-600" />
          <span>Pilih Gambar Poster</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => onSelect(event.target.files?.[0] ?? null)}
            className="hidden"
          />
        </label>
        {preview ? (
          <div className="flex items-center gap-2">
            <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview Banner" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">Poster siap</span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">Belum ada gambar dipilih</span>
        )}
      </div>
    </div>
  );
}
