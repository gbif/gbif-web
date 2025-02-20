import { cn } from '@/utils/shadcn';

export function BulletList({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLUListElement>) {
  // what is the correct type here, I cannot see dd as a type
  return (
    <ul className={cn('gbif-bulletList', className)} {...props}>
      {children}
    </ul>
  );
}
