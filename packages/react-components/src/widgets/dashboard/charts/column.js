export function getColumnOptions({ serie, onClick, interactive }) {
  const categories = serie?.data?.map(x => x.name);
  const options = {
    chart: {
      height: 300,
      animation: false,
      type: 'column'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>'
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
      // categories: categories,
      labels: { 
        enabled: true,
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
        text: 'occurrences'
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

function getSerie(data, translations) {
  // Map data and keep empty slices. We could remove empty slices, but that would mean that the legend would change on updates
  var d = data.results.map(function (e) {
    return {
      name: e.displayName,
      filter: e.filter,
      y: e.count,
      visible: e.count > 0 // disable empty pie slices - this is to make it easier to read the legend.
    };
  });

  if (data.diff > 0) {
    d.push({
      name: translations.otherOrUknown || 'other or unknown',
      y: data.diff
    });
  }

  var serie = {
    name: translations.occurrences || 'Occurrences',
    data: d
  };
  return serie;
}

// function to truncate long strings so that they end with an ellipsis
function truncate(str, maxLength) {
  // test that it is a string, else do nothing
  if (typeof str !== 'string') {
    return str;
  }
  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength) + '...';
}