'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'dialog' | 'sheet';
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = 'dialog',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();

      if (event.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((element) => element.offsetParent !== null);

        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    const timer = window.setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      previousFocus?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center ${
        variant === 'sheet' ? 'z-[70]' : 'z-50'
      } ${
        variant === 'sheet'
          ? 'items-end p-0 sm:items-center sm:p-4'
          : 'items-end p-4 sm:items-center'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative z-10 flex w-full flex-col bg-white shadow-pop focus:outline-none ${
          variant === 'sheet'
            ? 'max-h-[90dvh] rounded-t-card sm:max-w-lg sm:rounded-card'
            : 'max-w-md rounded-card'
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-surface-soft p-5">
          <div>
            <h2 className="text-base font-bold text-primary-deep">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-ink-soft">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div
          className={
            variant === 'sheet'
              ? 'min-h-0 flex-1 overflow-y-auto p-5'
              : 'max-h-[70dvh] overflow-y-auto p-5'
          }
        >
          {children}
        </div>
        {footer ? (
          <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-surface-soft p-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
