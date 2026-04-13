import Highcharts from '@/components/dashboard/charts/highcharts';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { TaxonBreakdown2Query, TaxonBreakdown2QueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

const TAXON_BREAKDOWN = /* GraphQL */ `
  query TaxonBreakdown2($key: ID!, $datasetKey: ID!) {
    taxonInfo(key: $key, datasetKey: $datasetKey) {
      taxon {
        key: taxonID
        rank: taxonRank
        scientificName
        checklistBankBreakdown: breakdown(sortByCount: true) {
          id: taxonID
          name: scientificName
          rank: taxonRank
          species
          children: breakdown {
            id: taxonID
            name: scientificName
            rank: taxonRank
            species
            children: breakdown {
              id: taxonID
              name: scientificName
              rank: taxonRank
              species
            }
          }
        }
      }
    }
  }
`;

type Props = {
  taxonKey: string;
  datasetKey: string;
};

type BreakdownNode = NonNullable<
  NonNullable<NonNullable<TaxonBreakdown2Query['taxonInfo']>['taxon']>['checklistBankBreakdown']
>;

type BreakdownChartProps = {
  breakdown: BreakdownNode;
};

function BreakdownChart({ breakdown }: BreakdownChartProps) {
  const chartOptions = useMemo((): Highcharts.Options => {
    const themeColors = (Highcharts.getOptions().colors ?? []) as string[];

    const children = (breakdown.children ?? []).filter(
      (c): c is NonNullable<typeof c> => c != null
    );

    const innerData: Highcharts.PointOptionsObject[] = [];
    const outerData: Highcharts.PointOptionsObject[] = [];
    const totalSpecies = children.reduce((sum, c) => sum + (c.species ?? 0), 0);

    children.forEach((child, idx) => {
      const color = themeColors[idx % themeColors.length];
      const parentSpecies = child.species ?? 0;
      innerData.push({ name: child.name ?? '', y: parentSpecies, color });

      const grandchildren = (child.children ?? []).filter(
        (g): g is NonNullable<typeof g> => g != null
      );
      const grandchildrenSum = grandchildren.reduce((sum, g) => sum + (g.species ?? 0), 0);
      const count = grandchildren.length;

      grandchildren.forEach((grandchild, jdx) => {
        // brighten from +0.3 (light) to -0.3 (dark) across siblings
        const brightness = count > 1 ? 0.3 - (jdx / (count - 1)) * 0.6 : 0;
        outerData.push({
          name: grandchild.name ?? '',
          y: grandchild.species ?? 0,
          color: Highcharts.color(color).brighten(brightness).get() as string,
        });
      });

      // Filler slice so the outer ring always covers the same angular span as its parent inner slice.
      // When there are no children at all, use the parent color so the ring looks seamless.
      // When children exist but don't account for all species, add a visible "Other" remainder.
      const remainder = parentSpecies - grandchildrenSum;
      if (remainder > 0) {
        const isBlank = grandchildren.length === 0;
        outerData.push({
          name: isBlank ? '' : `Other ${child.name ?? ''}`,
          y: remainder,
          color: isBlank
            ? (color as string)
            : (Highcharts.color(color).brighten(-0.4).get() as string),
          dataLabels: { enabled: false },
        });
      }
    });

    return {
      chart: { type: 'pie' },
      title: { text: '' },
      credits: { enabled: false },
      plotOptions: {
        pie: { shadow: false, center: ['50%', '50%'] },
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '<b>{point.name}</b>: {point.y} species',
      },
      series: [
        {
          type: 'pie',
          name: 'Species',
          data: innerData,
          size: '60%',
          dataLabels: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: function (this: any) {
              return (this.y ?? 0) > totalSpecies / 10 ? this.point.name : null;
            },
            distance: -30,
          },
        },
        {
          type: 'pie',
          name: 'Species',
          data: outerData,
          size: '80%',
          innerSize: '60%',
          dataLabels: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: function (this: any) {
              return (this.y ?? 0) > 1
                ? `<b>${this.point.name}:</b> ${(this.y as number).toLocaleString('en-GB')}`
                : null;
            },
          },
        },
      ],
    };
  }, [breakdown]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}

function BreakdownContent({ taxonKey, datasetKey }: Props) {
  const { data, loading } = useQuery<TaxonBreakdown2Query, TaxonBreakdown2QueryVariables>(
    TAXON_BREAKDOWN,
    { variables: { key: taxonKey, datasetKey } }
  );

  const breakdown = data?.taxonInfo?.taxon?.checklistBankBreakdown;

  return (
    <Card className="g-mb-4" id="breakdown">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.breakdown" defaultMessage="Breakdown" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading...</p>}
        {breakdown && <BreakdownChart breakdown={breakdown} />}
      </CardContent>
    </Card>
  );
}

export default function BreakdownCard({ taxonKey, datasetKey }: Props) {
  return (
    <ErrorBoundary
      type="BLOCK"
      errorMessage={
        <FormattedMessage id="taxon.errors.breakdown" defaultMessage="Failed to load breakdown" />
      }
    >
      <BreakdownContent taxonKey={taxonKey} datasetKey={datasetKey} />
    </ErrorBoundary>
  );
}
