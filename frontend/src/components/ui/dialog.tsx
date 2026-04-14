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

  const getFocusableElements = useCallback(() => {
    if (!dialogRef.current) return [];
    return Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusableElements();
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === dialogRef.current) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose, getFocusableElements],
  );

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus the first focusable element, or the dialog itself
      setTimeout(() => {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          dialogRef.current?.focus();
        }
      }, 0);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previousFocusRef.current?.focus();
      };
    }
  }, [open, handleKeyDown, getFocusableElements]);

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
