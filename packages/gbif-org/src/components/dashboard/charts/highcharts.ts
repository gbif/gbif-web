import Highcharts from 'highcharts';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import sunburst from 'highcharts/modules/sunburst';
import treemap from 'highcharts/modules/treemap';
// demo of how to use patterns in highcharts https://codesandbox.io/s/highcharts-react-demo-rkleb?file=/demo.jsx:244-272
// also a blog post https://www.highcharts.com/blog/products/highcharts/pattern-fill-plugin/
import HC_patternFill from 'highcharts/modules/pattern-fill';

type PatternColor = {
  pattern: {
    backgroundColor?: string;
    path: {
      d: string;
      stroke: string;
      strokeWidth: number;
    };
    width: number;
    height: number;
  };
};

type HighchartsWithTheme = typeof Highcharts & { theme?: Highcharts.Options };

const colorWheel: string[] = [
  '#003f5c',
  '#2f4b7c',
  '#665191',
  '#a05195',
  '#d45087',
  '#f95d6a',
  '#ff7c43',
  '#ffa600',
  '#cea400',
  '#a19f08',
  '#789523',
  '#558935',
];

const fallbackPalette: string[] = colorWheel;
const userPalette: string[] = [];

// a palette should have at least 6 colors, if less is provided as a userPalette, then use the fallbackPalette.
const palette: string[] = userPalette.length < 6 ? fallbackPalette : userPalette;

// The original implementation kept a SVG patterns list around for a (currently commented-out)
// section of `generateChartsPalette` that wrapped them around the user palette. It was unused
// at runtime when this was converted to TypeScript and has been removed; consult git history
// if you want to restore the pattern variants.

export function generateChartsPalette(userPalette: string[]): string[] {
  const palette: string[] =
    userPalette.length < 6
      ? [...userPalette, ...fallbackPalette.slice(0, 6 - userPalette.length)]
      : userPalette;
  return [...palette];
}

const highchartsWithTheme = Highcharts as HighchartsWithTheme;

highchartsWithTheme.theme = {
  colors: generateChartsPalette(palette),
  chart: {
    style: {},
    plotBorderColor: '#606063',
  },
  title: {
    style: {
      color: '#666',
      fill: '#666',
      textTransform: 'uppercase',
      fontSize: '12px',
    },
  },
  subtitle: {
    style: {
      color: '#666',
      fontSize: '12px',
    },
  },
  xAxis: {
    lineColor: '#d0d2da',
    gridLineDashStyle: 'LongDash',
    labels: {
      style: {
        color: '#6c717d',
      },
    },
  },
  yAxis: {
    lineColor: '#d0d2da',
    gridLineDashStyle: 'LongDash',
    labels: {
      style: {
        color: '#6c717d',
      },
    },
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    style: {
      color: '#F0F0F0',
    },
  },
  plotOptions: {
    series: {
      dataLabels: {
        color: '#666',
      },
      marker: {
        lineColor: '#333',
      },
    },
    boxplot: {
      fillColor: '#505053',
    },
    candlestick: {
      lineColor: 'white',
    },
    errorbar: {
      color: 'white',
    },
  },
  legend: {
    symbolHeight: 24,
    symbolWidth: 24,
    symbolRadius: 2,
    itemMarginTop: 12,
    itemStyle: {
      color: '#606063',
      fontWeight: 'normal',
    },
    itemHoverStyle: {
      color: '#8d8f92',
    },
    itemHiddenStyle: {
      color: '#bec5d0',
    },
  },
  credits: {
    style: {
      color: '#666',
    },
  },
  drilldown: {
    activeAxisLabelStyle: {
      color: '#F0F0F3',
    },
    activeDataLabelStyle: {
      color: '#F0F0F3',
    },
  },
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
          },
        },
      },
    ],
  },
  navigation: {
    buttonOptions: {
      symbolStroke: '#666',
      theme: {},
    },
  },
  rangeSelector: {
    buttonTheme: {
      fill: '#505053',
      stroke: '#000000',
      style: {
        color: '#CCC',
      },
      states: {
        hover: {
          fill: '#707073',
          stroke: '#000000',
          style: {
            color: 'white',
          },
        },
        select: {
          fill: '#000003',
          stroke: '#000000',
          style: {
            color: 'white',
          },
        },
      },
    },
    inputBoxBorderColor: '#505053',
    inputStyle: {
      backgroundColor: '#333',
      color: 'silver',
    },
    labelStyle: {
      color: 'silver',
    },
  },
  navigator: {
    handles: {
      backgroundColor: '#666',
      borderColor: '#AAA',
    },
    outlineColor: '#CCC',
    maskFill: 'rgba(255,255,255,0.1)',
    series: {
      color: '#7798BF',
      lineColor: '#A6C7ED',
    },
    xAxis: {
      gridLineColor: '#505053',
    },
  },
  scrollbar: {
    barBackgroundColor: '#808083',
    barBorderColor: '#808083',
    buttonArrowColor: '#CCC',
    buttonBackgroundColor: '#606063',
    buttonBorderColor: '#606063',
    rifleColor: '#FFF',
    trackBackgroundColor: '#404043',
    trackBorderColor: '#404043',
  },
} as Highcharts.Options;

// Apply the theme and additional modules
if (typeof Highcharts === 'object') {
  HC_patternFill(Highcharts);
  highchartsAccessibility(Highcharts);
  sunburst(Highcharts);
  treemap(Highcharts);
  if (highchartsWithTheme.theme) {
    Highcharts.setOptions(highchartsWithTheme.theme);
  }
}

export default Highcharts;

export const chartPatterns: Record<'OTHER' | 'UNKNOWN', PatternColor> = {
  OTHER: {
    pattern: {
      backgroundColor: '#eee',
      path: {
        d: 'M 0 5 L 5 0 M -0.5 0.5 L 0.5 -0.5 M 4.5 5.5 L 5.5 4.5',
        stroke: '#555',
        strokeWidth: 1,
      },
      width: 5,
      height: 5,
    },
  },
  UNKNOWN: {
    pattern: {
      path: {
        d: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
        stroke: '#bbb',
        strokeWidth: 2,
      },
      width: 5,
      height: 5,
    },
  },
};
