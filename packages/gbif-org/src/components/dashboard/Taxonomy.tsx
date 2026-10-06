import { useState } from 'react';
import { useFacets } from './charts/GroupByTable';
// import { Classification, DropdownButton, Tooltip } from '../../components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { FormattedMessage } from 'react-intl';
import { Button } from '../ui/button';
import ChartClickWrapper from './charts/ChartClickWrapper';
import { ChartWrapper } from './charts/EnumChartGenerator';
const majorRanks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];

type TaxonOccurrencesProps = {
  predicate?: Record<string, unknown>;
  handleRedirect?: (args: { filter?: Record<string, unknown> }) => void;
  detailsRoute?: string;
  visibilityThreshold?: number;
  interactive?: boolean;
  [key: string]: unknown;
};

function TaxonOccurrences({
  predicate,
  handleRedirect: _handleRedirect,
  detailsRoute,
  visibilityThreshold,
  interactive: _interactive,
  ...props
}: TaxonOccurrencesProps) {
  const [query, setQuery] = useState(getTaxonQuery('familyKey'));
  const [rank, setRank] = useState('FAMILY');
  const facetResults = useFacets({ predicate, query });

  const results = facetResults?.data?.search?.facet?.results;
  if (
    Array.isArray(results) &&
    visibilityThreshold !== undefined &&
    results.length <= visibilityThreshold
  )
    return null;

  return (
    <ChartWrapper
      {...{
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
        title: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FormattedMessage
                  id={`taxon.rankPlural.${rank.toUpperCase()}`}
                  defaultMessage={rank}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {majorRanks.map((rank) => (
                <DropdownMenuItem
                  key={rank}
                  onClick={() => {
                    setRank(rank);
                    setQuery(getTaxonQuery(`${rank}Key`));
                  }}
                >
                  <FormattedMessage
                    id={`taxon.rankPlural.${rank.toUpperCase()}`}
                    defaultMessage={rank}
                  />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        subtitleKey: 'dashboard.numberOfOccurrences',
        predicate,
        detailsRoute,
        gqlQuery: query,
        disableUnknown: true,
        predicateKey: query,
        facetSize: 10,
        ...props,
      }}
    />
  );
}

export function Taxa(props: Record<string, unknown>) {
  return (
    <ChartClickWrapper {...props}>
      <TaxonOccurrences />
    </ChartClickWrapper>
  );
}

const getTaxonQuery = (rank: string) => `
query summary($q: String, $predicate: Predicate, $size: Int, $from: Int){
  search: occurrenceSearch(q: $q, predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: ${rank}
    }
    facet {
      results: ${rank}(size: $size, from: $from) {
        key
        count
        entity: taxon {
          title: scientificName
          kingdom
          phylum
          class
          order
          family
          genus
        }
      }
    }
  }
}
`;
