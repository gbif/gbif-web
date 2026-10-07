import { useEffect, useState } from 'react';
import { useFacets } from './charts/GroupByTable';
import { Card, CardContent, CardTitle } from '@/components/ui/smallCard';
import { CardHeader } from './shared';

import type { Options, PointClickCallbackFunction, PointLabelObject } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from './charts/highcharts';

import { TbChartDonut4, TbChartTreemap } from 'react-icons/tb';

import { Predicate } from '@/gql/graphql';
import { useChecklistKey } from '@/hooks/useChecklistKey';

import { Button } from '../ui/button';
import { FormattedMessage } from 'react-intl';

type ChartView = 'SUNBURST' | 'TREEMAP';

// Component to control the view options: table, pie chart, bar chart
function ViewOptions({
  view,
  setView,
  options = ['SUNBURST', 'TREEMAP'],
}: {
  view: ChartView;
  setView: (view: ChartView) => void;
  options?: ChartView[];
}) {
  if (options.length < 2) return null;

  // option to icon component map
  const iconMap: Record<ChartView, React.ReactNode> = {
    SUNBURST: <TbChartDonut4 size={20} />,
    TREEMAP: <TbChartTreemap size={20} />,
  };
  return (
    <div>
      {options.map((option) => (
        <Button
          key={option}
          variant="link"
          style={{ padding: '0 5px', height: 'auto' }}
          className={`g-m-0 ${view === option ? 'g-text-primary-500' : 'g-text-slate-400'}`}
          onClick={() => setView(option)}
        >
          {iconMap[option]}
        </Button>
      ))}
    </div>
  );
}

const rankKeys_ = ['kingdomKey', 'phylumKey', 'classKey', 'orderKey', 'familyKey', 'genusKey'];
// The GBIF rank enum name for each facet key, used to find a node's parent in its classification by
// rank rather than by position. Checklists such as CatalogueOfLife include intermediate ranks
// (SUBPHYLUM, MEGACLASS, SUBFAMILY, …) between the Linnaean ranks we chart, so the parent is NOT
// simply the second-to-last classification entry — it must be located by its rank name.
const RANK_BY_KEY: Record<string, string> = {
  kingdomKey: 'KINGDOM',
  phylumKey: 'PHYLUM',
  classKey: 'CLASS',
  orderKey: 'ORDER',
  familyKey: 'FAMILY',
  genusKey: 'GENUS',
};
// The facet query is built dynamically per rank key, so its shape differs from useFacets' default.
type SunburstBucket = {
  key: string | number;
  count: number;
  entity?: {
    classification?: { key: string; rank: string }[] | null;
    usage?: { key?: string; name?: string; rank?: string } | null;
  } | null;
};
type SunburstQueryData = {
  search?: {
    documents?: { total?: number };
    cardinality?: Record<string, number>;
    facet?: Record<string, SunburstBucket[] | undefined>;
  };
};
type SunburstNode = { id: string; value: number; name?: string; rank?: string; parent?: string };

type Props = {
  predicate?: Predicate;
  q?: string;
  checklistKey?: string;
  click?: PointClickCallbackFunction;
  [key: string]: unknown;
};

