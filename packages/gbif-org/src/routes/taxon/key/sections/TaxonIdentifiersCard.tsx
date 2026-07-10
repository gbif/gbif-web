import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { SlowTaxonQuery } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';
import WikiDataIdentifiers, { WikidataIdentifiersSource } from './WikiDataIdentifiers';
import { CardDescription } from '@/components/ui/smallCard';

type Props = {
  slowTaxon: SlowTaxonQuery | undefined;
};

function TaxonIdentifiersContent({ slowTaxon }: Props) {
  const source = slowTaxon?.taxonInfo?.wikiData?.references;
  const id = slowTaxon?.taxonInfo?.wikiData?.taxonID;
  return (
    <Card className="g-mb-4" id="taxonIdentifiers">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.taxonIdentifiers" />
        </CardTitle>
        <CardDescription>
          {source && <WikidataIdentifiersSource url={source} id={id} />}
        </CardDescription>
      </CardHeader>
      <CardContent className="g-overflow-x-auto">
        <WikiDataIdentifiers identifiers={slowTaxon?.taxonInfo?.wikiData?.identifiers} />
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
