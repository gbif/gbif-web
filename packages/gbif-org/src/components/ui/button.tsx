import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/shadcn';

const buttonVariants = cva(
  'g-inline-flex g-items-center g-justify-center g-rounded-md g-text-sm g-font-medium g-transition-colors focus-visible:g-outline-none focus-visible:g-ring-1 focus-visible:g-ring-ring disabled:g-pointer-events-none disabled:g-opacity-50',
  {
    variants: {
      variant: {
        default:
          'g-bg-primary !g-text-primaryContrast g-shadow hover:g-bg-primary/90 g-border g-border-solid g-border-primary',
        destructive:
          'g-bg-destructive g-text-destructive-foreground g-shadow-sm hover:g-bg-destructive/90 g-border g-border-solid g-border-destructive',
        outline:
          'g-border g-border-solid g-border-slate-400 g-bg-transparent g-shadow-sm hover:g-bg-accent hover:g-text-accent-foreground',
        primaryOutline:
          'g-border g-border-solid g-bg-transparent g-shadow-sm hover:g-bg-accent hover:g-text-accent-foreground g-border-primary-500',
        secondary:
          'g-bg-secondary g-text-secondary-foreground g-shadow-sm hover:g-bg-secondary/80 g-border g-border-solid g-border-secondary',
        ghost:
          'g-bg-transparent hover:g-bg-accent hover:g-text-accent-foreground g-border g-border-solid g-border-transparent',
        link: 'g-bg-transparent g-text-primary g-underline-offset-4 hover:g-underline',
        linkDestructive:
          'g-bg-transparent g-text-destructive g-underline-offset-4 hover:g-underline',
        plain: '',
        destructiveSecondary: 'g-bg-transparent g-text-red-600 g-bg-red-50 hover:g-bg-red-100',
      },
      size: {
        default: 'g-h-9 g-px-4 g-py-2',
        sm: 'g-h-8 g-rounded-md g-px-3 g-text-xs',
        lg: 'g-h-10 g-rounded-md g-px-8',
        icon: 'g-h-9 g-w-9',
      },
      disabled: {
        true: 'g-cursor-not-allowed g-opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonVariantProps = Omit<VariantProps<typeof buttonVariants>, 'disabled'>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, isLoading, children, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className, disabled: props.disabled || isLoading })
        )}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <span className="g-flex g-items-center">
            <svg className="g-animate-spin g-h-5 g-w-5 g-mr-3" viewBox="0 0 24 24">
              <circle
                className="g-opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="g-opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
