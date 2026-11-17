import { Save, Upload, X } from 'lucide-react';
import type { PaymentAccountType } from '../types/admin.types';
import type { PaymentAccountFormValues } from '../hooks/use-payment-accounts';

interface PaymentAccountFormProps {
  editing: boolean;
  form: PaymentAccountFormValues;
  qrisPreview: string | null;
  saving: boolean;
  onFieldChange: <K extends keyof PaymentAccountFormValues>(
    field: K,
    value: PaymentAccountFormValues[K]
  ) => void;
  onQrisFileChange: (file: File | null) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function PaymentAccountForm({
  editing,
  form,
  qrisPreview,
  saving,
  onFieldChange,
  onQrisFileChange,
  onSubmit,
  onClose,
}: PaymentAccountFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="border-t border-gray-100 pt-3 space-y-2.5 text-xs"
    >
      <div className="flex items-center justify-between">
        <p className="font-bold text-slate-900">
          {editing ? 'Ubah Kanal Pembayaran' : 'Kanal Pembayaran Baru'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X size={15} />
        </button>
      </div>

      <div>
        <label className="text-[11px] text-gray-600 block mb-1">Jenis Kanal</label>
        <select
          value={form.type}
          onChange={(event) =>
            onFieldChange('type', event.target.value as PaymentAccountType)
          }
          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 font-semibold text-gray-800"
        >
          <option value="BANK_TRANSFER">Transfer Bank</option>
          <option value="QRIS">QRIS</option>
        </select>
      </div>

      <div>
        <label className="text-[11px] text-gray-600 block mb-1">
          {form.type === 'QRIS' ? 'Nama Kanal' : 'Nama Bank'}
        </label>
        <input
          type="text"
          value={form.providerName}
          onChange={(event) => onFieldChange('providerName', event.target.value)}
          placeholder={form.type === 'QRIS' ? 'QRIS Statis' : 'Bank Mandiri'}
          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800"
        />
      </div>

      {form.type === 'BANK_TRANSFER' ? (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-gray-600 block mb-1">Nomor Rekening</label>
            <input
              type="text"
              value={form.accountNumber}
              onChange={(event) => onFieldChange('accountNumber', event.target.value)}
              placeholder="1234567890"
              className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 font-mono font-bold text-gray-800"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-600 block mb-1">Atas Nama (a.n.)</label>
            <input
              type="text"
              value={form.accountName}
              onChange={(event) => onFieldChange('accountName', event.target.value)}
              placeholder="Yayasan Taman Baca Rete Mali"
              className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 font-medium"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <label className="text-[11px] text-gray-600 block mb-1">Nomor NMID</label>
            <input
              type="text"
              value={form.qrisNmid}
              onChange={(event) => onFieldChange('qrisNmid', event.target.value)}
              placeholder="ID1024389271649"
              className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 font-mono text-gray-800"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-600 block mb-1">
              Gambar QRIS (JPG/PNG)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-400 text-blue-700 rounded-lg font-bold cursor-pointer hover:bg-blue-50 transition-colors">
                <Upload size={13} />
                <span>Pilih Gambar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => onQrisFileChange(event.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </label>
              {qrisPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrisPreview}
                  alt="Preview QRIS"
                  className="w-10 h-10 object-cover rounded border"
                />
              ) : editing ? (
                <span className="text-[10px] text-gray-500">
                  Kosongkan jika tidak mengganti gambar
                </span>
              ) : (
                <span className="text-[10px] text-gray-400">Belum ada file dipilih</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
        >
          <Save size={13} />
          <span>{saving ? 'Menyimpan...' : 'Simpan Kanal'}</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
