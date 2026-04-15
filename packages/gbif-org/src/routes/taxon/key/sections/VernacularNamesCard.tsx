import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { CardDescription } from '@/components/ui/smallCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';
import { VernacularNameTable } from './VernacularNameTable';
import { ColFeedback } from './ColFeedback';

type Props = {
  taxonInfo: TaxonKeyQuery['taxonInfo'];
};

function VernacularNamesContent({ taxonInfo }: Props) {
  if (taxonInfo?.vernacularNames?.length === 0) return null;

  return (
    <Card className="g-mb-4" id="vernacularNames">
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
  );
}

export default function VernacularNamesCard({ taxonInfo }: Props) {
  return (
    <ErrorBoundary
      type="BLOCK"
      errorMessage={<FormattedMessage id="taxon.errors.vernacularNames" />}
    >
      <VernacularNamesContent taxonInfo={taxonInfo} />
    </ErrorBoundary>
  );
}
