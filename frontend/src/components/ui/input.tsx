import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/* ---------- Input ---------- */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, hint, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[var(--text-primary)]"
          >
            {label}
            {props.required && <span className="ml-1 text-[var(--status-error)]">*</span>}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'flex h-11 w-full rounded-lg border-2 px-3.5 py-2.5 text-sm transition-all duration-200',
            'bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
            'shadow-[var(--input-shadow)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:border-[var(--border-focus)] focus:shadow-[0_0_0_3px_rgba(30,64,175,0.12)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-[var(--status-error)] focus:ring-[var(--status-error)]'
              : 'border-[var(--border-input)]',
            className,
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--text-tertiary)]">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[var(--status-error)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

/* ---------- Textarea ---------- */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
    const textareaId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold text-[var(--text-primary)]"
          >
            {label}
            {props.required && <span className="ml-1 text-[var(--status-error)]">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[100px] w-full rounded-lg border-2 px-3.5 py-2.5 text-sm transition-all duration-200',
            'bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
            'shadow-[var(--input-shadow)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:border-[var(--border-focus)] focus:shadow-[0_0_0_3px_rgba(30,64,175,0.12)]',
            'disabled:cursor-not-allowed disabled:opacity-50 resize-y',
            error
              ? 'border-[var(--status-error)] focus:ring-[var(--status-error)]'
              : 'border-[var(--border-input)]',
            className,
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-xs text-[var(--text-tertiary)]">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-[var(--status-error)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Input, Textarea };
