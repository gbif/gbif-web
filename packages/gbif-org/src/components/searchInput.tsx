import * as React from 'react';

import { cn } from '@/utils/shadcn';
import { MdSearch } from 'react-icons/md';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className={cn('g-flex disabled:g-opacity-50 g-relative', className)}>
        <input
        type={type}
        className={cn(
          'g-pe-8 g-flex-auto g-h-9 g-w-full g-rounded-md g-border g-border-input g-bg-transparent g-px-3 g-py-1 g-text-sm g-shadow-sm g-transition-colors file:g-border-0 file:g-bg-transparent file:g-text-sm file:g-font-medium placeholder:g-text-muted-foreground focus-visible:g-outline-none focus-visible:g-ring-1 focus-visible:g-ring-ring disabled:g-cursor-not-allowed',
          className
        )}
        ref={ref}
        {...props}
      />
        <button type="submit" className="g-h-9 g-absolute g-top-0 g-end-2 g-flex-none g-rounded-s-none g-rounded-e g-px-2"><MdSearch /></button>
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };