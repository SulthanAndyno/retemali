export function BookCardSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 py-6">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm animate-pulse space-y-2"
        >
          <div className="w-full h-44 bg-slate-200 rounded-xl" />
          <div className="h-3 bg-slate-200 rounded w-2/3" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-8 bg-slate-200 rounded-xl w-full" />
        </div>
      ))}
    </div>
  );
}
