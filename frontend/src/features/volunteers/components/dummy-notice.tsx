import { Info } from 'lucide-react';

export function DummyNotice() {
  return (
    <p className="flex items-center gap-1.5 text-xs text-ink-soft">
      <Info className="h-3.5 w-3.5" aria-hidden />
      Sebagian data masih berupa contoh sementara dan akan diperbarui setelah
      fitur tersedia.
    </p>
  );
}
