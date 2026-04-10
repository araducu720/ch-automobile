import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-primary)]"
          >
            {label}
            {props.required && <span className="text-[var(--status-error)] ml-0.5">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          className={cn(
            'flex min-h-[100px] w-full rounded-lg border bg-[var(--bg-primary)] px-3.5 py-2.5',
            'text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
            'transition-all duration-200 resize-y',
            'focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-[var(--status-error)] focus:ring-[var(--status-error)]'
              : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]',
            className,
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[var(--status-error)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
