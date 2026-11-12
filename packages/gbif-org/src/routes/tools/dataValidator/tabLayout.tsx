import { Card } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { ReactNode } from 'react';

export function ValidatorTabContainer({ children }: { children: ReactNode }) {
  return (
    <PageContainer className="g-bg-slate-100 g-flex-1">
      <ArticleTextContainer className="g-max-w-screen-xl g-pt-6 g-pb-12">
        {children}
      </ArticleTextContainer>
    </PageContainer>
  );
}

// CSS breakpoint instead of useBelow(1100) so the fallback has no layout shift on mount
export function SidebarSkeleton({ children, toc }: { children: ReactNode; toc: boolean[] }) {
  return (
    <div className="g-grid g-gap-x-4 min-[1100px]:g-grid-cols-[minmax(0,1fr)_250px] xl:g-grid-cols-[minmax(0,1fr)_300px]">
      <div className="g-min-w-0">{children}</div>
      <aside className="g-hidden min-[1100px]:g-block">
        <Card className="g-pb-2">
          <Skeleton className="g-h-4 g-w-24 g-mx-4 g-mt-3 g-mb-3" />
          {toc.map((indented, index) => (
            <div key={index} className="g-px-4 g-py-1.5">
              <Skeleton className={indented ? 'g-h-3.5 g-w-3/5 g-ms-3' : 'g-h-3.5 g-w-4/5'} />
            </div>
          ))}
        </Card>
      </aside>
    </div>
  );
}
