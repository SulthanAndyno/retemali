import { BookOpen, Camera, Mail, MessageSquare } from 'lucide-react';
import {
  VENUE_EMAIL,
  VENUE_INSTAGRAM,
  VENUE_WHATSAPP,
} from '../lib/home-constants';

export function HomeFooter() {
  return (
    <footer className="pt-4 pb-6 text-center space-y-2">
      <div className="flex items-center justify-center gap-1.5 text-blue-700 font-extrabold text-sm">
        <BookOpen size={16} />
        <span>Rete Mali</span>
      </div>

      <p className="text-[11px] text-slate-600 max-w-xs mx-auto leading-relaxed">
        Taman Bacaan Masyarakat &amp; Ruang Literasi Warga
        <br />
        Bersama RT 05 / RW 14 Kelurahan Jatirangga.
      </p>

      <div className="flex items-center justify-center gap-3 pt-1 text-slate-400">
        <a
          href={VENUE_INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Rete Mali"
          title="Instagram Rete Mali"
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
        >
          <Camera size={16} />
        </a>
        <a
          href={VENUE_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Admin Rete Mali"
          title="WhatsApp Admin Rete Mali"
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
        >
          <MessageSquare size={16} />
        </a>
        <a
          href={`mailto:${VENUE_EMAIL}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Email Admin Rete Mali"
          title="Email Admin Rete Mali"
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
        >
          <Mail size={16} />
        </a>
      </div>

      <p className="text-[10px] text-slate-400 pt-1">
        © 2026 Taman Baca Rete Mali. Gotong royong untuk literasi.
      </p>
    </footer>
  );
}
