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

type GetTimeSeriesOptionsArgs = {
  serie: Serie;
  onClick?: (event: ChartClickEvent, point: unknown) => void;
  interactive?: boolean;
  translations: { occurrences?: string };
};

export function getTimeSeriesOptions({
  serie,
  onClick,
  interactive,
  translations,
}: GetTimeSeriesOptionsArgs) {
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
      followPointer: false,
    },
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
      type: 'datetime',
      labels: {
        enabled: true,
      },
      lineColor: '#d0d2da',
    },
    yAxis: {
      title: {
        text: translations.occurrences || 'Occurrences',
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
