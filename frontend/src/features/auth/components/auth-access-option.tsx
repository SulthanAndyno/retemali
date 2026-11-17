import type { ReactNode } from 'react';
import { BookOpen, HeartHandshake, ShieldCheck, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { AccessModeOption } from '../lib/auth-options';
import type { AccessMode } from '../types';

const ICONS: Record<AccessMode, ReactNode> = {
  NON_MEMBER: <BookOpen className="h-5 w-5" aria-hidden />,
  MEMBER: <User className="h-5 w-5" aria-hidden />,
  VOLUNTEER: <HeartHandshake className="h-5 w-5" aria-hidden />,
  ADMIN: <ShieldCheck className="h-5 w-5" aria-hidden />,
};

export function AuthAccessOption({
  option,
  selected,
  onSelect,
}: {
  option: AccessModeOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-start gap-3 rounded-card border p-4 text-left transition-all ${
        selected
          ? 'border-primary bg-surface-blue ring-2 ring-primary/30'
          : 'border-surface-soft bg-white hover:border-primary/50 hover:bg-surface-blue/50'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          selected ? 'bg-primary text-white' : 'bg-surface text-primary-deep'
        }`}
      >
        {ICONS[option.key]}
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-ink">{option.label}</span>
          {option.badge ? (
            <Badge tone="warning">{option.badge}</Badge>
          ) : null}
        </span>
        <span className="mt-0.5 block text-sm text-ink-soft">
          {option.desc}
        </span>
      </span>
    </button>
  );
}
