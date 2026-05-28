import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { useConfig } from '@/config/config';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import { DynamicLink } from '@/reactRouterPlugins';
import formatAsPercentage from '@/utils/formatAsPercentage';
import { tryParse } from '@/utils/querystring';
import React, { useEffect, useState } from 'react';
import { MdArrowDropDown, MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useUncontrolledProp } from 'uncontrollable';
import { Classification } from '../classification';
import { SimpleTooltip } from '../simpleTooltip';
import { Card, CardContent, CardDescription, CardTitle } from '../ui/smallCard';
import ChartClickWrapper from './charts/ChartClickWrapper';
import { GroupBy, Pagging, useFacets, FacetResultRow } from './charts/GroupByTable';
import Highcharts, { generateChartsPalette } from './charts/highcharts';
import { Map } from './charts/map/map';
import { ChartMessages, ChartViewOptions, ChartView } from './charts/OneDimensionalChart';
import { CardHeader } from './shared';

const majorRanks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'] as const;
type Rank = (typeof majorRanks)[number];

const getDefaultRank = (rank: string | undefined): Rank => {
  return (majorRanks as readonly string[]).includes(rank ?? '') ? (rank as Rank) : 'family';
};

type TaxonFacetEntry = {
  key: string | number;
  count: number;
  occurrences?: FacetResultRow['occurrences'];
  entity?: {
    checklistKey?: string;
    iucnStatus?: string;
    iucnStatusCode?: string;
    usage?: { name?: string; canonicalName?: string };
    classification?: Array<{ key?: string; name?: string; rank: string }>;
  };
};

type TaxonFacetData = {
  search?: {
    facet?: { results?: TaxonFacetEntry[] };
    documents?: { total?: number };
  };
  isNotNull?: { documents?: { total?: number } };
};

type TaxaMainProps = {
  defaultRank?: string;
  predicate?: Record<string, unknown>;
  checklistKey?: string;
  q?: string;
  handleRedirect?: (args: { filter: Record<string, unknown[]> }) => void;
  detailsRoute?: string;
  visibilityThreshold?: number;
  interactive?: boolean;
  setView?: (view: ChartView) => void;
  view?: ChartView;
  [key: string]: unknown;
};

