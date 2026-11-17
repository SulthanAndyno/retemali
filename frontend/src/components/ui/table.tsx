import type { ReactNode } from 'react';

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-card border border-surface-soft bg-white shadow-card">
      <table className="w-full min-w-max border-collapse text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-surface-blue/60 text-left">
      <tr>{children}</tr>
    </thead>
  );
}

export function TH({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-soft">
      {children}
    </th>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-surface-soft/70">{children}</tbody>;
}

export function TR({ children }: { children: ReactNode }) {
  return <tr className="transition-colors hover:bg-surface-blue/30">{children}</tr>;
}

export function TD({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-middle text-ink ${className}`}>{children}</td>;
}
