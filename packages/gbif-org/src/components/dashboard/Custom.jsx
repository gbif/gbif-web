import { useState } from 'react';
import { GroupBy, Pagging, useFacets } from './charts/GroupByTable';
import { CardHeader } from './shared';
// import { Classification, DropdownButton, Tooltip } from '../../components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { DynamicLink } from '@/reactRouterPlugins';
import { tryParse } from '@/utils/querystring';
import { MdLink, MdMoreHoriz } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Classification } from '../classification';
import { SimpleTooltip } from '../simpleTooltip';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '../ui/smallCard';
import ChartClickWrapper from './charts/ChartClickWrapper';

const majorRanks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
const getDefaultRank = (rank) => {
  return majorRanks.includes(rank) ? rank : 'family';
};
function TaxaMain({
  defaultRank,
  predicate,
  handleRedirect,
  detailsRoute,
  visibilityThreshold,
  interactive,
  ...props
}) {
  const [query, setQuery] = useState(getTaxonQuery(`${getDefaultRank(defaultRank)}Key`));
  const [rank, setRank] = useState(getDefaultRank(defaultRank).toUpperCase());
  const facetResults = useFacets({ predicate, query });

  if (facetResults?.data?.search?.facet?.results?.length <= visibilityThreshold) return null;

  return (
    <Card
      {...props}
      loading={facetResults.loading || !facetResults.data}
      error={!!facetResults.error}
    >
      <CardHeader
        options={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MdMoreHoriz />
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
                    id={`enums.taxonRank.${rank.toUpperCase()}`}
                    defaultMessage={rank}
                  />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <CardTitle>
          <FormattedMessage id={`enums.taxonRank.${rank.toUpperCase()}`} defaultMessage={rank} />
        </CardTitle>
        <CardDescription>
          <FormattedMessage id="dashboard.numberOfOccurrences" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GroupBy
          {...{
            facetResults,
            interactive,
            onClick: handleRedirect,
            transform: (data) => {
              return data?.search?.facet?.results?.map((x) => {
                return {
                  key: x?.key,
                  title: (
                    <span>
                      {x?.entity?.title}{' '}
                      <DynamicLink
                        pageId="speciesKey"
                        variables={{ key: x?.key.toString() }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MdLink />
                      </DynamicLink>
                    </span>
                  ),
                  count: x.count,
                  filter: { taxonKey: [tryParse(x.key)] },
                  description: (
                    <Classification>
                      {majorRanks.map((rank) => {
                        if (!x?.entity?.[rank]) return null;
                        return <span key={rank}>{x?.entity?.[rank]}</span>;
                      })}
                    </Classification>
                  ),
                };
              });
            },
          }}
        />
        <Pagging facetResults={facetResults} />
      </CardContent>
    </Card>
  );
}

export function Taxa(props) {
  return (
    <ChartClickWrapper {...props}>
      <TaxaMain />
    </ChartClickWrapper>
  );
}

const getTaxonQuery = (rank) => `
query summary($predicate: Predicate, $size: Int, $from: Int){
  search: occurrenceSearch(predicate: $predicate) {
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

function IucnMain({
  predicate,
  handleRedirect,
  visibilityThreshold,
  detailsRoute,
  interactive,
  ...props
}) {
  const facetResults = useFacets({
    predicate: {
      type: 'and',
      predicates: [
        predicate,
        {
          type: 'in',
          key: 'iucnRedListCategory',
          values: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT'],
        },
      ],
    },
    query: IUCN_FACETS,
  });
  const resultCount = facetResults?.data?.search?.facet?.results?.length;
  if (resultCount <= visibilityThreshold) return null;

  return (
    <Card
      {...props}
      loading={facetResults.loading || !facetResults.data}
      error={!!facetResults.error}
    >
      <CardHeader>
        <CardTitle>
          <FormattedMessage id={`dashboard.iucnThreatStatus`} />
        </CardTitle>
        <CardDescription>
          <FormattedMessage id={'dashboard.iucnThreatStatusDescription'} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {resultCount === 0 && <FormattedMessage id="dashboard.noData" defaultMessage="No data" />}
        <GroupBy
          {...{
            facetResults,
            interactive,
            onClick: handleRedirect,
            transform: (data) => {
              return data?.search?.facet?.results?.map((x) => {
                return {
                  key: x.key,
                  title: (
                    <div>
                      <IucnCategory
                        code={x?.entity?.iucnRedListCategory?.code}
                        category={x?.entity?.iucnRedListCategory?.category}
                      />
                      {x?.entity?.title}
                    </div>
                  ),
                  count: x.count,
                  filter: { taxonKey: [x.key] },
                  description: (
                    <Classification>
                      {['kingdom', 'phylum', 'class', 'order', 'family', 'genus'].map((rank) => {
                        if (!x?.entity?.[rank]) return null;
                        return <span key={rank}>{x?.entity?.[rank]}</span>;
                      })}
                    </Classification>
                  ),
                };
              });
            },
          }}
        />
        <Pagging facetResults={facetResults} />
      </CardContent>
    </Card>
  );
}
const IUCN_FACETS = `
query summary($predicate: Predicate, $size: Int, $from: Int){
  search: occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: speciesKey
    }
    facet {
      results: speciesKey(size: $size, from: $from) {
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
          iucnRedListCategory {
            category
            code
          }
        }
      }
    }
  }
}
`;
export function Iucn(props) {
  return (
    <ChartClickWrapper {...props}>
      <IucnMain />
    </ChartClickWrapper>
  );
}

function IucnCategory({ code, category }) {
  return (
    <SimpleTooltip i18nKey={`enums.threatStatus.${category}`}>
      <span className="g-bg-[#7a443a] g-text-white g-px-1 g-py-0.5 g-text-xs g-font-bold g-rounded-md g-mr-2">
        {code}
      </span>
    </SimpleTooltip>
  );
}
