import { Skeleton } from '../ui/skeleton';

export function PhylogenySkeleton() {
  return (
    <div className="g-w-full">
      {Array.from({ length: 25 }).map((_, index) => (
        <Skeleton key={index} className="g-h-6 g-mt-1 g-w-full" />
      ))}
    </div>
  );
}
