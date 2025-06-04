import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/shadcn';

const buttonVariants = cva(
  'g-bg-transparent g-inline-flex g-items-center g-justify-center g-rounded-md g-text-sm g-font-medium g-transition-colors focus-visible:g-outline-none focus-visible:g-ring-1 focus-visible:g-ring-ring disabled:g-pointer-events-none disabled:g-opacity-50',
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
        ghost: 'hover:g-bg-accent hover:g-text-accent-foreground',
        link: 'g-text-primary g-underline-offset-4 hover:g-underline',
        linkDestructive: 'g-text-destructive g-underline-offset-4 hover:g-underline',
        plain: '',
        destructiveSecondary: 'g-text-red-600 g-bg-red-50 hover:g-bg-red-100',
      },
      size: {
        default: 'g-h-9 g-px-4 g-py-2',
        sm: 'g-h-8 g-rounded-md g-px-3 g-text-xs',
        lg: 'g-h-10 g-rounded-md g-px-8',
        icon: 'g-h-9 g-w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
