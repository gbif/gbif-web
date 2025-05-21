import * as React from 'react';

import { cn } from '@/utils/shadcn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'g-flex g-min-h-[60px] g-w-full g-rounded-md g-border g-border-solid g-border-input g-bg-transparent g-px-3 g-py-2 g-text-sm g-shadow-sm placeholder:g-text-muted-foreground focus-visible:g-outline-none focus-visible:g-ring-1 focus-visible:g-ring-ring disabled:g-cursor-not-allowed disabled:g-opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
