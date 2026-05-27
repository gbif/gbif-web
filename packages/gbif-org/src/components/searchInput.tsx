import * as React from 'react';

import { cn } from '@/utils/shadcn';
import { MdSearch } from 'react-icons/md';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  inputClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onSearch, inputClassName, placeholder, 'aria-label': ariaLabel, ...props }, ref) => {
    const accessibleLabel =
      ariaLabel ?? (typeof placeholder === 'string' ? placeholder : undefined);
    return (
      <div
        className={cn(
          'g-inline-flex disabled:g-opacity-50 g-items-center g-justify-center g-w-16 g-px-2',
          className
        )}
      >
        <input
          type={type}
          placeholder={placeholder}
          aria-label={accessibleLabel}
          className={cn(
            'g-flex-auto g-block g-w-8 g-bg-transparent g-py-1 g-text-base sm:g-text-sm g-transition-colors file:g-border-0 file:g-bg-transparent file:g-text-sm file:g-font-medium placeholder:g-text-muted-foreground focus-visible:g-outline-none disabled:g-cursor-not-allowed',
            inputClassName
          )}
          ref={ref}
          {...props}
        />
        <button
          type="submit"
          aria-label={accessibleLabel}
          onClick={() => {
            if (onSearch) {
              onSearch((ref as React.RefObject<HTMLInputElement>)?.current?.value || '');
            }
          }}
          className="g-text-slate-400 g-text-center g-flex-none g-px-1"
          style={{ fontSize: '1.5em', marginTop: '-0.2em' }}
        >
          <MdSearch />
        </button>
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };
