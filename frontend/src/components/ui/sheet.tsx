'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

/* ---------- Sheet (Slide-out panel with focus trap) ---------- */
interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  side?: 'left' | 'right';
  className?: string;
}

function Sheet({ open, onClose, children, title, side = 'right', className }: SheetProps) {
  const t = useTranslations('accessibility');
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap helper
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !sheetRef.current) return;

    const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, []);

  useEffect(() => {
    if (open) {
      // Store the element that triggered the sheet
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Focus the close button (first focusable) after open animation
      requestAnimationFrame(() => {
        const closeBtn = sheetRef.current?.querySelector<HTMLElement>('button');
        closeBtn?.focus();
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        trapFocus(e);
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
        // Restore focus to the trigger element
        previousFocusRef.current?.focus();
      };
    }
  }, [open, onClose, trapFocus]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-overlay backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Panel'}
        className={cn(
          'fixed top-0 bottom-0 z-50 w-full max-w-sm',
          'bg-card border-border shadow-xl',
          'flex flex-col',
          'transition-transform duration-300 ease-out',
          side === 'right'
            ? 'right-0 border-l translate-x-0 animate-in slide-in-from-right'
            : 'left-0 border-r translate-x-0 animate-in slide-in-from-left',
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          {title && (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
          <button
            onClick={onClose}
            className={cn(
              'rounded-md p-1 ml-auto transition-colors',
              'text-muted-foreground hover:text-foreground hover:bg-secondary',
            )}
            aria-label={t('close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

export { Sheet };
