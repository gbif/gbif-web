import { cn } from '@/utils/shadcn';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function ResultCardContent({ className, children }: Props) {
  return (
    <div
      className={cn(
        'g-font-normal g-text-slate-600 g-text-sm g-flex-auto g-flex g-flex-col g-justify-between',
        className
      )}
    >
      {children}
    </div>
  );
}