function TaxaMain({
  defaultRank,
  predicate,
  checklistKey,
  q,
  handleRedirect,
  visibilityThreshold,
  interactive,
  setView: setUserView,
  view: userView,
  ...props
}: TaxaMainProps) {
  const { theme } = useConfig();
  const [view, setView] = useUncontrolledProp<ChartView>(userView, 'TABLE', setUserView);
  const defaultChecklistKey = useChecklistKey();
  const [query, setQuery] = useState(getTaxonQuery(`${getDefaultRank(defaultRank)}Key`));
  const [rank, setRank] = useState<string>(getDefaultRank(defaultRank).toUpperCase());
  const hasPredicates: Array<Record<string, unknown>> = [
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
  const chartColors = theme?.chartColors;
  const palette = chartColors
    ? generateChartsPalette(chartColors)
    : (Highcharts?.defaultOptions?.colors as string[] | undefined);

  useEffect(() => {
    setRank(getDefaultRank(defaultRank).toUpperCase());
    setQuery(getTaxonQuery(`${getDefaultRank(defaultRank)}Key`));
  }, [defaultRank]);

  const facetData = facetResults?.data as TaxonFacetData | undefined;
  const visibilityThresholdGuard =
    typeof visibilityThreshold === 'number' ? visibilityThreshold : -1;
  if ((facetData?.search?.facet?.results?.length ?? 0) <= visibilityThresholdGuard) return null;

  const filledPercentage =
    (facetData?.isNotNull?.documents?.total ?? 0) /
    (facetData?.search?.documents?.total || 1);

  const messages: React.ReactNode[] = [];
  messages.push(
    <div>
      <FormattedMessage
        id="dashboard.percentWithValue"
        values={{ percent: formatAsPercentage(filledPercentage) }}
      />
    </div>
  );

  function transform(data: unknown): FacetResultRow[] | undefined {
    return (data as TaxonFacetData)?.search?.facet?.results?.map((x) => {
      return {
        key: x?.key,
        title: (
          <span>
            {x?.entity?.usage?.name}{' '}
            <DynamicLink
              pageId="taxonKey"
              variables={{
                key: x?.key.toString(),
                datasetKey: x.entity?.checklistKey ?? '',
              }}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
              }}
            >
              <MdLink />
            </DynamicLink>
          </span>
        ),
        count: x.count,
        occurrences: x.occurrences,
        filter: { taxonKey: [tryParse(String(x.key))] },
        description: (
          <Classification className="g-text-xs g-text-slate-600">
            {x?.entity?.classification?.map((rank) => {
              return (
                <span key={rank.key}>
                  <span className="g-me-2">
                    <FormattedMessage
                      id={`enums.taxonRank.${rank.rank.toUpperCase()}`}
                      defaultMessage={
                        rank.rank.charAt(0).toUpperCase() + rank.rank.slice(1).toLowerCase()
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
  }

  return (
    <Card
      {...props}
      loading={facetResults.loading || !facetResults.data}
      error={!!facetResults.error}
    >
      <CardHeader
        options={<ChartViewOptions options={['TABLE', 'MAP']} view={view} setView={setView} />}
      >
        <CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="g-px-3 g-py-2 g-border g-border-slate-300 g-rounded-md g-cursor-pointer g-inline-flex g-items-center">
                <FormattedMessage
                  id={`enums.taxonRank.${rank.toUpperCase()}`}
                  defaultMessage={rank}
                />{' '}
                <MdArrowDropDown />
              </span>
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
                    id={`enums.taxonRank.${rank.toUpperCase()}`}
                    defaultMessage={rank}
                  />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription>
          <FormattedMessage id="dashboard.numberOfOccurrences" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {view === 'MAP' && (
          <Map
            facetResults={facetResults as unknown as Parameters<typeof Map>[0]['facetResults']}
            transform={transform as unknown as Parameters<typeof Map>[0]['transform']}
            onClick={handleRedirect}
            interactive={interactive}
            palette={palette ?? []}
          />
        )}
        {view === 'TABLE' && (
          <GroupBy
            {...{
              facetResults,
              interactive,
              onClick: handleRedirect,
              transform,
            }}
          />
        )}
        <Pagging facetResults={facetResults} />
        <ChartMessages messages={messages} />
      </CardContent>
    </Card>
  );
}

type TaxaProps = {
  defaultRank?: string;
  [key: string]: unknown;
};

export function Taxa({ defaultRank, ...props }: TaxaProps) {
  return (
    <ChartClickWrapper {...props}>
      <TaxaMain defaultRank={defaultRank} />
    </ChartClickWrapper>
  );
}

const getTaxonQuery = (rank: string) => `
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
        occurrences {
          metaPredicate
          _meta
        }
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

type IucnMainProps = {
  predicate?: Record<string, unknown>;
  checklistKey?: string;
  q?: string;
  handleRedirect?: (args: { filter: Record<string, unknown[]> }) => void;
  visibilityThreshold?: number;
  detailsRoute?: string;
  interactive?: boolean;
  userView?: ChartView;
  setUserView?: (view: ChartView) => void;
  [key: string]: unknown;
};

function IucnMain({
  predicate,
  checklistKey,
  q,
  handleRedirect,
  visibilityThreshold,
  interactive,
  userView,
  setUserView,
  ...props
}: IucnMainProps) {
  const [view, setView] = useUncontrolledProp<ChartView>(userView, 'TABLE', setUserView);
  const { theme } = useConfig();
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
  const facetData = facetResults?.data as TaxonFacetData | undefined;
  const resultCount = facetData?.search?.facet?.results?.length ?? 0;
  const visibilityThresholdGuard =
    typeof visibilityThreshold === 'number' ? visibilityThreshold : -1;
  if (resultCount <= visibilityThresholdGuard) return null;

  const transform = (data: unknown): FacetResultRow[] | undefined => {
    return (data as TaxonFacetData)?.search?.facet?.results?.map((x) => {
      return {
        key: x.key,
        title: (
          <div>
            <IucnCategory
              color={
                x?.entity?.iucnStatusCode
                  ? theme?.iucnColors?.[x.entity.iucnStatusCode]
                  : undefined
              }
              code={x?.entity?.iucnStatusCode}
              category={x?.entity?.iucnStatus}
            />
            {x?.entity?.usage?.canonicalName}
          </div>
        ),
        count: x.count,
        occurrences: x.occurrences,
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
                        rank.rank.charAt(0).toUpperCase() + rank.rank.slice(1).toLowerCase()
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
  };
  // use the theme?.iucnColors?.[x?.entity?.iucnStatusCode] approach to create the palette
  const palette =
    (facetData?.search?.facet?.results
      ?.map((x) => (x?.entity?.iucnStatusCode ? theme?.iucnColors?.[x.entity.iucnStatusCode] : undefined))
      .filter((c): c is string => Boolean(c)) ?? []);
  return (
    <Card
      {...props}
      loading={facetResults.loading || !facetResults.data}
      error={!!facetResults.error}
    >
      <CardHeader
        options={<ChartViewOptions options={['TABLE', 'MAP']} view={view} setView={setView} />}
      >
        <CardTitle>
          <FormattedMessage id={`dashboard.iucnThreatStatus`} />
        </CardTitle>
        <CardDescription>
          <FormattedMessage id={'dashboard.iucnThreatStatusDescription'} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {resultCount === 0 && <FormattedMessage id="dashboard.noData" defaultMessage="No data" />}
        {resultCount > 0 && (
          <>
            {view === 'MAP' && (
              <Map
                facetResults={facetResults as unknown as Parameters<typeof Map>[0]['facetResults']}
                transform={transform as unknown as Parameters<typeof Map>[0]['transform']}
                onClick={handleRedirect}
                interactive={interactive}
                palette={palette}
              />
            )}
            {view === 'TABLE' && (
              <GroupBy
                {...{
                  facetResults,
                  interactive,
                  onClick: handleRedirect,
                  transform,
                }}
              />
            )}
          </>
        )}
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
        occurrences {
          metaPredicate
          _meta
        }
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

export function Iucn(props: Record<string, unknown>) {
  return (
    <ChartClickWrapper {...props}>
      <IucnMain />
    </ChartClickWrapper>
  );
}

type IucnCategoryProps = {
  code?: string;
  category?: string;
  color?: string;
};

function IucnCategory({ code, category, color }: IucnCategoryProps) {
  return (
    <SimpleTooltip i18nKey={`enums.threatStatus.${category}`}>
      <span
        style={{ backgroundColor: color }}
        className={`gbif-iucn-status-${code} g-bg-[#7a443a] g-text-white g-px-1 g-py-0.5 g-text-xs g-font-bold g-rounded-md g-me-2`}
      >
        {code}
      </span>
    </SimpleTooltip>
  );
}
