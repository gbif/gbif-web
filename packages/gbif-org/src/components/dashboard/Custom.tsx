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
import React, { useEffect, useMemo, useState } from 'react';
import { MdArrowDropDown, MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useUncontrolledProp } from 'uncontrollable';
import { Classification, GadmClassification } from '../classification';
import { SimpleTooltip } from '../simpleTooltip';
import { Card, CardContent, CardDescription, CardTitle } from '../ui/smallCard';
import ChartClickWrapper from './charts/ChartClickWrapper';
import { GroupBy, Pagging, useFacets, FacetResultRow } from './charts/GroupByTable';
import Highcharts, { generateChartsPalette } from './charts/highcharts';
import { Map } from './charts/map/map';
import { filterLevels } from './charts/gadm';
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
  rank?: string;
  onParamsChange?: (params: Record<string, unknown>) => void;
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
  rank: userRank,
  onParamsChange,
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
  // Local fallback rank, used when the rank isn't persisted via the layout
  // (e.g. when the Taxa chart is embedded in entity pages rather than the
  // customizable dashboard). It tracks `defaultRank` so dynamic defaults keep working.
  const [localRank, setLocalRank] = useState<string>(getDefaultRank(defaultRank).toUpperCase());
  // When the chart lives in the customizable dashboard, `onParamsChange` is provided
  // and the selected rank is read from / written to the serialized layout (`p.rank`),
  // so it survives reload and is included in shared links. Validate the persisted
  // value (it may come from an untrusted URL) and fall back to the local rank.
  const persistedRank = typeof userRank === 'string' ? userRank.toUpperCase() : undefined;
  const rank =
    persistedRank && (majorRanks as readonly string[]).includes(persistedRank.toLowerCase())
      ? persistedRank
      : localRank;
  const setRank = (value: string) => {
    const normalized = value.toUpperCase();
    if (onParamsChange) {
      onParamsChange({ rank: normalized });
    } else {
      setLocalRank(normalized);
    }
  };
  const query = useMemo(() => getTaxonQuery(`${rank.toLowerCase()}Key`), [rank]);
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

  // Keep the local fallback rank in sync when a (possibly dynamic) `defaultRank`
  // changes. The persisted rank (`userRank`) always takes precedence when present.
  useEffect(() => {
    setLocalRank(getDefaultRank(defaultRank).toUpperCase());
  }, [defaultRank]);

  const facetData = facetResults?.data as TaxonFacetData | undefined;
  const visibilityThresholdGuard =
    typeof visibilityThreshold === 'number' ? visibilityThreshold : -1;
  if ((facetData?.search?.facet?.results?.length ?? 0) <= visibilityThresholdGuard) return null;

  const filledPercentage =
    (facetData?.isNotNull?.documents?.total ?? 0) / (facetData?.search?.documents?.total || 1);

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
      // Only surface the error card when we have no data to show, so a partial error
      // (e.g. per-bucket metaPredicate failing on an unsupported v2-map predicate)
      // still renders the chart.
      error={!!facetResults.error && !facetResults.data}
    >
      <CardHeader
        options={<ChartViewOptions options={['TABLE', 'MAP']} view={view} setView={setView} />}
      >
        <div className="g-flex g-flex-col sm:g-flex-row sm:g-flex-wrap sm:g-items-baseline sm:g-gap-x-2 sm:g-gap-y-0.5">
          <CardTitle className="sm:g-order-1">
            <FormattedMessage id="dashboard.taxa" defaultMessage="Taxa" />
          </CardTitle>
          <CardDescription className="sm:g-order-3 sm:g-basis-full">
            <FormattedMessage id="dashboard.numberOfOccurrences" />
          </CardDescription>
          <div className="g-pt-1 sm:g-pt-0 sm:g-order-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="g-px-2 g-py-1 g-text-sm g-border g-border-slate-300 g-rounded-md g-cursor-pointer g-inline-flex g-items-center">
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
          </div>
        </div>
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

