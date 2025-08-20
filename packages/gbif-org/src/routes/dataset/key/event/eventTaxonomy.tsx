import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { EventTaxonomyQuery, EventTaxonomyQueryVariables, PredicateType } from '@/gql/graphql';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import useQuery from '@/hooks/useQuery';
import { HighchartsReact } from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Highcharts from '../../../../components/dashboard/charts/highcharts';

const chartsClass = 'g-min-w-full g-h-full g-w-40 g-overflow-hidden';

const EventTaxonomy = ({
  datasetKey,
  parentEventID,
  eventID,
  checklistKey,
  isParentEvent = false,
}: {
  datasetKey: string;
  parentEventID?: string | null;
  eventID?: string | null;
  checklistKey?: string | null;
  isParentEvent?: boolean;
}) => {
  const defaultChecklistKey = useChecklistKey();
  type ChartDataItem = {
    id: string;
    name: string | null | undefined;
    rank: string | null | undefined;
    parent: string | null;
    value: number;
  };

  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const { data, load } = useQuery<EventTaxonomyQuery, EventTaxonomyQueryVariables>(EVENT_TAXONOMY, {
    lazyLoad: true,
    throwAllErrors: true,
    notifyOnErrors: true,
  });
  useEffect(() => {
    if (datasetKey) {
      const variables = {
        checklistKey: checklistKey || defaultChecklistKey,
        size: 1000,
        predicate: {
          type: PredicateType.And,
          predicates: [
            {
              type: PredicateType.Equals,
              key: 'datasetKey',
              value: datasetKey,
            },
            isParentEvent && parentEventID
              ? {
                  type: PredicateType.Equals,
                  key: 'parentEventId',
                  value: parentEventID,
                }
              : {
                  type: PredicateType.Equals,
                  key: 'eventId',
                  value: eventID,
                },
          ],
        },
      };
      load({
        variables,
      });
    }
  }, [datasetKey, parentEventID, load, eventID]);

  useEffect(() => {
    if (data?.occurrenceSearch?.facet?.taxonKey) {
      const taxonMap = new Map();
      const mappedData = data?.occurrenceSearch?.facet?.taxonKey
        .filter((t) => t?.taxonMatch?.classification.length < 5)
        .map((t) => {
          const item = {
            id: `${t?.taxonMatch?.classification.length}.${t?.key}`,
            name: t?.taxonMatch?.usage?.name,
            rank: t?.taxonMatch?.usage?.rank,
            parent: t?.taxonMatch?.classification[t?.taxonMatch?.classification.length - 2]
              ? `${t.taxonMatch.classification.length - 1}.${
                  t?.taxonMatch?.classification?.[t?.taxonMatch?.classification?.length - 2]?.key
                }`
              : null,
            value: t?.count,
          };
          if (taxonMap.has(item.parent)) {
            const existingItem = taxonMap.get(item.parent);
            taxonMap.set(item.parent, {
              childCount: existingItem.childCount + 1,
              childDataAggregated: existingItem.childDataAggregated + t?.count,
              total: existingItem.total,
              parent: existingItem.parent,
            });
          }
          taxonMap.set(item.id, {
            childCount: 0,
            childDataAggregated: 0,
            total: t?.count,
            parent: item.parent,
          });
          return item;
        });

      taxonMap.forEach((value, key) => {
        if (value.childDataAggregated < value.total) {
          let level = Number(key.split('.')[0]);
          let parent = key;
          while (level < 4) {
            mappedData.push({
              id: `${level}.other`,
              name: value.childCount > 0 ? 'Other' : null,
              rank: null,
              parent: parent,
              value: value.total - value.childDataAggregated,
            });
            parent = `${level}.other`;
            level++;
          }
        }
      });
      setChartData(mappedData);
    }
  }, [data]);
  return (
    <Card className="g-mb-4">
      <CardHeader>
        <CardTitle>
          <FormattedMessage
            id="dataset.eventTaxonomy"
            defaultMessage={`Taxonomic distribution of occurrences`}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {' '}
          {!!chartData.length && (
            <HighchartsReact
              highcharts={Highcharts}
              className={chartsClass}
              options={{
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
                    type: 'sunburst',
                    turboThreshold: 0,
                    data: chartData,
                    allowDrillToNode: true, //allowDrillToNode,
                    cursor: 'pointer',
                    name: 'Root',
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
                  pointFormat: '<b>{point.name} : {point.value}</b> ' + 'Occurences',
                },
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventTaxonomy;

const EVENT_TAXONOMY = /* GraphQL */ `
  query EventTaxonomy($predicate: Predicate, $size: Int, $checklistKey: ID) {
    occurrenceSearch(predicate: $predicate) {
      documents {
        total
      }
      facet {
        taxonKey(size: $size, checklistKey: $checklistKey) {
          count
          key
          taxonMatch(checklistKey: $checklistKey) {
            usage {
              name
              rank
            }
            classification {
              key
              rank
              name
            }
          }
        }
      }
    }
  }
`;
