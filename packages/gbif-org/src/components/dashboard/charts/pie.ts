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

type GetPieOptionsArgs = {
  serie: Serie;
  onClick?: (event: ChartClickEvent, point: unknown) => void;
  interactive?: boolean;
  colors?: unknown[];
  isRtl?: boolean;
};

export function getPieOptions({ serie, onClick, interactive, colors, isRtl }: GetPieOptionsArgs) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    chart: {
      height: 400,
      animation: false,
      type: 'pie',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    colors,
    plotOptions: {
      pie: {
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
      visible: false,
    },
    yAxis: {
      visible: false,
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
      floating: false,
      rtl: isRtl,
      itemStyle: {
        width: '200px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      },
    },
  };
  return options;
}
