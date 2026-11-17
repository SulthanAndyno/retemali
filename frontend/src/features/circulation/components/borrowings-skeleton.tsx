export function BorrowingsSkeleton() {
  return (
    <div className="p-3 space-y-2">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}
