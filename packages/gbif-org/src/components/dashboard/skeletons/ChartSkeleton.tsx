import { Skeleton } from '@/components/ui/skeleton';
import ChartSkeletonCard from './ChartSkeletonCard';

type Props = {
  className?: string;
  style?: React.CSSProperties;
  height?: number;
};

export function ChartSkeleton({ className, style, height = 220 }: Props) {
  return (
    <ChartSkeletonCard className={className} style={style}>
      <div className="g-px-4 g-pb-4 g-flex g-items-end g-gap-2" style={{ height }}>
        <Skeleton className="g-flex-1" style={{ height: '75%' }} />
        <Skeleton className="g-flex-1" style={{ height: '100%' }} />
        <Skeleton className="g-flex-1" style={{ height: '55%' }} />
        <Skeleton className="g-flex-1" style={{ height: '85%' }} />
        <Skeleton className="g-flex-1" style={{ height: '40%' }} />
      </div>
    </ChartSkeletonCard>
  );
}
