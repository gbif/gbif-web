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

function TaxonOccurrences({
  predicate,
  handleRedirect,
  detailsRoute,
  visibilityThreshold,
  interactive,
  ...props
}) {
  const [query, setQuery] = useState(getTaxonQuery('familyKey'));
  const [rank, setRank] = useState('FAMILY');
  const facetResults = useFacets({ predicate, query });

  if (facetResults?.data?.search?.facet?.results?.length <= visibilityThreshold) return null;

  return (
    <ChartWrapper
      {...{
        options: ['PIE', 'TABLE', 'COLUMN'],
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
                  onClick={(e) => {
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

export function Taxa(props) {
  return (
    <ChartClickWrapper {...props}>
      <TaxonOccurrences />
    </ChartClickWrapper>
  );
}

const getTaxonQuery = (rank) => `
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
