'use client';

interface VolunteerCtaProps {
  onOpen: () => void;
}

export function VolunteerCta({ onOpen }: VolunteerCtaProps) {
  return (
    <section className="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between gap-3">
      <div>
        <p className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">
          Program Relawan
        </p>
        <h3 className="text-sm font-extrabold mt-0.5">Ingin Mengabdi Jadi Relawan?</h3>
        <p className="text-[11px] text-teal-100 mt-0.5">
          Daftar sesi mengajar anak, kurasi sirkulasi, atau pemandu kelas.
        </p>
      </div>
      <button
        onClick={onOpen}
        className="px-3.5 py-2 bg-white text-teal-800 rounded-xl text-xs font-bold shrink-0 hover:bg-teal-50 shadow-sm"
      >
        Daftar
      </button>
    </section>
  );
}
