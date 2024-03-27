import { cn } from '@/utils/shadcn';
import styles from './classification.module.css';

export function Classification({
  as: Div = 'div',
  className,
  children,
  ...props
}: {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<'div'>) {
  return (
    <Div className={cn(styles.classification, className)} {...props}>
      {children}
    </Div>
  );
}
