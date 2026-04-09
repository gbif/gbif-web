import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { CardDescription } from '@/components/ui/smallCard';
import { FormattedMessage } from 'react-intl';
import { TaxonTree } from '../../search/views/tree';
import { ColFeedback } from './ColFeedback';

type Props = {
  datasetKey: string;
  taxonKey: string | number;
};

export default function ClassificationCard({ datasetKey, taxonKey }: Props) {
  return (
    <ErrorBoundary
      type="BLOCK"
      errorMessage={<FormattedMessage id="taxon.errors.classification" />}
    >
      <Card className="g-mb-4">
        <CardHeader>
          <CardTitle>Classification and descendants</CardTitle>
          <CardDescription>
            <ColFeedback />
          </CardDescription>
        </CardHeader>
        <CardContent className="g-overflow-auto g-text-[15px]/4">
          <TaxonTree datasetKey={datasetKey} taxonKey={taxonKey} />
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}
