import React, {useContext, useState} from "react";
import Chart from "react-apexcharts";
import ThemeContext from "../../style/themes/ThemeContext";
import {Button} from "reakit/Button";

const TaxonChart = ({ initialData, initialPath, onSelection, resetCallback }) => {

  const theme = useContext(ThemeContext);
  const convertToSeries = (data) => {
    const dataElements = data.map( ({ label, key, count, value }) => {
      return {
        label: label,
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
              color: '#76818E' //theme.colorRangeStart
            },
            {
              from: 1000000,
              to: 10000000000,
              color: '#c44d34' //theme.colorRangeEnd
            }
          ]
        }
      },
    }
  };

  return (
      <>
      <span style={{ marginTop: '10px'}}>{currentPath.map(taxon=> {return taxon.name;}).join(' → ')}</span>
      <Chart
          options={options}
          series={series}
          type="treemap"
      />
      <Button look="primaryOutline" style={{ fontSize: '11px' }} onClick={() => reset()}>
        Reset
      </Button>
    </>
  );
};

export { TaxonChart };
