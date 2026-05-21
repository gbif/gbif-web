import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  className?: string;
  style?: React.CSSProperties;
  height?: number;
};

export function ChartSkeleton({ className, style, height = 220 }: Props) {
  return (
    <div className="g-px-4 g-pb-4 g-flex g-items-end g-gap-2 g-w-full" style={{ height }}>
      <Skeleton className="g-flex-1" style={{ height: '75%' }} />
      <Skeleton className="g-flex-1" style={{ height: '100%' }} />
      <Skeleton className="g-flex-1" style={{ height: '55%' }} />
      <Skeleton className="g-flex-1" style={{ height: '85%' }} />
      <Skeleton className="g-flex-1" style={{ height: '40%' }} />
    </div>
  );
}
