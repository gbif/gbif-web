import { cn } from '@/utils/shadcn';

export const backgroundColorMap: Record<string, string> = {
  white: 'bg-white',
  light: 'bg-slate-50',
  gray: 'bg-slate-100',
  black: 'bg-slate-900',
};

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function BlockContainer({ className, children }: Props) {
  return (
    <div className={cn('p-16 dark:bg-zinc-900 dark:text-slate-200 overflow-hidden', className)}>
      {children}
    </div>
  );
}
