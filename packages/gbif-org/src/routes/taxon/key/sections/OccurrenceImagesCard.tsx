import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';
import OccurrenceImages from './OccurrenceImages';

type Taxon = NonNullable<NonNullable<TaxonKeyQuery['taxonInfo']>['taxon']>;

type Props = {
  taxon: Taxon;
};

function OccurrenceImagesContent({ taxon }: Props) {
  return (
    <Card className="g-mb-4">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.occurrenceImages" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <OccurrenceImages
          results={taxon.occurrenceMedia.results}
          total={taxon.occurrenceMedia.count ?? 0}
          taxonKey={taxon.taxonID}
        />
      </CardContent>
    </Card>
  );
}

export default function OccurrenceImagesCard({ taxon }: Props) {
  return (
    <ErrorBoundary
      type="BLOCK"
      errorMessage={<FormattedMessage id="taxon.errors.occurrenceImages" />}
    >
      <OccurrenceImagesContent taxon={taxon} />
    </ErrorBoundary>
  );
}
