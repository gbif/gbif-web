import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { CardDescription } from '@/components/ui/smallCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import Synonyms from './Synonyms';
import { ColFeedback } from './ColFeedback';

type Props = {
  taxonInfo: TaxonKeyQuery['taxonInfo'];
  className?: string;
};

export default function SynonymsCard({ taxonInfo, className }: Props) {
  return (
    <ErrorBoundary type="BLOCK" errorMessage={<FormattedMessage id="taxon.errors.synonyms" />}>
      <Card className={cn('g-mb-4', className)} id="synonyms">
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
    </ErrorBoundary>
  );
}
