import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-card border border-surface-soft bg-white shadow-card ${
        padded ? 'p-5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-primary-deep">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-sm text-ink-soft">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="flex items-center gap-4">
      {icon ? (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-blue text-primary-deep">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="truncate text-sm text-ink-soft">{label}</p>
        <p className="text-2xl font-bold text-primary-deep">{value}</p>
        {hint ? <p className="text-xs text-ink-soft">{hint}</p> : null}
      </div>
    </Card>
  );
}
