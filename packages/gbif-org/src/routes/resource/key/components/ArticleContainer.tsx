import { cn } from '@/utils/shadcn';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function ArticleContainer({ className, children }: Props) {
  return <article className={cn('p-8 pt-16 dark:bg-slate-800 dark:text-slate-200', className)}>{children}</article>;
}
