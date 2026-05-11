import { cn } from '@/utils/shadcn';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function ArticleTextContainer({ children, className }: Props) {
  return <div className={cn('g-max-w-3xl g-m-auto', className)}>{children}</div>;
}
