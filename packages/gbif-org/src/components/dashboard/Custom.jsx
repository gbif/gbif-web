// @ts-nocheck
import { useEffect, useState } from 'react';
import { GroupBy, Pagging, useFacets } from './charts/GroupByTable';
import { CardHeader } from './shared';
// import { Classification, DropdownButton, Tooltip } from '../../components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import { DynamicLink } from '@/reactRouterPlugins';
import formatAsPercentage from '@/utils/formatAsPercentage';
import { tryParse } from '@/utils/querystring';
import { MdLink, MdMoreHoriz } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Classification } from '../classification';
import { SimpleTooltip } from '../simpleTooltip';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '../ui/smallCard';
import ChartClickWrapper from './charts/ChartClickWrapper';
import { ChartMessages } from './charts/OneDimensionalChart';

const majorRanks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
const getDefaultRank = (rank) => {
  return majorRanks.includes(rank) ? rank : 'family';
};
function TaxaMain({
  defaultRank,
  predicate,
  checklistKey,
  q,
  handleRedirect,
  detailsRoute,
  visibilityThreshold,
  interactive,
  ...props
}) {
  const defaultChecklistKey = useChecklistKey();
  const [query, setQuery] = useState(getTaxonQuery(`${getDefaultRank(defaultRank)}Key`));
  const [rank, setRank] = useState(getDefaultRank(defaultRank).toUpperCase());
  const hasPredicates = [
    {
      type: 'isNotNull',
      key: 'taxonKey',
      checklistKey: checklistKey ?? defaultChecklistKey,
    },
  ];
  if (predicate) {
    hasPredicates.push(predicate);
  }
  const facetResults = useFacets({
    predicate,
    otherVariables: {
      q,
      checklistKey: checklistKey ?? defaultChecklistKey,
      hasPredicate: {
        type: 'and',
        predicates: hasPredicates,
      },
    },
    query,
  });

  useEffect(() => {
    setRank(getDefaultRank(defaultRank).toUpperCase());
    setQuery(getTaxonQuery(`${getDefaultRank(defaultRank)}Key`));
  }, [defaultRank]);
  if (facetResults?.data?.search?.facet?.results?.length <= visibilityThreshold) return null;

  const filledPercentage =
    facetResults?.data?.isNotNull?.documents?.total / facetResults?.data?.search?.documents?.total;

  let messages = [];
  messages.push(
    <div>
      <FormattedMessage
        id="dashboard.percentWithValue"
        values={{ percent: formatAsPercentage(filledPercentage) }}
      />
    </div>
  );

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
                      {x?.entity?.usage.name}{' '}
                      <DynamicLink
                        pageId="speciesKey"
                        variables={{ key: x?.key.toString(), checklistKey: x.entity.checklistKey }}
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
                    <Classification className="g-text-xs g-text-slate-600">
                      {x?.entity?.classification?.map((rank) => {
                        return (
                          <span key={rank.key}>
                            <span className="g-me-2">
                              <FormattedMessage
                                id={`enums.taxonRank.${rank.rank.toUpperCase()}`}
                                defaultMessage={
                                  rank.rank.charAt(0).toUpperCase() +
                                  rank.rank.slice(1).toLowerCase()
                                }
                              />
                            </span>
                            {rank.name}
                          </span>
                        );
                      })}
                    </Classification>
                  ),
                };
              });
            },
          }}
        />
        <Pagging facetResults={facetResults} />
        <ChartMessages messages={messages} />
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
query summary($q: String, $predicate: Predicate, $hasPredicate: Predicate, $size: Int, $from: Int, $checklistKey: ID){
  search: occurrenceSearch(q: $q, predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: ${rank}(checklistKey: $checklistKey)
    }
    facet {
      results: ${rank}(size: $size, from: $from, checklistKey: $checklistKey) {
        key
        count
        entity: taxonMatch(checklistKey: $checklistKey) {
          usage {
            name
          }
          classification {
            name
            key
            rank
          }
          iucnStatus
          iucnStatusCode
        }
      }
    }
  }
  isNotNull: occurrenceSearch(q: $q, predicate: $hasPredicate) {
    documents(size: 0) {
      total
    }
  }
}
`;

function IucnMain({
  predicate,
  checklistKey,
  q,
  handleRedirect,
  visibilityThreshold,
  detailsRoute,
  interactive,
  ...props
}) {
  const defaultChecklistKey = useChecklistKey();
  const facetResults = useFacets({
    otherVariables: { q, checklistKey: checklistKey ?? defaultChecklistKey },
    predicate: {
      type: 'and',
      predicates: [
        predicate || {},
        {
          type: 'in',
          key: 'iucnRedListCategory',
          checklistKey: checklistKey ?? defaultChecklistKey,
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
                        code={x?.entity?.iucnStatusCode}
                        category={x?.entity?.iucnStatus}
                      />
                      {x?.entity?.usage.canonicalName}
                    </div>
                  ),
                  count: x.count,
                  filter: { taxonKey: [x.key] },
                  description: (
                    <Classification className="g-text-xs g-text-slate-500">
                      {x?.entity?.classification?.map((rank) => {
                        return (
                          <span key={rank.key}>
                            <span className="g-me-2">
                              <FormattedMessage
                                id={`enums.taxonRank.${rank.rank.toUpperCase()}`}
                                defaultMessage={
                                  rank.rank.charAt(0).toUpperCase() +
                                  rank.rank.slice(1).toLowerCase()
                                }
                              />
                            </span>
                            {rank.name}
                          </span>
                        );
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
query summary($q: String, $predicate: Predicate, $size: Int, $from: Int, $checklistKey: ID){
  search: occurrenceSearch(q: $q, predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: speciesKey(checklistKey: $checklistKey)
    }
    facet {
      results: speciesKey(size: $size, from: $from, checklistKey: $checklistKey) {
        key
        count
        entity: taxonMatch(checklistKey: $checklistKey) {
          usage {
            name
            canonicalName
          }
          classification {
            name
            key
            rank
          }
          iucnStatus
          iucnStatusCode
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
