import Highcharts from 'highcharts'

// demo of how to use patterns in highcharts https://codesandbox.io/s/highcharts-react-demo-rkleb?file=/demo.jsx:244-272
// also a blog post https://www.highcharts.com/blog/products/highcharts/pattern-fill-plugin/
import HC_patternFill from 'highcharts-pattern-fill';
HC_patternFill(Highcharts);

// const colorWheel = ['#003f5c','#2f4b7c','#665191','#a05195','#d45087','#f95d6a','#ff7c43','#ffa600','#cea400','#a19f08','#789523','#558935','#357b41','#1a6c49','#095c4b'];
const colorWheel = ['#003f5c','#2f4b7c','#665191','#a05195','#d45087','#f95d6a','#ff7c43','#ffa600','#cea400','#a19f08','#789523','#558935'];
const bluePurpleGradient = ['#1fa7fe', '#879dff', '#cb8ef8', '#fe7cd9', '#ff70ad', '#ff757c', '#ff8b48', '#ffa600'];
const pinkYellowGradient = [
  '#609696',
  '#f9cdcc',
  '#ffe0de',
  '#f0bc68',
  '#ffd086',
  '#c1cad0',
  '#abb7bd',
  '#f5d1c3',
  '#ffbaa8',
  '#c6d7d1',
];
const fallbackPalette = colorWheel;
const userPalette = [];

// a palette should have at least 6 colors, if less is provided as a userPalette, then use the fallbackPalette. 
const palette = userPalette.length < 6 ? fallbackPalette : userPalette;

