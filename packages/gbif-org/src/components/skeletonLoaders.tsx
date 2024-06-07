import { Skeleton } from '@/components/ui/skeleton';

// I render more skeletons than i probably need to, but it is to prevent the scrollbar from disappearing and reappearing which causes a flicker
export function CardListSkeleton() {
  return (
    <div className='g-pt-4 g-m-auto g-flex g-flex-col g-gap-4'>
      <Skeleton className='g-h-36' />
      <Skeleton className='g-h-40' />
      <Skeleton className='g-h-36' />
      <Skeleton className='g-h-40' />
      <Skeleton className='g-h-36' />
      <Skeleton className='g-h-40' />
      <Skeleton className='g-h-36' />
      <Skeleton className='g-h-40' />
    </div>
  );
}
