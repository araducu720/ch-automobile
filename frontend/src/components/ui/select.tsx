import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, hint, options, placeholder, id, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-[var(--text-primary)]"
          >
            {label}
            {props.required && <span className="ml-1 text-[var(--status-error)]">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              'flex h-11 w-full appearance-none rounded-lg border-2 px-3.5 py-2.5 pr-8 text-sm transition-all duration-200',
              'bg-[var(--input-bg)] text-[var(--text-primary)]',
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
            aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
        </div>
        {hint && !error && (
          <p id={`${selectId}-hint`} className="text-xs text-[var(--text-tertiary)]">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${selectId}-error`} className="text-xs text-[var(--status-error)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

export { Select };
