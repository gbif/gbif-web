import { Card } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';

export function ToolCardSkeleton() {
  return (
    <PageContainer className="g-bg-slate-100 g-flex-1">
      <ArticleTextContainer className="g-pt-8 g-pb-12">
        <Card className="g-bg-white g-overflow-hidden">
          <div className="g-px-8 g-pt-7 g-pb-5 g-border-b g-border-slate-100 g-space-y-2">
            <Skeleton className="g-h-3 g-w-full" />
            <Skeleton className="g-h-3 g-w-11/12" />
            <Skeleton className="g-h-3 g-w-2/3" />
          </div>

          <div className="g-p-8 g-space-y-6">
            <div className="g-space-y-2">
              <Skeleton className="g-h-3 g-w-32" />
              <Skeleton className="g-h-9 g-w-full" />
            </div>

            <div className="g-space-y-2">
              <Skeleton className="g-h-3 g-w-40" />
              <Skeleton className="g-h-40 g-w-full" />
            </div>

            <div className="g-flex g-gap-2">
              <Skeleton className="g-h-9 g-w-24" />
              <Skeleton className="g-h-9 g-w-32" />
            </div>
          </div>
        </Card>
      </ArticleTextContainer>
    </PageContainer>
  );
}
