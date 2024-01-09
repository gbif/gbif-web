import { cn } from '@/utils/shadcn';

type Props = {
  children: React.ReactNode;
  secondary?: React.ReactNode;
  className?: string;
};

export function ArticlePreTitle({ secondary, children, className }: Props) {
  return (
    <p
      className={cn(
        'mb-2 text-sm leading-6 font-semibold text-primary-500 dark:text-primary-400',
        className
      )}
    >
      {children} {secondary && <span className="text-slate-500 font-normal ml-2">{secondary}</span>}
    </p>
  );
}
