import type { FormEvent } from 'react';
import { Search } from 'lucide-react';

interface HomeSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function HomeSearch({ value, onChange, onSubmit }: HomeSearchProps) {
  return (
    <form onSubmit={onSubmit} className="relative">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Cari judul buku, penulis, atau topik..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
      />
    </form>
  );
}
