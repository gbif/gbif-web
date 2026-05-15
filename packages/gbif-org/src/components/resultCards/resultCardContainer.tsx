import { cn } from '@/utils/shadcn';

type Props = {
  className?: string;
  children: React.ReactNode;
  dir?: 'ltr' | 'rtl';
};

export function ResultCardContainer({ className, dir, children }: Props) {
  return (
    <article
      dir={dir ?? 'ltr'}
      className={cn('g-bg-slate-50 g-p-4 g-rounded g-border g-border-solid g-mb-4', className)}
    >
      {children}
    </article>
  );
}
