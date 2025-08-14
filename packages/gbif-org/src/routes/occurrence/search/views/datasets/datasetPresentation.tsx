import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DatasetLabel } from '@/components/filters/displayNames';
import { NoRecords } from '@/components/noDataMessages';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton, SkeletonParagraph } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/smallCard';
import { Spinner } from '@/components/ui/spinner';
import { ViewHeader } from '@/components/ViewHeader';
import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage, FormattedNumber } from 'react-intl';

export function DatasetPresentation({
  results,
  total,
  endOfRecords,
  loading,
  next,
  onSelect,
}: {
  results: any;
  total: number;
  endOfRecords: boolean;
  loading: boolean;
  next: () => void;
  onSelect: ({ key }: { key: string }) => void;
}) {
  return (
    <div className="">
      <ViewHeader total={total} loading={loading} message="counts.nDatasets" />
      {total === 0 && !loading && <NoRecords />}
      <div className="g-mb-12">
        <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
          {results.length > 0 &&
            results.map((item) => (
              <li key={item.key}>
                <DatasetResult onSelect={onSelect} item={item} largest={results[0].count} />
              </li>
            ))}
        </ul>
        {loading && (
          <>
            <DatasetSkeleton />
          </>
        )}
        {results.length > 0 && !endOfRecords && (
          <div className="">
            <Button disabled={loading} variant="outline" onClick={() => next()}>
              {loading ? <Spinner /> : <FormattedMessage id="search.loadMore" />}
            </Button>
          </div>
        )}

        <div className="g-flex-1 g-flex-grow-[1000]"></div>
      </div>
    </div>
  );
}

function DatasetResult({
  largest,
  item,
  onSelect,
}: {
  largest: number;
  item: any;
  onSelect: ({ key }: { key: string }) => void;
}) {
  return (
    <ErrorBoundary type="BLOCK" fallback={<DatasetSkeleton />}>
      <DatasetResultContent largest={largest} item={item} onSelect={onSelect} />
    </ErrorBoundary>
  );
}

function DatasetResultContent({
  largest,
  item,
  onSelect,
}: {
  largest: number;
  item: any;
  onSelect: ({ key }: { key: string }) => void;
}) {
  return (
    <Card className="g-p-4 g-mb-2 g-relative">
      <DynamicLink
        className="g-z-10 g-absolute g-top-0 g-bottom-0 g-left-0 g-right-0"
        to={`/dataset/${item.key}`}
        pageId="datasetKey"
        variables={{ key: item.key }}
        onClick={(event) => {
          if (
            event.ctrlKey ||
            event.shiftKey ||
            event.metaKey || // apple
            (event.button && event.button == 1) // middle click, >IE9 + everyone else
          ) {
            return;
          } else {
            onSelect(item);
            event.preventDefault();
          }
        }}
      ></DynamicLink>
      <div className="g-flex g-flex-nowrap g-text-sm g-z-1">
        <div className="g-flex-auto">{item?.dataset?.title ?? <DatasetLabel id={item.key} />}</div>
        <span className="g-text-slate-500">
          <FormattedNumber value={item.count} />
        </span>
      </div>
      <Progress value={(100 * item.count) / largest} className="g-h-1 g-mt-1" />

      <div className="g-mt-2 g-text-sm g-text-slate-500">
        {item.dataset ? item.dataset.excerpt : <SkeletonParagraph lines={2} />}
      </div>
    </Card>
  );
}

function DatasetSkeleton() {
  return (
    <>
      <Skeleton className="g-h-24 g-mb-2" />
      <Skeleton className="g-h-24 g-mb-2" />
      <Skeleton className="g-h-24 g-mb-2" />
      <Skeleton className="g-h-24 g-mb-2" />
      <Skeleton className="g-h-24 g-mb-2" />
      <Skeleton className="g-h-24 g-mb-2" />
      <Skeleton className="g-h-24 g-mb-2" />
    </>
  );
}
