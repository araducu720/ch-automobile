'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

/* ---------- Star Rating Display ---------- */
interface StarRatingProps extends HTMLAttributes<HTMLDivElement> {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const StarRating = forwardRef<HTMLDivElement, StarRatingProps>(
  ({ rating, maxRating = 5, size = 'md', showValue = false, className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-3.5 w-3.5',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-0.5', className)}
        role="img"
        aria-label={`${rating} von ${maxRating} Sternen`}
        {...props}
      >
        {Array.from({ length: maxRating }, (_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              className={cn(
                sizeClasses[size],
                filled
                  ? 'fill-[var(--brand-accent)] text-[var(--brand-accent)]'
                  : half
                    ? 'fill-[var(--brand-accent)]/50 text-[var(--brand-accent)]'
                    : 'fill-none text-[var(--text-tertiary)]',
              )}
            />
          );
        })}
        {showValue && (
          <span className="ml-1.5 text-sm font-medium text-[var(--text-secondary)]">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  },
);
StarRating.displayName = 'StarRating';

/* ---------- Interactive Star Rating ---------- */
interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  label?: string;
}

function StarRatingInput({
  value,
  onChange,
  maxRating = 5,
  size = 'lg',
  error,
  label,
}: StarRatingInputProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-9 w-9',
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <span className="block text-sm font-medium text-[var(--text-primary)]">
          {label}
        </span>
      )}
      <div className="flex items-center gap-1" role="radiogroup" aria-label={label || 'Bewertung'}>
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(starValue)}
              className={cn(
                'transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] rounded-sm',
              )}
              role="radio"
              aria-checked={starValue === value}
              aria-label={`${starValue} Stern${starValue > 1 ? 'e' : ''}`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  starValue <= value
                    ? 'fill-[var(--brand-accent)] text-[var(--brand-accent)]'
                    : 'fill-none text-[var(--text-tertiary)] hover:text-[var(--brand-accent)]',
                )}
              />
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-[var(--status-error)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export { StarRating, StarRatingInput };
