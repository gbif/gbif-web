import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { CardDescription } from '@/components/ui/smallCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';
import Synonyms from '../Synonyms';
import { ColFeedback } from './ColFeedback';

type Props = {
  taxonInfo: TaxonKeyQuery['taxonInfo'];
};

function SynonymsContent({ taxonInfo }: Props) {
  return (
    <Card className="g-mb-4" id="synonyms">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.synonymsAndCombinations" />
        </CardTitle>
        <CardDescription>
          <ColFeedback />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Synonyms taxonInfo={taxonInfo} />
      </CardContent>
    </Card>
  );
}

export default function SynonymsCard({ taxonInfo }: Props) {
  return (
    <ErrorBoundary type="BLOCK" errorMessage={<FormattedMessage id="taxon.errors.synonyms" />}>
      <SynonymsContent taxonInfo={taxonInfo} />
    </ErrorBoundary>
  );
}
