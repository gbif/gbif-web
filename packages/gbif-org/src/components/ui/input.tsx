import * as React from 'react';

import { cn } from '@/utils/shadcn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'g-flex g-h-9 g-w-full g-rounded-md g-border g-border-solid g-border-input g-bg-transparent g-px-3 g-py-1 g-text-sm g-shadow-sm g-transition-colors file:g-border-0 file:g-bg-transparent file:g-text-sm file:g-font-medium placeholder:g-text-muted-foreground focus-visible:g-outline-none focus-visible:g-ring-1 focus-visible:g-ring-ring disabled:g-cursor-not-allowed disabled:g-opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
