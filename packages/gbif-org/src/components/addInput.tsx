import * as React from 'react';
import { cn } from '@/utils/shadcn';
import { MdAddCircle } from 'react-icons/md';
import { useIntl } from 'react-intl';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onAdd?: (value: string) => void;
  inputClassName?: string;
  value?: string;
}

const AddInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onAdd, inputClassName, value, placeholder, ...props }, ref) => {
    const { formatMessage } = useIntl();
    const addLabel = formatMessage({ id: 'filterSupport.add', defaultMessage: 'Add' });
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
          placeholder={placeholder}
          aria-label={typeof placeholder === 'string' ? placeholder : undefined}
          className={cn(
            'g-flex-auto g-block g-w-8 g-bg-transparent g-py-1 g-text-base sm:g-text-sm g-transition-colors file:g-border-0 file:g-bg-transparent file:g-text-sm file:g-font-medium placeholder:g-text-muted-foreground focus-visible:g-outline-none disabled:g-cursor-not-allowed',
            inputClassName
          )}
          ref={ref}
          {...props}
        />
        <button
          disabled={!value || value.length === 0}
          type="button"
          aria-label={addLabel}
          onClick={() => {
            if (onAdd) {
              onAdd(value || '');
            }
          }}
          className={cn(
            'g-text-slate-400 g-text-center g-flex-none g-inline-flex g-items-center g-justify-center g-min-w-11 g-min-h-11 sm:g-min-w-7 sm:g-min-h-7 -g-me-3 g-rounded g-text-2xl sm:g-text-lg',
            {
              'g-text-primary-500': value && value.length > 0,
            }
          )}
        >
          <MdAddCircle />
        </button>
      </div>
    );
  }
);
AddInput.displayName = 'AddInput';

export { AddInput };
