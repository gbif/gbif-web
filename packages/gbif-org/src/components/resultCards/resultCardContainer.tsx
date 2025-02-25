import { cn } from '@/utils/shadcn';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function ResultCardContainer({ className, children }: Props) {
  return (
    <article className={cn('g-bg-slate-50 g-p-4 g-rounded g-border g-mb-4', className)}>
      {children}
    </article>
  );
}
