import { cn } from '@/utils/shadcn';
import css from './bulletList.module.css';

export function BulletList({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLUListElement>) {
  // what is the correct type here, I cannot see dd as a type
  return (
    <ul className={cn(css.bulletList, className)} {...props}>
      {children}
    </ul>
  );
}