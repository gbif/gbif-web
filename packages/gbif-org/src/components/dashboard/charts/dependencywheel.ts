type ChartPoint = {
  filter?: Record<string, unknown>;
  name?: unknown;
  y?: number;
};

type ChartClickEvent = { filter?: Record<string, unknown>; name?: unknown; count?: number };

type Serie = {
  name?: string;
  data?: unknown[];
  [key: string]: unknown;
};

type GetDependencyWheelOptionsArgs = {
  serie: Serie;
  onClick?: (event: ChartClickEvent, point: unknown) => void;
  interactive?: boolean;
};

export function getDependencyWheelOptions({
  serie,
  onClick,
  interactive,
}: GetDependencyWheelOptionsArgs) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    chart: {
      height: 400,
      animation: false,
      type: 'dependencywheel',
    },
    plotOptions: {
      dependencywheel: {
        showInLegend: false,
        allowPointSelect: interactive,
        animation: false,
        cursor: interactive ? 'pointer' : 'default',
        dataLabels: {
          enabled: true,
        },
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
      itemStyle: {
        width: '200px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      },
    },
  };
  return options;
}
