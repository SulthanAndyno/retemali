import {
  Banknote,
  CreditCard,
  Pencil,
  Plus,
  Power,
  QrCode,
  Trash2,
} from 'lucide-react';
import type { PaymentAccount } from '../types/admin.types';
import type { PaymentAccountFormValues } from '../hooks/use-payment-accounts';
import { PaymentAccountForm } from './payment-account-form';

interface PaymentAccountsCardProps {
  accounts: PaymentAccount[];
  loading: boolean;
  error: string | null;
  busyId: string | null;
  formOpen: boolean;
  editingId: string | null;
  form: PaymentAccountFormValues;
  qrisPreview: string | null;
  saving: boolean;
  onReload: () => void;
  onCreate: () => void;
  onEdit: (account: PaymentAccount) => void;
  onToggle: (account: PaymentAccount) => void;
  onDelete: (account: PaymentAccount) => void;
  onCloseForm: () => void;
  onFieldChange: <K extends keyof PaymentAccountFormValues>(
    field: K,
    value: PaymentAccountFormValues[K]
  ) => void;
  onQrisFileChange: (file: File | null) => void;
  onSubmit: () => void;
}

export function PaymentAccountsCard({
  accounts,
  loading,
  error,
  busyId,
  formOpen,
  editingId,
  form,
  qrisPreview,
  saving,
  onReload,
  onCreate,
  onEdit,
  onToggle,
  onDelete,
  onCloseForm,
  onFieldChange,
  onQrisFileChange,
  onSubmit,
}: PaymentAccountsCardProps) {
  const activeCount = accounts.filter((account) => account.isActive).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
          <CreditCard size={18} className="text-blue-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Kanal Pembayaran Donasi</h2>
        </div>
        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
          {activeCount} Aktif
        </span>
      </div>

      <p className="text-[11px] text-slate-500">
        Hanya kanal berstatus <strong>Aktif</strong> yang tampil di halaman donasi publik.
        Admin dapat menambah beberapa rekening bank sekaligus dan mengatur QRIS di sini.
      </p>

      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-between gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <p className="text-xs text-rose-700">{error}</p>
          <button
            type="button"
            onClick={onReload}
            className="text-[10px] font-bold text-rose-700 hover:underline shrink-0"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {accounts.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-3">Belum ada kanal pembayaran</p>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className={`p-3 rounded-xl border space-y-2 ${
                  account.isActive
                    ? 'bg-blue-50/50 border-blue-100'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        account.type === 'QRIS'
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {account.type === 'QRIS' ? <QrCode size={15} /> : <Banknote size={15} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {account.providerName}
                      </p>
                      {account.type === 'BANK_TRANSFER' ? (
                        <>
                          <p className="text-[11px] font-mono text-slate-700">
                            {account.accountNumber}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            a.n. {account.accountName ?? '-'}
                          </p>
                        </>
                      ) : (
                        <p className="text-[10px] text-slate-500 truncate">
                          NMID: {account.qrisNmid ?? '-'}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      account.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {account.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onToggle(account)}
                    disabled={busyId === account.id}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border flex items-center justify-center gap-1 transition-colors disabled:opacity-50 ${
                      account.isActive
                        ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    <Power size={11} />
                    {account.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(account)}
                    className="py-1.5 px-2.5 rounded-lg text-[10px] font-bold bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-1"
                  >
                    <Pencil size={11} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Hapus kanal pembayaran "${account.providerName}"?`)) {
                        onDelete(account);
                      }
                    }}
                    disabled={busyId === account.id}
                    className="py-1.5 px-2.5 rounded-lg text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <Trash2 size={11} /> Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!formOpen && (
        <button
          type="button"
          onClick={onCreate}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors text-xs"
        >
          <Plus size={14} />
          <span>Tambah Kanal Pembayaran</span>
        </button>
      )}

      {formOpen && (
        <PaymentAccountForm
          editing={editingId !== null}
          form={form}
          qrisPreview={qrisPreview}
          saving={saving}
          onFieldChange={onFieldChange}
          onQrisFileChange={onQrisFileChange}
          onSubmit={onSubmit}
          onClose={onCloseForm}
        />
      )}
    </div>
  );
}
