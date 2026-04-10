'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const iconMap: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styleMap: Record<ToastType, string> = {
  success: 'border-[var(--status-success)] bg-[var(--status-success-bg)] text-[var(--status-success)]',
  error: 'border-[var(--status-error)] bg-[var(--status-error-bg)] text-[var(--status-error)]',
  warning: 'border-[var(--status-warning)] bg-[var(--status-warning-bg)] text-[var(--status-warning)]',
  info: 'border-[var(--status-info)] bg-[var(--status-info-bg)] text-[var(--status-info)]',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const ta = useTranslations('accessibility');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (opts: Omit<Toast, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const toast: Toast = { ...opts, id };
      setToasts((prev) => [...prev, toast]);

      const duration = opts.duration ?? 5000;
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  const ctx: ToastContextValue = {
    toast: addToast,
    success: (title, message) => addToast({ type: 'success', title, message }),
    error: (title, message) => addToast({ type: 'error', title, message }),
    warning: (title, message) => addToast({ type: 'warning', title, message }),
    info: (title, message) => addToast({ type: 'info', title, message }),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* Toast container */}
      <div
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        role="status"
      >
        {toasts.map((t) => {
          const Icon = iconMap[t.type];
          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg',
                'animate-[slide-up-in_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]',
                styleMap[t.type],
              )}
              role="alert"
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{t.title}</p>
                {t.message && (
                  <p className="text-xs mt-0.5 opacity-80">{t.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 p-0.5 rounded-md hover:bg-black/10 transition-colors"
                aria-label={ta('close')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
