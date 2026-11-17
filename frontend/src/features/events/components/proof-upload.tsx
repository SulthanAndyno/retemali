import { Image as ImageIcon, Upload } from 'lucide-react';

interface ProofUploadProps {
  file: File | null;
  preview: string | null;
  onSelect: (file: File | null) => void;
}

export function ProofUpload({ file, preview, onSelect }: ProofUploadProps) {
  return (
    <div className="space-y-2 text-xs">
      <label className="font-semibold text-slate-700 block">
        Bukti Pembayaran (JPG, PNG, atau PDF) *
      </label>
      <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-700 font-bold bg-blue-50/60 cursor-pointer hover:bg-blue-50 transition-colors">
        <Upload size={15} />
        <span>{file ? 'Ganti File' : 'Pilih File Bukti Pembayaran'}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(event) => onSelect(event.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>

      {file && (
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Pratinjau bukti pembayaran"
              className="w-10 h-10 rounded object-cover border"
            />
          ) : (
            <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center text-slate-500">
              <ImageIcon size={16} />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-800 truncate">{file.name}</p>
            <p className="text-[10px] text-slate-500">
              {(file.size / 1024).toFixed(0)} KB
            </p>
          </div>
        </div>
      )}

      <p className="text-[10px] text-slate-400">
        Maksimal 2 MB. Bukti pembayaran disimpan sebagai referensi verifikasi admin.
      </p>
    </div>
  );
}
