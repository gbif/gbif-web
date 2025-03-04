import { cn } from '@/utils/shadcn';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function ResultCardMetadata({ className, children }: Props) {
  return (
    <div className={cn('g-font-normal g-text-slate-500 g-text-sm g-mt-2', className)}>
      {children}
    </div>
  );
}
