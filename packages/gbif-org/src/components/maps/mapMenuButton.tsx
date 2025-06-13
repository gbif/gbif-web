import React from 'react';
import { Button, ButtonProps } from '../ui/button';
import { cn } from '@/utils/shadcn';
import { Spinner } from '../ui/spinner';

interface MenuButtonProps extends Omit<ButtonProps, 'variant' | 'className'> {
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const MapMenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ children, loading, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        className={cn(
          'g-p-2 g-flex-auto g-text-xl g-text-slate-800 g-whitespace-nowrap',
          className
        )}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </Button>
    );
  }
);

MapMenuButton.displayName = 'MapMenuButton';
