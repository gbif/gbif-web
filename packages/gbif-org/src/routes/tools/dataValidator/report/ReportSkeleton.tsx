import { Card, CardContent, CardHeader } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarSkeleton, ValidatorTabContainer } from '../tabLayout';

const SUMMARY_ROWS = [
  ['g-w-24', 'g-w-28'],
  ['g-w-20', 'g-w-36'],
  ['g-w-28', 'g-w-24'],
];
const TERM_BARS = ['g-w-11/12', 'g-w-4/5', 'g-w-3/5', 'g-w-2/5', 'g-w-1/4'];
const STEPS = ['g-w-28', 'g-w-36', 'g-w-32', 'g-w-40'];

export function ReportPageSkeleton() {
  return (
    <ValidatorTabContainer>
      <ReportSkeleton />
    </ValidatorTabContainer>
  );
}

// withSteps=false when the real steps are already rendered above
export function ReportSkeleton({ withSteps = true }: { withSteps?: boolean }) {
  return (
    <div aria-busy="true">
      {withSteps && <StepsSkeleton />}
      <SummarySkeleton />
      <SidebarSkeleton toc={[false, true, true, false, true, true]}>
        <FileSectionSkeleton />
        <FileSectionSkeleton />
      </SidebarSkeleton>
    </div>
  );
}

function StepsSkeleton() {
  return (
    <ol className="g-flex g-flex-col g-list-none g-p-0 g-m-0 g-mb-6 g-mt-2 md:g-flex-row">
      {STEPS.map((width, index) => (
        <li
          key={index}
          className="g-relative g-flex g-min-w-0 g-gap-3 g-pb-5 last:g-pb-0 md:g-flex-1 md:g-flex-col md:g-items-center md:g-gap-2 md:g-pb-0"
        >
          {index < STEPS.length - 1 && (
            <span className="g-absolute g-start-[11px] g-top-6 g-bottom-0 g-w-0.5 g-bg-slate-200 md:g-start-1/2 md:g-top-[11px] md:g-bottom-auto md:g-h-0.5 md:g-w-full" />
          )}
          <span className="g-relative g-flex-none g-rounded-full g-bg-white">
            <Skeleton className="g-h-6 g-w-6 g-rounded-full" />
          </span>
          <span className="g-pt-0.5 md:g-pt-0">
            <span className="g-flex g-h-5 g-items-center">
              <Skeleton className={`g-h-4 ${width}`} />
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function SummarySkeleton() {
  return (
    <Card className="g-mb-4">
      <CardHeader>
        <Skeleton className="g-h-6 g-w-56" />
      </CardHeader>
      <CardContent>
        <div className="g-grid md:g-grid-cols-[minmax(0,2fr)_minmax(0,1fr)] g-gap-6">
          <div>
            <div className="g-flex g-h-7 g-items-center g-gap-2 g-mb-3">
              <Skeleton className="g-h-3 g-w-3 g-rounded-full" />
              <Skeleton className="g-h-5 g-w-72 g-max-w-full" />
            </div>
            {SUMMARY_ROWS.map(([label, tag], index) => (
              <div key={index} className="g-flex g-border-t g-border-slate-100 g-py-2">
                <div className="g-w-1/3 g-pe-4">
                  <Skeleton className={`g-h-4 ${label}`} />
                </div>
                <div className="g-flex g-flex-wrap g-gap-1">
                  <Skeleton className={`g-h-5 g-rounded-full ${tag}`} />
                  {index !== 1 && <Skeleton className="g-h-5 g-w-20 g-rounded-full" />}
                </div>
              </div>
            ))}
          </div>
          <SummaryFactsSkeleton />
        </div>
        <Skeleton className="g-h-3 g-w-96 g-max-w-full g-mt-6" />
      </CardContent>
    </Card>
  );
}

const SUMMARY_FACTS = [
  ['g-w-16', 'g-w-40'],
  ['g-w-20', 'g-w-36'],
  ['g-w-14', 'g-w-12'],
  ['g-w-24', 'g-w-32'],
  ['g-w-20', 'g-w-4'],
];

function SummaryFactsSkeleton() {
  return (
    <dl className="g-grid g-grid-cols-[auto_1fr] g-gap-x-4 g-gap-y-1 g-text-sm g-content-start">
      {SUMMARY_FACTS.map(([label, value], index) => (
        <div key={index} className="g-contents">
          <dt className="g-flex g-h-5 g-items-center">
            <Skeleton className={`g-h-3.5 ${label}`} />
          </dt>
          <dd className="g-flex g-h-5 g-items-center">
            <Skeleton className={`g-h-3.5 g-max-w-full ${value}`} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function FactsSkeleton({ rows }: { rows: number }) {
  return (
    <div className="g-grid g-grid-cols-[auto_1fr] g-gap-x-4 g-gap-y-2 g-content-start">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="g-contents">
          <Skeleton className="g-h-4 g-w-24" />
          <Skeleton className={`g-h-4 ${index % 2 ? 'g-w-16' : 'g-w-32'}`} />
        </div>
      ))}
    </div>
  );
}

function FileSectionSkeleton() {
  return (
    <Card className="g-mb-4">
      <CardHeader>
        <Skeleton className="g-h-6 g-w-48" />
      </CardHeader>
      <CardContent className="g-space-y-6">
        <FactsSkeleton rows={3} />

        <section>
          <Skeleton className="g-h-5 g-w-36 g-mb-3" />
          <div className="g-space-y-2">
            {TERM_BARS.map((width, index) => (
              <div key={index} className="g-grid g-grid-cols-[8rem_1fr] g-items-center g-gap-4">
                <Skeleton className="g-h-4 g-w-full" />
                <Skeleton className={`g-h-4 ${width}`} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <Skeleton className="g-h-5 g-w-40 g-mb-3" />
          <div className="g-space-y-2">
            <Skeleton className="g-h-10 g-w-full" />
            <Skeleton className="g-h-10 g-w-full" />
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
