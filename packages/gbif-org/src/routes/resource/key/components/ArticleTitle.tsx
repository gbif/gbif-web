import { cn } from '@/utils/shadcn';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function ArticleTitle({ children, className }: Props) {
  return (
    <h1
      className={cn(
        'text-2xl md:text-3xl inline-block sm:text-4xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200',
        className
      )}
    >
      {children}
    </h1>
  );
}