const gadmLevels = ['0', '1', '2', '3'] as const;
type GadmLevelValue = (typeof gadmLevels)[number];

const getDefaultGadmLevel = (level: string | undefined): GadmLevelValue => {
  return (gadmLevels as readonly string[]).includes(level ?? '') ? (level as GadmLevelValue) : '1';
};

type GadmFacetEntry = {
  key: string;
  count: number;
  occurrences?: FacetResultRow['occurrences'];
  entity?: {
    documents?: {
      results?: Array<{ gadm?: Record<string, { gid: string; name: string }> }>;
    };
  };
};

type GadmFacetData = {
  search?: {
    facet?: { results?: GadmFacetEntry[] };
    documents?: { total?: number };
  };
  isNotNull?: { documents?: { total?: number } };
};

type GadmLevelMainProps = {
  defaultLevel?: string;
  // The serialized layout param decodes any digit-only value (e.g. "0"-"3")
  // as a number rather than a string (needed for other params like the
  // resized height), so this can arrive as either.
  level?: string | number;
  onParamsChange?: (params: Record<string, unknown>) => void;
  predicate?: Record<string, unknown>;
  q?: string;
  handleRedirect?: (args: { filter: Record<string, unknown[]> }) => void;
  detailsRoute?: string;
  visibilityThreshold?: number;
  interactive?: boolean;
  setView?: (view: ChartView) => void;
  view?: ChartView;
  [key: string]: unknown;
};

