import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { SlowTaxonQuery } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';
import WikiDataIdentifiers from '../WikiDataIdentifiers';

type Props = {
  slowTaxon: SlowTaxonQuery | undefined;
};

function TaxonIdentifiersContent({ slowTaxon }: Props) {
  return (
    <Card className="g-mb-4" id="taxonIdentifiers">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.taxonIdentifiers" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WikiDataIdentifiers
          source={slowTaxon?.taxonInfo?.taxon?.wikiData?.source}
          identifiers={slowTaxon?.taxonInfo?.taxon?.wikiData?.identifiers}
        />
      </CardContent>
    </Card>
  );
}

export default function TaxonIdentifiersCard({ slowTaxon }: Props) {
  return (
    <ErrorBoundary type="BLOCK" errorMessage={<FormattedMessage id="taxon.errors.wikidata" />}>
      <TaxonIdentifiersContent slowTaxon={slowTaxon} />
    </ErrorBoundary>
  );
}
