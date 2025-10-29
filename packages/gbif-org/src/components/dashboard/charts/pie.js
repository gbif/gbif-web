export function getPieOptions({ serie, onClick, interactive, colors }) {
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
                click: function () {
                  onClick({ filter: this.filter, name: this.name, count: this.y }, this);
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
      itemStyle: {
        width: '200px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      },
    },
  };
  return options;
}
