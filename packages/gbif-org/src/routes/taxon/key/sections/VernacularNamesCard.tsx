import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { CardDescription } from '@/components/ui/smallCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import { VernacularNameTable } from './VernacularNameTable';
import { ColFeedback } from './ColFeedback';

type Props = {
  taxonInfo: TaxonKeyQuery['taxonInfo'];
  className?: string;
};

export default function VernacularNamesCard({ taxonInfo, className }: Props) {
  if (taxonInfo?.vernacularNames?.length === 0) return null;
  return (
    <ErrorBoundary
      type="BLOCK"
      errorMessage={<FormattedMessage id="taxon.errors.vernacularNames" />}
    >
      <Card className={cn('g-mb-4', className)} id="vernacularNames">
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="taxon.vernacularNames" />
          </CardTitle>
          <CardDescription>
            <ColFeedback />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VernacularNameTable vernacularNames={taxonInfo?.vernacularNames ?? []} />
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}
