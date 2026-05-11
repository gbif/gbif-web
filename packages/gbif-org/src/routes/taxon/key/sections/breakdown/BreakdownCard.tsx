import SunburstSkeleton from '@/components/dashboard/skeletons/SunburstSkeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { CardDescription } from '@/components/ui/smallCard';
import { cn } from '@/utils/shadcn';
import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';

const BreakdownContent = React.lazy(() => import('./BreakdownContent'));

type Props = {
  taxonKey: string;
  datasetKey: string;
  className?: string;
};

export default function BreakdownCard({ taxonKey, datasetKey, className }: Props) {
  return (
    <ErrorBoundary
      type="BLOCK"
      errorMessage={
        <FormattedMessage id="taxon.errors.breakdown" defaultMessage="Failed to load breakdown" />
      }
    >
      <Card className={cn('g-mb-4', className)} id="breakdown">
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="taxon.largestGroups" defaultMessage="Largest Groups" />
          </CardTitle>
          <CardDescription>
            <FormattedMessage
              id="taxon.largestGroupsDescription"
              defaultMessage="Major groups per number of species"
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<SunburstSkeleton />}>
            <BreakdownContent taxonKey={taxonKey} datasetKey={datasetKey} />
          </Suspense>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}
