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

export function OccurrenceTaxonomySunburst({ predicate, q, checklistKey, click, ...props }) {
  const defaultChecklistKey = useChecklistKey();
  const [rankKeys, setRankKeys] = useState([]);
  const [view, setView] = useState('SUNBURST');
  const [sunBurstOptions, setSunBurstOptions] = useState(null);
  const [treeMapOptions, setTreeMapOptions] = useState(null);

  useEffect(() => {
    if (predicate == null) return;
    const rankKeys_ = ['kingdomKey', 'phylumKey', 'classKey', 'orderKey', 'familyKey', 'genusKey'];
    const hasTaxonKey =
      predicate?.predicates?.find((p) => p?.key === 'taxonKey')?.values?.length === 1;
    if (!hasTaxonKey) {
      setRankKeys(rankKeys_.toSpliced(4, rankKeys_.length - 4));
    } else {
      setRankKeys(rankKeys_);
    }
  }, [predicate, checklistKey, defaultChecklistKey]);

  const [query, setQuery] = useState({});
  useEffect(() => {
    if (rankKeys.length === 0) return;
    setQuery(
      getTaxonQuery({
        rankKeys,
      })
    );
  }, [rankKeys]);

  const facetResults = useFacets({ predicate, query });

  useEffect(() => {
    if (facetResults?.data?.search?.facet) {
      let results = [];
      const levelCounts = rankKeys.reduce((acc, key, idx) => {
        acc[idx] = Number(facetResults?.data?.search?.cardinality[key]) || 0;
        return acc;
      }, {});
      rankKeys.forEach((rank, idx) => {
        if (
          Number(facetResults?.data?.search?.cardinality?.[rankKeys[idx]]) > 1 ||
          Number(facetResults?.data?.search?.cardinality?.[rankKeys[idx + 1]]) > 1
        ) {
          results = [
            ...results,
            ...facetResults.data.search.facet[rank].map((item) =>
              idx === 0
                ? {
                    id: `${idx}.${item.key}`,
                    value: item.count,
                    name: item.entity.usage?.name,
                    rank: item.entity.usage?.rank,
                  }
                : {
                    id: `${idx}.${item.key}`,
                    value: item.count,
                    name: item.entity.usage?.name,
                    rank: item.entity.usage?.rank,
                    parent: `${idx - 1}.${
                      item.entity.classification?.[item.entity.classification.length - 2]?.key
                    }`,
                  }
            ),
          ];
        }
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
      error={!!facetResults.error}
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
        {view === 'SUNBURST' && (
          <HighchartsReact highcharts={Highcharts} options={sunBurstOptions} />
        )}
        {view === 'TREEMAP' && <HighchartsReact highcharts={Highcharts} options={treeMapOptions} />}
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
