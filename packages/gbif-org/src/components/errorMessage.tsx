import { cn } from '@/utils/shadcn';

export function ErrorMessage({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
  props?: React.ComponentProps<'div'>;
}) {
  return (
    <div
      className={cn(
        'g-align-middle g-bg-red-100 g-text-red-800 g-text-sm g-font-medium g-mt-2 g-px-3 g-py-2 g-rounded dark:g-bg-red-900 dark:g-text-red-300',
        className
      )}
      {...props}
      children={children}
    />
  );
}
