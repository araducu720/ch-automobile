import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--brand-primary)] text-white',
        secondary: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]',
        success: 'bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success)]',
        warning: 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning)]',
        error: 'bg-[var(--status-error-bg)] text-[var(--status-error)] border border-[var(--status-error)]',
        info: 'bg-[var(--status-info-bg)] text-[var(--status-info)] border border-[var(--status-info)]',
        outline: 'border border-[var(--border-primary)] text-[var(--text-primary)]',
        accent: 'bg-[var(--brand-accent)] text-[var(--brand-secondary)] font-bold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
