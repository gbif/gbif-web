import Highcharts, { chartPatterns } from '@/components/dashboard/charts/highcharts';
import { chartsClass } from '@/components/dashboard/charts/OneDimensionalChart';
import { CardHeader } from '@/components/dashboard/shared';
import { ErrorBlock } from '@/components/ErrorBoundary';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/smallCard';
import rankEnum from '@/enums/basic/rank.json';
import { useLink } from '@/reactRouterPlugins/dynamicLink';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { getBreakdown, getSourceTaxon } from './breakdownUtil';
const fmIndex = rankEnum.indexOf('FAMILY');

const MAX_CHILDREN = 20;
const TaxonBreakdown = ({
  taxon,
  ...props
}: {
  taxon: { taxonID: string; datasetKey: string; taxonRank: string };
}) => {
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const createLink = useLink();
  const navigate = useNavigate();

  const isBackbone = true; //taxon?.datasetKey === taxon?.taxonID;

  useEffect(() => {
    setChartOptions({});
    if (taxon.taxonID) {
      getData();
    }
  }, [taxon.taxonID]);

  const navigateToTaxon = async (key) => {
    if (isBackbone) {
      let { to } = createLink({
        pageId: 'taxonKey',
        variables: { key },
      });
      if (!to) to = `/taxon/${key}`;
      navigate(to);
    } else {
      try {
        const { promise, cancel } = getSourceTaxon({ sourceId: key, datasetKey: taxon.datasetKey });
        const req = await promise;
        const gbifTaxonKey = req?.data?.taxonBySourceId?.key;
        if (gbifTaxonKey) {
          let { to } = createLink({
            pageId: 'datasetKey',
            variables: { key: `${taxon.datasetKey}/taxon/${gbifTaxonKey}` },
          });
          if (!to) to = `/taxon/${key}`;
          navigate(to);
        }
      } catch (error) {}
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { promise, cancel } = getBreakdown({
        key: taxon.taxonID,
        datasetKey: taxon.datasetKey,
      });
      const { data, errors } = await promise;
      if (!data?.taxonInfo?.taxon?.checklistBankBreakdown) {
        if (errors?.[0]) {
          setError(errors[0].message);
        } else {
          setError('Unable to load breakdown');
        }
        return;
      }
      const root = data.taxonInfo?.taxon?.checklistBankBreakdown;
      initChart(root);
      setLoading(false);
      setError(null);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const initChart = (root) => {
    const totalCount = root.species || 0;
    try {
      const colors = Highcharts.getOptions().colors;

      // Filter out children with no species and sort by species count (descending)
      const validChildren = (root.children || [])
        .filter((child) => child && child.species && child.species > 0)
        .sort((a, b) => (b.species || 0) - (a.species || 0));

      // Take top MAX_CHILDREN and calculate remaining for "Other"
      const topChildren = validChildren.slice(0, MAX_CHILDREN);
      const remainingChildren = validChildren.slice(MAX_CHILDREN);
      const remainingSpeciesCount = remainingChildren.reduce(
        (sum, child) => sum + (child.species || 0),
        0
      );

      // Build simple pie chart data from top MAX_CHILDREN children
      const data = topChildren.map((child, idx) => ({
        name: child.name || 'Unknown',
        y: child.species || 0,
        _id: child.id,
        color: idx < (colors?.length || 0) ? colors?.[idx % colors?.length] : '#aaa',
      }));

      // Add "Other" category if there are remaining children
      if (remainingChildren.length > 0 && remainingSpeciesCount > 0) {
        data.push({
          name: 'Other',
          y: remainingSpeciesCount,
          _id: null, // No navigation for "Other"
          color: chartPatterns.OTHER,
        });
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
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              formatter: function () {
                // Only show label if slice is large enough (more than 2% of total)
                return this.y > totalCount * 0.02 ? this.point.name : null;
              },
            },
            showInLegend: false,
          },
        },
        tooltip: {
          pointFormat: '<b>{point.name}</b>: {point.y:,.0f} species ({point.percentage:.1f}%)',
        },
        series: [
          {
            name: 'Species',
            data: data,
            point: {
              events: {
                click: (e) => {
                  // Only navigate if there's an ID (not for "Other" category)
                  if (e.point._id) {
                    navigateToTaxon(e.point._id);
                  }
                },
              },
            },
          },
        ],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 400,
              },
              chartOptions: {
                plotOptions: {
                  pie: {
                    dataLabels: {
                      enabled: false,
                    },
                    showInLegend: false,
                  },
                },
              },
            },
          ],
        },
        exporting: {
          chartOptions: {
            plotOptions: {
              pie: {
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
    <Card loading={loading && !error} {...props}>
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
            type="BLOCK"
            errorMessage={error || <FormattedMessage id="taxon.errors.breakdown" />}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TaxonBreakdown;
