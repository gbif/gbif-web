import Highcharts, { chartColors } from '@/components/dashboard/charts/highcharts';
import { chartsClass } from '@/components/dashboard/charts/OneDimensionalChart';
import { CardHeader } from '@/components/dashboard/shared';
import { ErrorBlock } from '@/components/ErrorBoundary';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/smallCard';
import rankEnum from '@/enums/basic/rank.json';
import { useLink } from '@/reactRouterPlugins/dynamicLink';
import HighchartsReact from 'highcharts-react-official';
import isArray from 'lodash/isArray';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { getBreakdown, getSourceTaxon } from './breakdownUtil';
const fmIndex = rankEnum.indexOf('FAMILY');

const TaxonBreakdown = ({ taxon, ...props }) => {
  const [chartOptions, setChartOptions] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const createLink = useLink();
  const navigate = useNavigate();

  const isBackbone = taxon?.nubKey === taxon?.key;

  useEffect(() => {
    setChartOptions(null);
    if (taxon.key) {
      getData();
    }
  }, [taxon.key]);

  const navigateToTaxon = async (key) => {
    if (isBackbone) {
      let { to } = createLink({
        pageId: 'taxonKey',
        variables: { key },
      });
      if (!to) to = `/species/${key}`;
      navigate(to);
    } else {
      try {
        const { promise, cancel } = getSourceTaxon({ sourceId: key, datasetKey: taxon.datasetKey });
        const req = await promise;
        const gbifTaxonKey = req?.data?.taxonBySourceId?.key;
        if (gbifTaxonKey) {
          let { to } = createLink({
            pageId: 'datasetKey',
            variables: { key: `${taxon.datasetKey}/species/${gbifTaxonKey}` },
          });
          if (!to) to = `/species/${key}`;
          navigate(to);
        }
      } catch (error) {}
    }
  };

  const getData = async () => {
    try {
      const { promise, cancel } = getBreakdown({ key: taxon.key });
      const { data, errors } = await promise;
      if (!data?.taxon?.checklistBankBreakdown) {
        if (errors?.[0]) {
          throw errors[0].message;
        } else {
          throw 'Unable to load breakdown';
        }
      }
      let root;
      if (
        data?.taxon?.checklistBankBreakdown?.length > 25 ||
        rankEnum.indexOf(taxon.rank) >= fmIndex ||
        (data?.taxon?.checklistBankBreakdown?.length === 0 && taxon.speciesCount > 0)
      ) {
        root = [
          {
            id: data.taxon.key,
            label: data.taxon?.scientificName,
            rank: data.taxon?.rank,
            species:
              taxon.speciesCount ||
              data.taxon?.checklistBankBreakdown?.reduce((acc, cur) => acc + cur?.species, 0),
            children: data.taxon?.checklistBankBreakdown,
          },
        ];
      } else {
        root = data.taxon?.checklistBankBreakdown;
      }
      initChart(root);
    } catch (error) {
      setError(error);
    }
  };

  const processChildren = (children) => {
    if (children.length < 100) {
      return children;
    } else {
      return children.slice(0, 100);
    }
  };

  const initChart = (root) => {
    const totalCount = root.reduce((acc, cur) => acc + cur?.species, 0);
    try {
      const colors = Highcharts.getOptions().colors;
      const categories = root.map((t) => t.name);
      const data = root.map((k, idx) => {
        const children_ = isArray(k.children) ? k.children : k.children.results;
        const children = processChildren(children_ || []);
        const sum = (children_ || []).reduce((acc, cur) => acc + cur?.species, 0);
        const c =
          sum < k?.species
            ? [
                ...children,
                {
                  name: `Other / Unknown ${children?.[0]?.rank || ''}`,
                  species: k?.species - sum,
                  color: chartColors.OTHER,
                },
              ]
            : children;

        return {
          color: k.color || colors?.[idx],
          y: k?.species,
          _id: k.id,
          drilldown: {
            name: k.name, //  k.name,
            categories: c.map((c) => c.name),
            data: c,
          },
        };
      });
      const rootData = [];
      const childData = [];
      let i;
      let j;
      const dataLen = data.length;
      let drillDataLen;
      let brightness;

      // Build the data arrays
      for (i = 0; i < dataLen; i += 1) {
        // add browser data
        rootData.push({
          name: categories[i],
          y: data[i].y,
          _id: data[i]._id,
          color: data[i].color,
        });

        // add version data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
          brightness = 0.2 - j / drillDataLen / 5;
          childData.push({
            name: data[i].drilldown.categories[j],
            y: data[i].drilldown.data[j]?.species,
            _id: data[i].drilldown.data[j].id,
            color: data[i].drilldown.data[j].color
              ? data[i].drilldown.data[j].color
              : Highcharts.color(data[i].color).brighten(brightness).get(),
          });
        }
      }
      const options = {
        chart: {
          type: 'pie',
        },
        credits: {
          enabled: false,
        },
        title: {
          text: '',
        },
        plotOptions: {
          pie: {
            shadow: false,
            center: ['50%', '50%'],
          },
        },
        tooltip: {},
        series: [
          {
            name: 'Species',
            data: rootData,
            size: '60%',
            dataLabels: {
              formatter: function () {
                return this.y > totalCount / 10 ? this.point.name : null;
              },
              distance: -30,
            },
            point: {
              events: {
                click: (e) => {
                  if (e.point._id) {
                    navigateToTaxon(e.point._id);
                  }
                },
              },
            },
          },
          {
            name: 'species',
            data: childData,
            size: '80%',
            innerSize: '60%',
            point: {
              events: {
                click: (e) => {
                  if (e.point._id) {
                    navigateToTaxon(e.point._id);
                  }
                },
              },
            },
            dataLabels: {
              formatter: function () {
                // display only if larger than 1
                return this.y > 1
                  ? '<b>' + this.point.name + ':</b> ' + this.y.toLocaleString('en-GB')
                  : null;
              },
            },
            id: 'species',
          },
        ],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 400,
              },
              chartOptions: {
                series: [
                  {},
                  {
                    id: 'species',
                    dataLabels: {
                      enabled: false,
                    },
                  },
                ],
              },
            },
          ],
        },
        exporting: {
          chartOptions: {
            // specific options for the exported image
            plotOptions: {
              series: {
                dataLabels: {
                  enabled: true,
                },
              },
            },
          },
          fallbackToExportServer: false,
        },
      };

      setChartOptions(options);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card loading={!chartOptions && !error} {...props}>
      <CardHeader options={null}>
        <CardTitle>
          <FormattedMessage id="taxon.breakdown" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage id="taxon.numberOfSpecies" defaultMessage="Number of species" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!error && (
          <HighchartsReact highcharts={Highcharts} options={chartOptions} className={chartsClass} />
        )}
        {error && (
          <ErrorBlock
            errorMessage={<FormattedMessage id="taxon.errors.breakdown" />}
            description={error}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TaxonBreakdown;
