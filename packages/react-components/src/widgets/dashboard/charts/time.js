export function getTimeSeriesOptions({ serie, onClick, interactive, translations }) {
  const categories = serie?.data?.map(x => x.name);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    chart: {
      height: 300,
      animation: false,
      type: 'column'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>',
      followPointer: false
    },
    plotOptions: {
      series: {
        color: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1
          },
          stops: [
            [0, 'var(--primary)'],
            [1, 'var(--primary200)']
          ]
        },
        borderWidth: 0,
        // shadow: {
        //   color: '#000',
        //   width: 3,
        //   opacity: 0.1,
        //   offsetX: 0,
        //   offsetY: 0
        // }
      },
      column: {
        allowPointSelect: interactive,
        animation: false,
        cursor: interactive ? 'pointer' : 'default',
        dataLabels: {
          enabled: false
        },
        showInLegend: true,
        point: interactive ? {
          events: {
            click: function () {
              onClick({ filter: this.filter, name: this.name, count: this.y }, this)
            }
          }
        } : {}
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      labels: { 
        enabled: true
    },
      // crosshair: true,//!!categories && data.results.length > 1,
      // labels: {
      //   formatter: function () {
      //     return truncate(this.value, 50);
      //   }
      // },
      lineColor: '#d0d2da',
    },
    yAxis: {
      title: {
        text: translations.occurrences || 'Occurrences'
      },
      gridLineDashStyle: 'LongDash',
      lineColor: '#d0d2da',
    },
    series: [serie],
    exporting: {
      buttons: {
        contextButton: {
          enabled: false
        }
      }
    },
    legend: {
      enabled: false,
      itemStyle: {
        width: '200px',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }
    }
  }
  return options;
}