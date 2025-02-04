import { Skeleton } from '@/components/ui/skeleton';

// I render more skeletons than i probably need to, but it is to prevent the scrollbar from disappearing and reappearing which causes a flicker
// If the list of skeletons is too short, the scroll restoration does not work properly
export function CardListSkeleton() {
  return (
    <div className="g-pt-4 g-m-auto g-flex g-flex-col g-gap-4">
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
      <Skeleton className="g-h-36" />
      <Skeleton className="g-h-40" />
    </div>
  );
}
