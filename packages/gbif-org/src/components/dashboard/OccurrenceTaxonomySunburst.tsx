import { useEffect, useState } from 'react';
import { useFacets } from './charts/GroupByTable';
import { Card, CardContent, CardTitle } from '@/components/ui/smallCard';
import { CardHeader } from './shared';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from './charts/highcharts';

import { TbChartDonut4, TbChartTreemap } from 'react-icons/tb';

import { useChecklistKey } from '@/hooks/useChecklistKey';

import { Button } from '../ui/button';
import { FormattedMessage } from 'react-intl';

// Component to control the view options: table, pie chart, bar chart
function ViewOptions({ view, setView, options = ['SUNBURST', 'TREEMAP'] }) {
  if (options.length < 2) return null;

  // option to icon component map
  const iconMap = {
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
export function OccurrenceTaxonomySunburst({ predicate, q, checklistKey, click, ...props }) {
  const defaultChecklistKey = useChecklistKey();
  const [rankKeys, setRankKeys] = useState(rankKeys_.toSpliced(4, rankKeys_.length - 4));
  const [view, setView] = useState('SUNBURST');
  const [sunBurstOptions, setSunBurstOptions] = useState(null);
  const [treeMapOptions, setTreeMapOptions] = useState(null);

  useEffect(() => {
    if (predicate == null) return;
    const hasTaxonKey =
      predicate?.predicates?.find((p) => p?.key === 'taxonKey')?.values?.length === 1;
    if (!hasTaxonKey) {
      setRankKeys(rankKeys_.toSpliced(4, rankKeys_.length - 4));
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
    otherVariables: { checklistKey: checklistKey || defaultChecklistKey },
  });

  useEffect(() => {
    const cardinality = facetResults?.data?.search?.cardinality || {};
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
    if (facetResults?.data?.search?.facet && singleLineage && !alreadyDeepest) {
      // Zoom into deeper ranks to try to get a more granular chart. If we're
      // already at the deepest ranks, fall through and render the single
      // lineage instead of looping forever (which left the card blank).
      setRankKeys(deeperRanks);
    } else if (facetResults?.data?.search?.facet) {
      const facet = facetResults.data.search.facet;
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

      let results = [];
      const levelCounts = {};
      drawn.forEach((rk, level) => {
        levelCounts[level] = facet[rk]?.length ?? 0;
        // The parent ring's rank name, used to locate this node's parent in its classification
        // (robust to intermediate ranks in checklists like CoL, and to dropped single-child rings).
        const parentRankName = level > 0 ? RANK_BY_KEY[drawn[level - 1]] : null;
        results = results.concat(
          (facet[rk] ?? []).map((item) => {
            const node = {
              id: `${level}.${item.key}`,
              value: item.count,
              name: item.entity?.usage?.name,
              rank: item.entity?.usage?.rank,
            };
            if (!parentRankName) return node;
            const parentKey = item.entity?.classification?.find(
              (c: any) => c.rank === parentRankName
            )?.key;
            return { ...node, parent: `${level - 1}.${parentKey}` };
          })
        );
      });

      const taxonomy = {
        results,
        count: facetResults.data.search.documents.total,
        levelCounts,
      };
      const sunBurstOptions_ = {
        plotOptions: {
          sunburst: {
            size: '100%',
          },
        },
        credits: false,
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
      const minCountForTreeMapLabels = Math.round(taxonomy.count / 80);

      const treeMapOptions_ = {
        plotOptions: {
          sunburst: {
            size: '100%',
          },
        },

        credits: false,
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
                  formatter: function () {
                    return this.point.options.value > minCountForTreeMapLabels
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
                  formatter: function () {
                    return this.point.options.value > minCountForTreeMapLabels
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
                  formatter: function () {
                    return this.point.options.value > minCountForTreeMapLabels
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
                  enabled: taxonomy.length < 500,
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
          },
        ],

        boost: {
          useGPUTranslations: true,
        },
      };
      if (click && typeof click === 'function') {
        treeMapOptions_.series[0].point = {
          events: {
            click: click,
          },
        };
        sunBurstOptions_.series[0].point = {
          events: {
            click: click,
          },
        };
      }
      setSunBurstOptions(sunBurstOptions_);
      setTreeMapOptions(treeMapOptions_);
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
        {view === 'SUNBURST' && facetResults?.data?.search?.documents?.total > 0 && (
          <HighchartsReact highcharts={Highcharts} options={sunBurstOptions} />
        )}
        {view === 'TREEMAP' && facetResults?.data?.search?.documents?.total > 0 && (
          <HighchartsReact highcharts={Highcharts} options={treeMapOptions} />
        )}
      </CardContent>
    </Card>
  );
}

const getTaxonQuery = ({ rankKeys }) => `
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
