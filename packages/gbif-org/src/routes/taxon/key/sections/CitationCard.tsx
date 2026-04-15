import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import Citation from './Citation';

type Props = {
  taxonInfo: TaxonKeyQuery['taxonInfo'];
  className?: string;
};

function CitationContent({ taxonInfo, className }: Props) {
  return (
    <Card className={cn('g-mb-4', className)} id="citation">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="phrases.citation" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Citation taxonInfo={taxonInfo} />
      </CardContent>
    </Card>
  );
}

export default function CitationCard({ taxonInfo, className }: Props) {
  return (
    <ErrorBoundary type="BLOCK" errorMessage={<FormattedMessage id="taxon.errors.citation" />}>
      <CitationContent taxonInfo={taxonInfo} className={className} />
    </ErrorBoundary>
  );
}
