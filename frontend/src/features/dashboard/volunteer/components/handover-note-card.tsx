'use client';

import { CloudCheck, FileEdit, Send } from 'lucide-react';

const QUICK_TAGS = ['Stok Sanitizer Tipis', 'Rak Ensiklopedia Rapi'];

interface HandoverNoteCardProps {
  content: string;
  tags: string[];
  pending: boolean;
  onContentChange: (value: string) => void;
  onToggleTag: (tag: string) => void;
  onSave: () => void;
}

export function HandoverNoteCard({
  content,
  tags,
  pending,
  onContentChange,
  onToggleTag,
  onSave,
}: HandoverNoteCardProps) {
  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100/80 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
          <FileEdit size={18} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-900 leading-tight">
            Catatan Kendala &amp; Logistik Piket
          </h3>
          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
            Diserahkan otomatis untuk Shift Siang (14:00)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {QUICK_TAGS.map((tag) => {
          const active = tags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                active ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              + {tag}
            </button>
          );
        })}
      </div>

      <textarea
        rows={3}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Tulis catatan pergantian shift, temuan buku rusak, atau kebutuhan logistik pos jaga..."
        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
      />

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
          <CloudCheck size={14} className="text-emerald-500" />
          <span>Auto-draft tersimpan</span>
        </span>

        <button
          onClick={onSave}
          disabled={pending}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          <Send size={13} />
          <span>{pending ? 'Menyimpan...' : 'Simpan Catatan'}</span>
        </button>
      </div>
    </section>
  );
}