{/* <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M10 15a5 5 0 110-10 5 5 0 010 10z'  stroke-width='1' stroke='hsla(258.5,59.4%,59.4%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)'/></svg> */ }
// patterns via <a href="https://www.freepik.com/free-vector/cute-pattern-background-polka-dot-black-white-vector-set_20346212.htm#query=svg%20patterns&position=19&from_view=keyword&track=ais">Image by rawpixel.com</a> on Freepik
Highcharts.theme = {
  defs: {
    patterns: [
      {
        id: "unknown1",
        path: {
          d: "M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9",
          stroke: "#FFFFFF",
          strokeWidth: 2,
          fill: "#aaa"
        }
      },
      {
        id: "unknown2",
        path: {
          d: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
          stroke: "#FFFFFF",
          strokeWidth: 2,
          fill: "#aaa"
        },
        width: 5,
        height: 5
      },
      {
        id: "other1",
        path: {
          d: 'M 0 5 L 5 0 M -0.5 0.5 L 0.5 -0.5 M 4.5 5.5 L 5.5 4.5',
          stroke: "#FFFFFF",
          strokeWidth: 1,
          fill: "#555"
        },
        width: 5,
        height: 5
      },
      {
        id: "dots",
        path: {
          d: "M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0",
          stroke: "#FFFFFF",
          strokeWidth: 2,
          fill: palette[0],
          icon: <div />
        }
      },
      {
        id: "custom-pattern",
        path: {
          d: "M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11",
          stroke: palette[0],
          strokeWidth: 3
        }
      },
      {
        id: "slope-right-tight",
        path: {
          d: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
          stroke: palette[1],
          strokeWidth: 2
        },
        width: 5,
        height: 5
      },
      {
        id: "slope-left-tight",
        path: {
          d: 'M 0 5 L 5 0 M -0.5 0.5 L 0.5 -0.5 M 4.5 5.5 L 5.5 4.5',
          stroke: palette[2],
          strokeWidth: 2
        },
        width: 5,
        height: 5
      },
      {
        id: "vertical-thick",
        path: {
          d: 'M 2 0 L 2 5 M 4 0 L 4 5',
          stroke: palette[3],
          strokeWidth: 2
        },
        width: 5,
        height: 5
      },


      {
        id: "horisontal-thick",
        path: {
          d: 'M 0 2 L 5 2 M 0 4 L 5 4',
          stroke: palette[4],
          strokeWidth: 2
        },
        width: 5,
        height: 5
      },
      {
        id: "circles",
        path: {
          d: 'M 5 5 m -4 0 a 4 4 0 1 1 8 0 a 4 4 0 1 1 -8 0',
          stroke: palette[4],
          strokeWidth: 2,
          fill: palette[4],
        },
        width: 10,
        height: 10
      },
      {
        id: "slope-down-thin",
        path: {
          d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
          stroke: palette[5],
          strokeWidth: 2,
        },
        width: 10,
        height: 10
      },
      {
        id: "slope-up-thin",
        path: {
          d: 'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9',
          stroke: palette[6],
          strokeWidth: 2,
        },
        width: 10,
        height: 10
      },
      {
        id: "wave",
        path: {
          d: 'M 0 0 L 5 10 L 10 0',
          stroke: palette[6],
          strokeWidth: 2,
          fill: palette[0],
        },
        width: 10,
        height: 10
      },

      {
        id: "squares",
        path: {
          d: 'M 3 3 L 8 3 L 8 8 L 3 8 Z',
          stroke: palette[7],
          strokeWidth: 2,
          fill: palette[0],
        },
        width: 10,
        height: 10
      },
      {
        id: "custom-pattern3",
        path: {
          // d: "M3.25 10h13.5M10 3.25v13.5",
          d: "M10 15a5 5 0 110-10 5 5 0 010 10z",
          stroke: palette[0],
          strokeWidth: 2
        },
        width: 20,
        height: 20,
        stroke: 'red',
        strokeWidth: 2
      }
    ]
  },
  colors: [
    ...palette,
    'url(#slope-left-tight)',
    'url(#slope-right-tight)',
    'url(#vertical-thick)',
    'url(#horisontal-thick)',
    'url(#wave)',
    'url(#squares)',
    'url(#circles)',
    'url(#slope-down-thin)',
    'url(#slope-up-thin)',
    'url(#dots)',
  ],
  chart: {
    // backgroundColor: {
    //    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
    //    stops: [
    //        [0, '#2a2a2b'],
    //        [1, '#3e3e40']
    //    ]
    // },
    style: {
      // fontFamily: 'Roboto, sans-serif'
    },
    plotBorderColor: '#606063'
  },
  title: {
    style: {
      color: '#666',
      fill: '#666',
      textTransform: 'uppercase',
      fontSize: '12px'
    }
  },
  subtitle: {
    style: {
      color: '#666',
      fontSize: '12px'
    }
  },
  xAxis: {
    lineColor: '#d0d2da',
    gridLineDashStyle: 'LongDash',
    labels: {
      style: {
        color: '#6c717d'
      }
    },
    //  gridLineColor: '#707073',
    //  lineColor: '#707073',
    //  minorGridLineColor: '#505053',
    //  tickColor: '#707073',
    //  title: {
    //      style: {
    //          color: '#A0A0A3'

    //      }
    //  }
  },
  yAxis: {
    lineColor: '#d0d2da',
    gridLineDashStyle: 'LongDash',
    labels: {
      style: {
        color: '#6c717d'
      }
    },
    //  gridLineColor: '#707073',
    //  labels: {
    //      style: {
    //          color: '#E0E0E3'
    //      }
    //  },
    //  lineColor: '#707073',
    //  minorGridLineColor: '#505053',
    //  tickColor: '#707073',
    //  tickWidth: 1,
    //  title: {
    //      style: {
    //          color: '#A0A0A3'
    //      }
    //  }
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    style: {
      color: '#F0F0F0'
    }
  },
  plotOptions: {
    series: {
      dataLabels: {
        color: '#666'
      },
      marker: {
        lineColor: '#333'
      }
    },
    boxplot: {
      fillColor: '#505053'
    },
    candlestick: {
      lineColor: 'white'
    },
    errorbar: {
      color: 'white'
    }
  },
  legend: {
    symbolHeight: 24,
    symbolWidth: 24,
    symbolRadius: 2,
    itemMarginTop: 12,
    itemStyle: {
      color: '#606063',
      fontWeight: 'normal'
    },
    itemHoverStyle: {
      color: '#8d8f92'
    },
    itemHiddenStyle: {
      color: '#bec5d0'
    }
  },
  credits: {
    style: {
      color: '#666'
    }
  },
  labels: {
    style: {
      color: '#707073'
    }
  },

  drilldown: {
    activeAxisLabelStyle: {
      color: '#F0F0F3'
    },
    activeDataLabelStyle: {
      color: '#F0F0F3'
    }
  },

  responsive: true,
  maintainAspectRatio: false,

  navigation: {
    buttonOptions: {
      symbolStroke: '#666',
      theme: {
        // fill: '#f00'
        // fill: '#505053'
      }
    }
  },

  // scroll charts
  rangeSelector: {
    buttonTheme: {
      fill: '#505053',
      stroke: '#000000',
      style: {
        color: '#CCC'
      },
      states: {
        hover: {
          fill: '#707073',
          stroke: '#000000',
          style: {
            color: 'white'
          }
        },
        select: {
          fill: '#000003',
          stroke: '#000000',
          style: {
            color: 'white'
          }
        }
      }
    },
    inputBoxBorderColor: '#505053',
    inputStyle: {
      backgroundColor: '#333',
      color: 'silver'
    },
    labelStyle: {
      color: 'silver'
    }
  },

  navigator: {
    handles: {
      backgroundColor: '#666',
      borderColor: '#AAA'
    },
    outlineColor: '#CCC',
    maskFill: 'rgba(255,255,255,0.1)',
    series: {
      color: '#7798BF',
      lineColor: '#A6C7ED'
    },
    xAxis: {
      gridLineColor: '#505053'
    }
  },

  scrollbar: {
    barBackgroundColor: '#808083',
    barBorderColor: '#808083',
    buttonArrowColor: '#CCC',
    buttonBackgroundColor: '#606063',
    buttonBorderColor: '#606063',
    rifleColor: '#FFF',
    trackBackgroundColor: '#404043',
    trackBorderColor: '#404043'
  },

  // special colors for some of the
  legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
  background2: '#505053',
  dataLabelsColor: '#666',
  textColor: '#C0C0C0',
  contrastTextColor: '#F0F0F3',
  maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);

export default Highcharts;