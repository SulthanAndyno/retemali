interface CatalogToastProps {
  notification: { message: string; type: 'success' | 'error' } | null;
}

export function CatalogToast({ notification }: CatalogToastProps) {
  if (!notification) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium transition-all ${
        notification.type === 'success'
          ? 'bg-blue-600 text-white'
          : 'bg-rose-600 text-white'
      }`}
    >
      {notification.message}
    </div>
  );
}
