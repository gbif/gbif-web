import { Card, CardContent, CardHeader } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ReactNode } from 'react';
import { SidebarSkeleton, ValidatorTabContainer } from '../tabLayout';

export function MetadataPageSkeleton() {
  return (
    <ValidatorTabContainer>
      <MetadataSkeleton />
    </ValidatorTabContainer>
  );
}

export function MetadataSkeleton() {
  return (
    <div aria-busy="true">
      <SidebarSkeleton toc={[false, false, false, false, false, false]}>
        <SectionSkeleton titleWidth="g-w-16">
          <Skeleton className="g-h-6 g-w-3/4" />
        </SectionSkeleton>

        <SectionSkeleton titleWidth="g-w-32">
          <ProseSkeleton widths={['g-w-full', 'g-w-full', 'g-w-11/12', 'g-w-full', 'g-w-3/5']} />
        </SectionSkeleton>

        <SectionSkeleton titleWidth="g-w-24">
          <ProseSkeleton widths={['g-w-full', 'g-w-5/6', 'g-w-2/5']} />
        </SectionSkeleton>

        <SectionSkeleton titleWidth="g-w-44">
          <div className="g-grid g-grid-cols-[auto_1fr] g-gap-x-4 g-gap-y-2">
            <Skeleton className="g-h-4 g-w-20" />
            <Skeleton className="g-h-4 g-w-48" />
            <Skeleton className="g-h-4 g-w-20" />
            <Skeleton className="g-h-4 g-w-40" />
          </div>
        </SectionSkeleton>

        <SectionSkeleton titleWidth="g-w-28">
          <div className="g-grid sm:g-grid-cols-2 g-gap-6">
            <ContactSkeleton />
            <ContactSkeleton />
          </div>
        </SectionSkeleton>
      </SidebarSkeleton>
    </div>
  );
}

function SectionSkeleton({ titleWidth, children }: { titleWidth: string; children: ReactNode }) {
  return (
    <Card className="g-mb-4">
      <CardHeader>
        <Skeleton className={`g-h-6 ${titleWidth}`} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ProseSkeleton({ widths }: { widths: string[] }) {
  return (
    <div className="g-space-y-2">
      {widths.map((width, index) => (
        <Skeleton key={index} className={`g-h-4 ${width}`} />
      ))}
    </div>
  );
}

function ContactSkeleton() {
  return (
    <div className="g-space-y-2">
      <Skeleton className="g-h-5 g-w-40" />
      <Skeleton className="g-h-4 g-w-28" />
      <Skeleton className="g-h-4 g-w-48" />
    </div>
  );
}
