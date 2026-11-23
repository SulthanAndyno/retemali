'use client';

import { BookOpen, Calendar, ChevronRight, Heart } from 'lucide-react';

interface PortalQuickLinksProps {
  onCatalog: () => void;
  onEvents: () => void;
  onDonate: () => void;
}

/**
 * Tautan cepat ke halaman publik. Ditampilkan hanya pada tablet/desktop
 * (`md:` ke atas) karena bottom navigation mobile sudah menyediakan tujuan
 * yang sama, dan pada layar lebar bilah bawah itu disembunyikan.
 */
export function PortalQuickLinks({
  onCatalog,
  onEvents,
  onDonate,
}: PortalQuickLinksProps) {
  const links = [
    {
      label: 'Katalog Buku Warga',
      description: 'Telusuri koleksi dan ajukan peminjaman buku',
      icon: BookOpen,
      onClick: onCatalog,
    },
    {
      label: 'Agenda & Kelas Komunitas',
      description: 'Lihat jadwal kegiatan dan E-Tiket Anda',
      icon: Calendar,
      onClick: onEvents,
    },
    {
      label: 'Donasi & Dukungan',
      description: 'Salurkan donasi finansial atau buku layak baca',
      icon: Heart,
      onClick: onDonate,
    },
  ];

  return (
    <section className="space-y-2 rounded-2xl border border-blue-100/70 bg-white p-4 shadow-sm md:p-5">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        Jelajahi Rete Mali
      </h3>

      <div className="space-y-2 md:grid md:grid-cols-3 md:gap-2 md:space-y-0">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.label}
              type="button"
              onClick={link.onClick}
              className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left transition-colors hover:border-blue-200 hover:bg-blue-50/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Icon size={18} aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900">
                    {link.label}
                  </h4>
                  <p className="text-[11px] leading-snug text-slate-500">
                    {link.description}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
