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
        'align-middle bg-red-100 text-red-800 text-sm font-medium mt-2 px-3 py-2 rounded dark:bg-red-900 dark:text-red-300',
        className
      )}
      {...props}
      children={children}
    />
  );
}