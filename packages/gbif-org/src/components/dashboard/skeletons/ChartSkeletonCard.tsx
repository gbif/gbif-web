import { Card } from '@/components/ui/smallCard';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/shadcn';

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export default function ChartSkeletonCard({ className, style, children }: Props) {
  return (
    <Card className={cn('g-overflow-hidden', className)} style={style}>
      <div className="g-px-4 g-pt-4 g-pb-4 g-space-y-2">
        <Skeleton className="g-h-4 g-w-2/3" />
        <Skeleton className="g-h-3 g-w-1/3" />
      </div>
      <div className="g-px-4 g-pb-4 g-flex g-items-center g-justify-center">{children}</div>
    </Card>
  );
}
