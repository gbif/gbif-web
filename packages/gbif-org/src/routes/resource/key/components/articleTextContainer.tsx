import { cn } from '@/utils/shadcn';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function ArticleTextContainer({ children, className }: Props) {
  return <div className={cn('max-w-3xl m-auto', className)}>{children}</div>;
}
