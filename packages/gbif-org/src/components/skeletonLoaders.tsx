import { Skeleton } from '@/components/ui/skeleton';

// I render more skeletons than i probably need to, but it is to prevent the scrollbar from disappearing and reappearing which causes a flicker
export function CardListSkeleton() {
  return (
    <div className="pt-4 m-auto flex flex-col gap-4">
      <Skeleton className="h-36" />
      <Skeleton className="h-40" />
      <Skeleton className="h-36" />
      <Skeleton className="h-40" />
      <Skeleton className="h-36" />
      <Skeleton className="h-40" />
      <Skeleton className="h-36" />
      <Skeleton className="h-40" />
    </div>
  );
}
