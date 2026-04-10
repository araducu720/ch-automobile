import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] shadow-sm hover:shadow-md active:scale-[0.98]',
        secondary:
          'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-primary)] border border-[var(--border-primary)]',
        outline:
          'border border-[var(--border-primary)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:border-[var(--border-secondary)]',
        ghost:
          'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
        destructive:
          'bg-[var(--status-error)] text-white hover:bg-red-700 shadow-sm',
        accent:
          'bg-[var(--brand-accent)] text-[var(--brand-secondary)] hover:bg-[var(--brand-accent-hover)] shadow-sm font-semibold',
        link:
          'text-[var(--text-link)] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    // When asChild, Slot expects exactly one React element child.
    // Icons/loading should be placed inside the child element instead.
    const content = asChild ? (
      children
    ) : (
      <>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </>
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
