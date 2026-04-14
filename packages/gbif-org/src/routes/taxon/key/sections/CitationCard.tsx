import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';
import Citation from './Citation';

type Props = {
  taxonInfo: TaxonKeyQuery['taxonInfo'];
};

function CitationContent({ taxonInfo }: Props) {
  return (
    <Card className="g-mb-4" id="citation">
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

export default function CitationCard({ taxonInfo }: Props) {
  return (
    <ErrorBoundary type="BLOCK" errorMessage={<FormattedMessage id="taxon.errors.citation" />}>
      <CitationContent taxonInfo={taxonInfo} />
    </ErrorBoundary>
  );
}
