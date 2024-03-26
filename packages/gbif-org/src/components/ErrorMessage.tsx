import { cn } from '@/utils/shadcn';

export function ErrorMessage({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode; // TODO: daniel - how to make typescript accept this. I just want to pass children on to the object. Do I really have to explicitly model children as I've done here?
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