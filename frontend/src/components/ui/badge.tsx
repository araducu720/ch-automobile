import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-brand text-white',
        secondary: 'bg-tertiary text-muted border border-border',
        success: 'bg-success-bg text-success border border-success',
        warning: 'bg-warning-bg text-warning border border-warning',
        error: 'bg-error-bg text-error border border-error',
        info: 'bg-info-bg text-info border border-info',
        outline: 'border border-border text-foreground',
        accent: 'bg-accent text-brand-secondary font-bold',
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
