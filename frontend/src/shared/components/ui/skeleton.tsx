export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-card bg-surface-blue/70 ${className}`}
      aria-hidden
    />
  );
}
