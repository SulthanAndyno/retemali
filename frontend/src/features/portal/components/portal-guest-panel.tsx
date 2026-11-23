import {
  BookOpen,
  Calendar,
  ChevronRight,
  LogIn,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react';

interface PortalGuestPanelProps {
  onLogin: () => void;
  onRegister: () => void;
  onCatalog: () => void;
  onEvents: () => void;
  onDonate: () => void;
}

export function PortalGuestPanel({
  onLogin,
  onRegister,
  onCatalog,
  onEvents,
  onDonate,
}: PortalGuestPanelProps) {
  return (
    <div className="space-y-3 md:grid md:grid-cols-2 md:items-start md:gap-4 md:space-y-0">
      <section className="space-y-3 rounded-2xl border border-blue-100/70 bg-white p-5 text-center shadow-sm md:p-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <User size={28} />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Selamat Datang di Rete Mali
          </h2>
          <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
            Silakan masuk atau daftar anggota untuk meminjam buku fisik, klaim
            E-Tiket kegiatan, dan fitur relawan.
          </p>
        </div>
        <div className="space-y-2 pt-2">
          <button
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <LogIn size={16} />
            <span>Masuk / Pilih Mode Akses</span>
          </button>
          <button
            onClick={onRegister}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white py-3 text-xs font-bold text-blue-700 shadow-xs transition-colors hover:bg-blue-50"
          >
            <UserPlus size={16} />
            <span>Daftar Anggota Baru</span>
          </button>
        </div>
      </section>

      <section className="space-y-2 rounded-2xl border border-blue-100/70 bg-white p-4 text-xs shadow-sm">
        <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Eksplorasi Publik Tanpa Akun
        </h3>
        <button
          onClick={onCatalog}
          className="flex w-full items-center justify-between rounded-xl p-2.5 text-left hover:bg-slate-50"
        >
          <span className="flex items-center gap-2.5">
            <BookOpen size={16} className="text-blue-600" />
            <span className="font-semibold text-slate-700">
              Katalog Buku Warga
            </span>
          </span>
          <ChevronRight size={14} className="text-slate-400" />
        </button>
        <button
          onClick={onEvents}
          className="flex w-full items-center justify-between rounded-xl p-2.5 text-left hover:bg-slate-50"
        >
          <span className="flex items-center gap-2.5">
            <Calendar size={16} className="text-blue-600" />
            <span className="font-semibold text-slate-700">
              Agenda &amp; Kelas Komunitas
            </span>
          </span>
          <ChevronRight size={14} className="text-slate-400" />
        </button>
        <button
          onClick={onDonate}
          className="flex w-full items-center justify-between rounded-xl p-2.5 text-left hover:bg-slate-50"
        >
          <span className="flex items-center gap-2.5">
            <Sparkles size={16} className="text-blue-600" />
            <span className="font-semibold text-slate-700">
              Donasi Finansial &amp; Buku
            </span>
          </span>
          <ChevronRight size={14} className="text-slate-400" />
        </button>
      </section>
    </div>
  );
}
