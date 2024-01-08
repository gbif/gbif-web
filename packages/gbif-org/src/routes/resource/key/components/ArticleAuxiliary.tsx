import { cn } from '@/utils/shadcn';

type Props = {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function ArticleAuxiliary({ className, label, children }: Props) {
  return (
    <div className={cn('mt-8', className)}>
      <h3 className="font-bold mb-2 text-slate-700 dark:text-slate-400">{label}</h3>
      <div className="text-slate-500 dark:text-slate-400 text-sm">{children}</div>
    </div>
  );
}