function GadmLevelMain({
  defaultLevel,
  level: userLevel,
  onParamsChange,
  predicate,
  q,
  handleRedirect,
  visibilityThreshold,
  interactive,
  setView: setUserView,
  view: userView,
  ...props
}: GadmLevelMainProps) {
  const { theme } = useConfig();
  const [view, setView] = useUncontrolledProp<ChartView>(userView, 'TABLE', setUserView);
  // Local fallback level, used when the level isn't persisted via the layout
  // (mirrors the Taxa chart's localRank fallback).
  const [localLevel, setLocalLevel] = useState<string>(getDefaultGadmLevel(defaultLevel));
  // When the chart lives in the customizable dashboard, `onParamsChange` is provided
  // and the selected level is read from / written to the serialized layout (`p.level`),
  // so it survives reload and is included in shared links.
  const persistedLevel =
    typeof userLevel === 'string' || typeof userLevel === 'number' ? String(userLevel) : undefined;
  const level =
    persistedLevel && (gadmLevels as readonly string[]).includes(persistedLevel)
      ? persistedLevel
      : localLevel;
  const setLevel = (value: string) => {
    if (onParamsChange) {
      onParamsChange({ level: value });
    } else {
      setLocalLevel(value);
    }
  };
  const fieldName = `gadmLevel${level}Gid`;
  const query = useMemo(() => getGadmLevelQuery(fieldName), [fieldName]);
  const hasPredicates: Array<Record<string, unknown>> = [{ type: 'isNotNull', key: fieldName }];
  if (predicate) {
    hasPredicates.push(predicate);
  }
  const facetResults = useFacets({
    predicate,
    otherVariables: {
      q,
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

  // Keep the local fallback level in sync when a (possibly dynamic) `defaultLevel`
  // changes. The persisted level (`userLevel`) always takes precedence when present.
  useEffect(() => {
    setLocalLevel(getDefaultGadmLevel(defaultLevel));
  }, [defaultLevel]);

  const facetData = facetResults?.data as GadmFacetData | undefined;
  const visibilityThresholdGuard =
    typeof visibilityThreshold === 'number' ? visibilityThreshold : -1;
  if ((facetData?.search?.facet?.results?.length ?? 0) <= visibilityThresholdGuard) return null;

  const filledPercentage =
    (facetData?.isNotNull?.documents?.total ?? 0) / (facetData?.search?.documents?.total || 1);

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
    return (data as GadmFacetData)?.search?.facet?.results?.map((x) => {
      const gadmRoot = x?.entity?.documents?.results?.[0]?.gadm;
      const gadm = filterLevels(gadmRoot, x.key);
      return {
        key: x.key,
        count: x.count,
        occurrences: x.occurrences,
        title: (
          <GadmClassification
            gadm={gadm as unknown as Parameters<typeof GadmClassification>[0]['gadm']}
          />
        ),
        plainTextTitle: x.key,
        // Always filter on gadmGid, the same field the (all-levels) GadmGid chart
        // uses: a GADM GID uniquely identifies a region regardless of which level
        // it was faceted at, so the filter link is identical across levels.
        filter: { gadmGid: [x.key] },
      };
    });
  }

  return (
    <Card
      {...props}
      loading={facetResults.loading || !facetResults.data}
      // Only surface the error card when we have no data to show, so a partial error
      // (e.g. per-bucket metaPredicate failing on an unsupported v2-map predicate)
      // still renders the chart.
      error={!!facetResults.error && !facetResults.data}
    >
      <CardHeader
        options={<ChartViewOptions options={['TABLE', 'MAP']} view={view} setView={setView} />}
      >
        <div className="g-flex g-flex-col sm:g-flex-row sm:g-flex-wrap sm:g-items-baseline sm:g-gap-x-2 sm:g-gap-y-0.5">
          <CardTitle className="sm:g-order-1">
            <FormattedMessage id="filters.gadmGid.name" defaultMessage="Administrative area" />
          </CardTitle>
          <CardDescription className="sm:g-order-3 sm:g-basis-full">
            <FormattedMessage id="dashboard.numberOfOccurrences" />
          </CardDescription>
          <div className="g-pt-1 sm:g-pt-0 sm:g-order-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="g-px-2 g-py-1 g-text-sm g-border g-border-slate-300 g-rounded-md g-cursor-pointer g-inline-flex g-items-center">
                  <FormattedMessage
                    id={`enums.gadmLevel.${level}`}
                    defaultMessage={`Level ${level}`}
                  />{' '}
                  <MdArrowDropDown />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {gadmLevels.map((l) => (
                  <DropdownMenuItem
                    key={l}
                    onClick={() => {
                      setLevel(l);
                    }}
                  >
                    <FormattedMessage id={`enums.gadmLevel.${l}`} defaultMessage={`Level ${l}`} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
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

type GadmLevelProps = {
  defaultLevel?: string;
  [key: string]: unknown;
};

export function GadmGid({ defaultLevel, ...props }: GadmLevelProps) {
  return (
    <ChartClickWrapper {...props}>
      <GadmLevelMain defaultLevel={defaultLevel} />
    </ChartClickWrapper>
  );
}

const getGadmLevelQuery = (fieldName: string) => `
query summary($q: String, $predicate: Predicate, $hasPredicate: Predicate, $size: Int, $from: Int){
  search: occurrenceSearch(q: $q, predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: ${fieldName}
    }
    facet {
      results: ${fieldName}(size: $size, from: $from) {
        key
        count
        occurrences {
          metaPredicate
          _meta
        }
        entity: occurrences {
          documents(size: 1) {
            results {
              gadm
            }
          }
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
                x?.entity?.iucnStatusCode ? theme?.iucnColors?.[x.entity.iucnStatusCode] : undefined
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
    facetData?.search?.facet?.results
      ?.map((x) =>
        x?.entity?.iucnStatusCode ? theme?.iucnColors?.[x.entity.iucnStatusCode] : undefined
      )
      .filter((c): c is string => Boolean(c)) ?? [];
  return (
    <Card
      {...props}
      loading={facetResults.loading || !facetResults.data}
      // Only surface the error card when we have no data to show, so a partial error
      // (e.g. per-bucket metaPredicate failing on an unsupported v2-map predicate)
      // still renders the chart.
      error={!!facetResults.error && !facetResults.data}
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
