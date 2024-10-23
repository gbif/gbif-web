import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/shadcn';

const buttonVariants = cva('gb-button', {
  variants: {
    variant: {
      default: 'gb-button-variant-default',
      destructive:
        'g-bg-destructive g-text-destructive-foreground g-shadow-sm hover:g-bg-destructive/90',
      outline:
        'g-border g-border-input g-bg-transparent g-shadow-sm hover:g-bg-accent hover:g-text-accent-foreground',
      primaryOutline: 'g-border g-bg-transparent g-shadow-sm hover:g-bg-accent hover:g-text-accent-foreground g-border-primary-500',
      secondary: 'g-bg-secondary g-text-secondary-foreground g-shadow-sm hover:g-bg-secondary/80',
      ghost: 'hover:g-bg-accent hover:g-text-accent-foreground',
      link: 'g-text-primary g-underline-offset-4 hover:g-underline',
      linkDestructive: 'g-text-destructive g-underline-offset-4 hover:g-underline',
    },
    size: {
      default: 'gb-button-size-default',
      sm: 'g-h-8 g-rounded-md g-px-3 g-text-xs',
      lg: 'g-h-10 g-rounded-md g-px-8',
      icon: 'g-h-9 g-w-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

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
