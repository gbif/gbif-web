export function getDependencyWheelOptions({ serie, onClick, interactive }) {
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
          enabled: true
        },
        showInLegend: false,
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
    series: [serie],
    exporting: {
      buttons: {
        contextButton: {
          enabled: false
        }
      }
    },
    legend: {
      floating: false,
      itemStyle: {
        width: '200px',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }
    }
  }
  return options;
}