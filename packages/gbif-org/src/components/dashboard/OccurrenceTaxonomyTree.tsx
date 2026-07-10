import { Card, CardContent, CardTitle } from '@/components/ui/smallCard';
import { Predicate } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';
import { TaxonomicTree } from '../taxonomicTree';
import { CardHeader } from './shared';

export function OccurrenceTaxonomyTree({
  predicate,
  q,
  checklistKey,
}: {
  predicate?: Predicate;
  q?: string;
  checklistKey?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="dashboard.taxonomicTree" defaultMessage="Taxonomic tree" />
        </CardTitle>
      </CardHeader>
      <CardContent className="g-overflow-auto gbif-small-scrollbar">
        <TaxonomicTree
          predicate={predicate}
          q={q}
          checklistKey={checklistKey}
          className="g-text-sm"
        />
      </CardContent>
    </Card>
  );
}
