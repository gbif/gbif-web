import { cn } from '@/utils/shadcn';

type CalloutProps = {
  children?: React.ReactNode;
  className?: string;
};

export const Callout = ({ children, className }: CalloutProps) => {
  return (
    <div
      className={cn(
        'g-border g-border-gray-300 g-border-l-4 g-border-l-gray-600 g-p-4 g-bg-gray-100',
        className
      )}
    >
      {children}
    </div>
  );
};

type CalloutTitleProps = {
  children?: React.ReactNode;
  className?: string;
};

Callout.Title = ({ children, className }: CalloutTitleProps) => {
  return (
    <h4 className={cn('g-text-sm g-font-semibold g-text-gray-700 g-pb-2', className)}>
      {children}
    </h4>
  );
};

type CalloutDescriptionProps = {
  children?: React.ReactNode;
  className?: string;
};

Callout.Description = ({ children, className }: CalloutDescriptionProps) => {
  return <div className={cn('g-text-sm g-text-gray-700', className)}>{children}</div>;
};
