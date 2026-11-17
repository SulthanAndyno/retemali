import { Heart, QrCode, Users } from 'lucide-react';

interface HomeSupportProps {
  onDonate: () => void;
  onJoinVolunteer: () => void;
}

export function HomeSupport({ onDonate, onJoinVolunteer }: HomeSupportProps) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
          Gerakan Gotong Royong
        </h3>
        <p className="text-[11px] text-slate-500 leading-tight">
          Bantu taman baca warga terus berkembang
        </p>
      </div>

      <div className="space-y-2.5">
        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Heart size={20} className="fill-white" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Donasi Buku &amp; Dana Operasional
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Salurkan buku layak baca anak atau infak kas baca melalui QRIS terverifikasi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onDonate}
              className="py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-2xs transition-colors"
            >
              📚 Kirim Buku
            </button>
            <button
              onClick={onDonate}
              className="py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <QrCode size={14} />
              <span>QRIS Donasi</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Gabung Relawan</h4>
              <p className="text-[11px] text-slate-500">Pengajar dongeng &amp; admin sirkulasi</p>
            </div>
          </div>

          <button
            onClick={onJoinVolunteer}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl shrink-0 transition-colors"
          >
            Daftar
          </button>
        </div>
      </div>
    </section>
  );
}