export function OccurrenceTaxonomySunburst({ predicate, q, checklistKey, click, ...props }: Props) {
  const defaultChecklistKey = useChecklistKey();
  const [rankKeys, setRankKeys] = useState(rankKeys_.slice(0, 4));
  const [view, setView] = useState<ChartView>('SUNBURST');
  const [sunBurstOptions, setSunBurstOptions] = useState<Options>();
  const [treeMapOptions, setTreeMapOptions] = useState<Options>();

  useEffect(() => {
    if (predicate == null) return;
    const hasTaxonKey =
      predicate?.predicates?.find((p) => p?.key === 'taxonKey')?.values?.length === 1;
    if (!hasTaxonKey) {
      setRankKeys(rankKeys_.slice(0, 4));
    } else {
      setRankKeys(rankKeys_);
    }
  }, [predicate, checklistKey, defaultChecklistKey]);

  const [query, setQuery] = useState('');
  useEffect(() => {
    if (rankKeys.length === 0) return;

    setQuery(
      getTaxonQuery({
        rankKeys,
      })
    );
  }, [rankKeys]);

  const facetResults = useFacets({
    predicate,
    query,
    otherVariables: { q, checklistKey: checklistKey || defaultChecklistKey },
  });

  const data = facetResults.data as unknown as SunburstQueryData | undefined;

  useEffect(() => {
    const cardinality = data?.search?.cardinality || {};
    const maxLevelCount = Object.keys(cardinality).reduce(
      (max, key) => Math.max(max, Number(cardinality?.[key])),
      0
    );
    // "Single lineage" = every rank resolves to at most one distinct taxon, so
    // the sunburst would be a single segment at each level.
    const singleLineage = maxLevelCount < 2;
    // The deepest set of ranks we zoom to when the data is a single lineage.
    const deeperRanks = rankKeys_.slice(3, rankKeys_.length);
    const alreadyDeepest =
      rankKeys.length === deeperRanks.length &&
      rankKeys.every((key, idx) => key === deeperRanks[idx]);
    if (data?.search?.facet && singleLineage && !alreadyDeepest) {
      // Zoom into deeper ranks to try to get a more granular chart. If we're
      // already at the deepest ranks, fall through and render the single
      // lineage instead of looping forever (which left the card blank).
      setRankKeys(deeperRanks);
    } else if (data?.search?.facet) {
      const facet = data.search.facet;
      // Derive the rings from the FACET RESPONSE itself, in canonical shallow→deep rank order —
      // NOT from the mutable `rankKeys` state. `rankKeys` can change (the taxonKey/zoom effects) or
      // lag behind a late-arriving facet response, and indexing buckets by their position in it was
      // assigning ring levels to the wrong ranks (e.g. an order like Agaricales rendered at the
      // innermost level). A node's level now always matches its true rank.
      const ORDERED_KEYS = [
        'kingdomKey',
        'phylumKey',
        'classKey',
        'orderKey',
        'familyKey',
        'genusKey',
      ];
      const present = ORDERED_KEYS.filter((rk) => Array.isArray(facet[rk]));
      // Draw a ring for the shallowest and deepest present rank, plus any rank that branches (more
      // than one taxon). Single-child intermediate ranks are dropped; their descendants re-link to
      // the nearest drawn ancestor (by rank name, below), so nothing is orphaned to the centre.
      const drawn = present.filter(
        (rk, i) => i === 0 || i === present.length - 1 || (facet[rk]?.length ?? 0) > 1
      );

      let results: SunburstNode[] = [];
      const levelCounts: Record<number, number> = {};
      drawn.forEach((rk, level) => {
        levelCounts[level] = facet[rk]?.length ?? 0;
        // The parent ring's rank name, used to locate this node's parent in its classification
        // (robust to intermediate ranks in checklists like CoL, and to dropped single-child rings).
        const parentRankName = level > 0 ? RANK_BY_KEY[drawn[level - 1]] : null;
        results = results.concat(
          (facet[rk] ?? []).map((item) => {
            const node: SunburstNode = {
              id: `${level}.${item.key}`,
              value: item.count,
              name: item.entity?.usage?.name,
              rank: item.entity?.usage?.rank,
            };
            if (!parentRankName) return node;
            const parentKey = item.entity?.classification?.find(
              (c) => c.rank === parentRankName
            )?.key;
            return { ...node, parent: `${level - 1}.${parentKey}` };
          })
        );
      });

      const taxonomy = {
        results,
        count: data.search.documents?.total,
        levelCounts,
      };
      const pointEvents =
        click && typeof click === 'function' ? { point: { events: { click } } } : {};
      const sunBurstOptions_ = {
        plotOptions: {
          sunburst: {
            size: '100%',
          },
        },
        credits: { enabled: false },
        title: {
          text: '',
        },
        exporting: {
          buttons: {
            contextButton: {
              enabled: false,
            },
          },
        },
        series: [
          {
            name: 'Taxa',
            type: 'sunburst',
            turboThreshold: 0,
            data: taxonomy.results,
            ...pointEvents,
            allowDrillToNode: true, //allowDrillToNode,
            cursor: 'pointer',

            dataLabels: {
              format: '{point.name}',
              filter: {
                property: 'innerArcLength',
                operator: '>',
                value: 16,
              },
            },
            levels: [
              {
                level: 1,
                levelIsConstant: false,
                dataLabels: {
                  enabled: true,
                },
              },
              {
                level: 2,
                colorByPoint: true,
                dataLabels: {
                  rotationMode: 'parallel',
                },
              },
              {
                level: 3,
                colorVariation: {
                  key: 'brightness',
                  to: -0.5,
                },
              },
              {
                level: 4,
                colorVariation: {
                  key: 'brightness',
                  to: 0.5,
                },
              },
            ],
          },
        ],
        tooltip: {
          headerFormat: '',
          pointFormat: '<b>{point.name} : {point.value}</b> ' + 'Occurrences', //translatedOccurrences,
        },
      };
      const minCountForTreeMapLabels = Math.round((taxonomy.count ?? 0) / 80);

      const treeMapOptions_ = {
        plotOptions: {
          sunburst: {
            size: '100%',
          },
        },

        credits: { enabled: false },
        title: {
          text: '',
        },
        exporting: {
          buttons: {
            contextButton: {
              enabled: false,
            },
          },
        },
        series: [
          {
            name: 'Taxa',
            turboThreshold: 0,
            boostThreshold: 100,
            type: 'treemap',
            allowDrillToNode: true, //allowDrillToNode,
            animationLimit: 1000,
            levelIsConstant: true,
            levels: [
              {
                level: 1,
                layoutAlgorithm: 'stripes',
                colorByPoint: true,
                groupPadding: 3,
                dataLabels: {
                  headers: true,
                  enabled: true,
                  formatter: function (this: PointLabelObject) {
                    return (this.point.options.value ?? 0) > minCountForTreeMapLabels
                      ? this.point.name
                      : '';
                  },
                  align: 'left',
                  verticalAlign: 'top',
                  style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                  },
                  padding: 2,
                },
              },
              {
                level: 2,
                colorByPoint: true,
                layoutAlgorithm: 'sliceAndDice',
                dataLabels: {
                  enabled: taxonomy.levelCounts[2] < 300,
                  formatter: function (this: PointLabelObject) {
                    return (this.point.options.value ?? 0) > minCountForTreeMapLabels
                      ? this.point.name
                      : '';
                  },
                  style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                  },
                },
              },
              {
                level: 3,
                layoutAlgorithm: 'sliceAndDice',
                dataLabels: {
                  enabled: taxonomy.levelCounts[3] < 500,
                  formatter: function (this: PointLabelObject) {
                    return (this.point.options.value ?? 0) > minCountForTreeMapLabels
                      ? this.point.name
                      : '';
                  },
                },
                colorVariation: {
                  key: 'brightness',
                  to: -0.5,
                },
              },
              {
                level: 4,
                layoutAlgorithm: 'sliceAndDice',
                dataLabels: {
                  enabled: (taxonomy.levelCounts[4] ?? 0) < 500,
                },
                colorVariation: {
                  key: 'brightness',
                  to: 0.5,
                },
              },
            ],
            tooltip: {
              headerFormat: '',
              pointFormat: '<b>{point.name} : {point.value}</b> occurrences',
            },
            data: taxonomy.results,
            ...pointEvents,
          },
        ],

        boost: {
          useGPUTranslations: true,
        },
      };
      // Highcharts' bundled typings omit several sunburst/treemap level options used here.
      setSunBurstOptions(sunBurstOptions_ as Options);
      setTreeMapOptions(treeMapOptions_ as Options);
    }
  }, [facetResults?.data?.search?.facet]);

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
        options={<ViewOptions options={['SUNBURST', 'TREEMAP']} view={view} setView={setView} />}
      >
        <CardTitle>
          <FormattedMessage
            id={'dataset.eventTaxonomy'}
            defaultMessage="Taxonomic distribution of occurrences"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {facetResults?.data?.search?.documents?.total === 0 && (
          <div className="g-text-center g-text-slate-400">
            <FormattedMessage id="dashboard.noData" defaultMessage="No data" />
          </div>
        )}
        {view === 'SUNBURST' && (facetResults?.data?.search?.documents?.total ?? 0) > 0 && (
          <HighchartsReact highcharts={Highcharts} options={sunBurstOptions} />
        )}
        {view === 'TREEMAP' && (facetResults?.data?.search?.documents?.total ?? 0) > 0 && (
          <HighchartsReact highcharts={Highcharts} options={treeMapOptions} />
        )}
      </CardContent>
    </Card>
  );
}

const getTaxonQuery = ({ rankKeys }: { rankKeys: string[] }) => `
query occurrenceSunburst($q: String, $predicate: Predicate, $checklistKey: ID){
  search: occurrenceSearch(q: $q, predicate: $predicate, size: 0) {
    documents(size: 0) {
      total
    }
    cardinality {
      ${rankKeys.map((key) => `${key}: ${key}(checklistKey: $checklistKey)`).join('\n')}
    }
    facet {
     ${rankKeys
       .map(
         (key) => `
      ${key}: ${key}(size: 1000, from: 0, checklistKey: $checklistKey) {
        key
        count
        entity: taxonMatch(checklistKey: $checklistKey) {
          classification {
            key
            rank
          }
          usage {
            key
            name
            rank
          }
        
        }
      }`
       )
       .join('\n')}
    }
  }

}
`;
