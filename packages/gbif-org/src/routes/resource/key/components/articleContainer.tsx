import { cn } from '@/utils/shadcn';
import { PageContainer } from './pageContainer';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function ArticleContainer({ className, children }: Props) {
  return (
    <PageContainer topPadded bottomPadded
      className={cn('g-p-4 lg:g-pt-8 lg:g-px-8 dark:g-bg-zinc-900 dark:g-text-slate-200', className)}
    >
      {children}
    </PageContainer>
  );
}
