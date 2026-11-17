import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export function PublicEmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-surface-soft bg-white px-6 py-10 text-center ${className}`}
    >
      <span className="text-ink-soft/70">{icon ?? <Inbox aria-hidden />}</span>
      <p className="font-semibold text-ink">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-ink-soft">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
