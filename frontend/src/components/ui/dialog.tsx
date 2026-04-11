'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, useCallback, useRef, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

/* ---------- Dialog / Modal ---------- */
interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

function Dialog({
  open,
  onClose,
  children,
  title,
  description,
  className,
  size = 'md',
}: DialogProps) {
  const t = useTranslations('accessibility');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      // Focus trap: focus the dialog
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 0);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
        previousFocusRef.current?.focus();
      };
    }
  }, [open, handleEscape]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-overlay backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Content */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-description' : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-50 w-full rounded-xl border border-border bg-card shadow-xl',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          'max-h-[90vh] overflow-y-auto',
          sizeClasses[size],
          className,
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            'absolute right-4 top-4 rounded-md p-1 transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-secondary',
            'focus-visible:outline-2 focus-visible:outline-border-focus',
          )}
          aria-label={t('close')}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {title && (
            <h2
              id="dialog-title"
              className="text-lg font-semibold text-foreground pr-8"
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              id="dialog-description"
              className="mt-1.5 text-sm text-muted"
            >
              {description}
            </p>
          )}
          <div className={cn(title || description ? 'mt-4' : '')}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export { Dialog };
