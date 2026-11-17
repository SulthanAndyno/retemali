import { Plus, Sparkles } from 'lucide-react';

interface EventsHeroProps {
  canCreate: boolean;
  onCreate: () => void;
}

export function EventsHero({ canCreate, onCreate }: EventsHeroProps) {
  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100/70">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-blue-600 mb-1">
          <Sparkles size={16} />
          <span className="text-xs font-bold tracking-wider uppercase">Agenda Literasi</span>
        </div>
        {canCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus size={14} />
            <span>Tambah Kegiatan</span>
          </button>
        )}
      </div>
      <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
        Kegiatan Komunitas
      </h1>
      <p className="text-xs text-slate-600 mt-1">
        Ajak adik dan tetangga berkumpul seru. Seluruh kegiatan terbuka untuk warga Betawi
        Permai &amp; Jatirangga.
      </p>
    </section>
  );
}
