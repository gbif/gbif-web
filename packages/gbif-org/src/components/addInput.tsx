import * as React from 'react';
import { cn } from '@/utils/shadcn';
import { MdAddCircle } from 'react-icons/md';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onAdd?: (value: string) => void;
  inputClassName?: string;
  value?: string;
}

const AddInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onAdd, inputClassName, value, ...props }, ref) => {
    return (
      <div
        className={cn(
          'g-inline-flex disabled:g-opacity-50 g-items-center g-justify-center g-w-16 g-px-2',
          className
        )}
      >
        <input
          value={value}
          type={type}
          className={cn(
            'g-flex-auto g-block g-w-8 g-bg-transparent g-py-1 g-text-base sm:g-text-sm g-transition-colors file:g-border-0 file:g-bg-transparent file:g-text-sm file:g-font-medium placeholder:g-text-muted-foreground focus-visible:g-outline-none disabled:g-cursor-not-allowed',
            inputClassName
          )}
          ref={ref}
          {...props}
        />
        <button
          disabled={!value || value.length === 0}
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (onAdd) {
              const v = (ref as React.RefObject<HTMLInputElement>)?.current?.value || '';
              onAdd(v);
            }
          }}
          className={cn(
            'g-text-slate-400 g-text-center g-flex-none g-px-1 g-p-1 -g-me-3 g-rounded',
            {
              'g-text-primary-500': value && value.length > 0,
            }
          )}
          style={{ fontSize: '1.5em' }}
        >
          <MdAddCircle />
        </button>
      </div>
    );
  }
);
AddInput.displayName = 'AddInput';

export { AddInput };
