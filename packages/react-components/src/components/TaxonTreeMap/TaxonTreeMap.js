import React, {useContext, useState} from "react";
import Chart from "react-apexcharts";
import ThemeContext from "../../style/themes/ThemeContext";
import {Button} from "reakit/Button";

const TaxonTreeMap = ({ initialData, initialPath, onSelection, resetCallback }) => {

  const theme = useContext(ThemeContext);

  const convertToSeries = (data) => {
    const dataElements = data.map( ({ key, count, value }) => {
      return {
        x: key,
        y: count ? count : value
      }
    });
    return [{ data: dataElements }];
  }

  const [series, setSeries] = useState(convertToSeries(initialData));
  const [currentPath, setCurrentPath] = useState(initialPath);

  const reset = () => {
    setSeries(convertToSeries(initialData));
    setCurrentPath(initialPath);
    resetCallback();
  }

  const options = {
    chart: {
      type: "treemap",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          let selectedIndex = config.dataPointIndex;
          onSelection(selectedIndex, (updatedData, updatedPath) => {
            setSeries(convertToSeries(updatedData));
            setCurrentPath(updatedPath);
          });
        }
      }
    },
    legend: {
      show: true
    },
    plotOptions: {
      treemap: {
        enableShades: false,
        distributed: true,
        colorScale: {
          ranges: [
            {
              from: 1,
              to: 1000000,
              color: theme.colorRangeStart
            },
            {
              from: 1000000,
              to: 10000000000,
              color: theme.colorRangeEnd
            }
          ]
        }
      },
    }
  };
  return (
      <>
      <div style={{ paddingLeft: '5px', paddingTop: '8px', fontSize: '14px' }}>
        <span>{currentPath.map(taxon=> {return taxon.name;}).join(' → ')}</span>
      </div>
      <Chart
          options={options}
          series={series}
          type="treemap"
      />
      <Button look="primaryOutline" style={{ fontSize: '11px' }} onClick={() => reset()}>
        Reset
      </Button>
      <span style={{marginLeft: '50px'}}><b>Tip:</b> Click the boxes in the chart to explore different taxonomic groups</span>
    </>
  );
};

export  { TaxonTreeMap };
