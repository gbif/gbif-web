type ChartPoint = {
  filter?: Record<string, unknown>;
  name?: unknown;
  y?: number;
};

type ChartClickEvent = { filter?: Record<string, unknown>; name?: unknown; count?: number };

type Serie = {
  name?: unknown;
  data?: ChartPoint[];
  [key: string]: unknown;
};

type GetColumnOptionsArgs = {
  serie: Serie;
  onClick?: ((event: ChartClickEvent, point: unknown) => void) | undefined;
  interactive?: boolean;
  translations?: { occurrences?: string };
  colors?: unknown[];
};

export function getColumnOptions({
  serie,
  onClick,
  interactive,
  translations,
  colors,
}: GetColumnOptionsArgs) {
  const categories = serie?.data?.map((x) => x.name);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    chart: {
      height: 300,
      animation: false,
      type: 'column',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>',
    },
    colors,
    plotOptions: {
      series: {
        color: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, 'rgb(var(--primary))'],
            [1, 'rgb(var(--primary200))'],
          ],
        },
        borderWidth: 0,
      },
      column: {
        allowPointSelect: interactive,
        animation: false,
        cursor: interactive ? 'pointer' : 'default',
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
        point: interactive
          ? {
              events: {
                click: function (this: ChartPoint) {
                  onClick?.(
                    { filter: this.filter, name: this.name, count: this.y },
                    this
                  );
                },
              },
            }
          : {},
      },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: categories,
      crosshair: true,
      labels: {
        formatter: function (this: { value: unknown }) {
          return truncate(this.value, 50);
        },
      },
      lineColor: '#d0d2da',
    },
    yAxis: {
      title: {
        text: translations?.occurrences || 'Occurrences',
      },
      gridLineDashStyle: 'LongDash',
      lineColor: '#d0d2da',
    },
    series: [serie],
    exporting: {
      buttons: {
        contextButton: {
          enabled: false,
        },
      },
    },
    legend: {
      enabled: false,
      itemStyle: {
        width: '200px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      },
    },
  };
  return options;
}

function truncate(str: unknown, maxLength: number): unknown {
  if (typeof str !== 'string') {
    return str;
  }
  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength) + '...';
}
