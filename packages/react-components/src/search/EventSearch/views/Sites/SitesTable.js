import React, {useContext, useEffect, useState} from "react";
import styles from './styles';
import ThemeContext from "../../../../style/themes/ThemeContext";
import {DataTable} from "../../../../components";
import {Skeleton} from "../../../../components";
import { FormattedMessage } from "react-intl";
import {useGraphQLContext} from "../../../../dataManagement/api/GraphQLContext";


function SitesTableSkeleton() {
      return <div className="grid-container">
        <div className="grid">
          <div className="legend">
            <Skeleton width="random" />
          </div>
          <div className="header">
            <Skeleton width="random" style={{ height: '1.5em' }} />
          </div>
          <div className="sidebar">
            <Skeleton width="random" />
            <Skeleton width="random" />
            <Skeleton width="random" />
          </div>
          <div className="main-grid">
            <Skeleton width="random" />
            <Skeleton width="random" />
            <Skeleton width="random" />
          </div>
      </div>
    </div>
}

export const SitesTable = ({ query, first, prev, next, size, from, results, loading, setSiteIDCallback, showMonth }) => {

  const theme = useContext(ThemeContext);
  const [fixedColumn, setFixed] = useState(true);
  const fixed = fixedColumn;
  const [siteMatrix, setSiteMatrix] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [years, setYears] = useState([]);
  const [totalPoints, setTotalPoints] = useState([]);

  const {details, setQuery} = useGraphQLContext();
  useEffect(() => {
    setQuery({ query, size, from });
  }, [query, size, from]);

  Array.range = (start, end) => Array.from({length: (end + 1 - start)}, (v, k) => k + start);

  function renderMatrix(){

    setYears([]);
    setSiteMatrix([]);
    setSiteData([]);
    setTotalPoints(0);
    
    let items = results;
    if (items && items.results?.temporal?.locationID?.results){

      let site_data = items.results.temporal.locationID?.results;
      let all_years = [];
      site_data.map(obj => obj.breakdown).forEach( breakdown => {
          breakdown.forEach( yearGroup => {
            all_years.push(yearGroup.y);
          })
        }
      )

      let earliest_year = Math.min(...all_years);
      let latest_year = Math.max(...all_years);
      let year_range = [];
      if (earliest_year == latest_year){
        year_range = [earliest_year];
      } else {
        year_range = Array.range(earliest_year, latest_year);
      }

      let no_of_squares_in_row = year_range.length * 12;
      let total_no_points = no_of_squares_in_row * site_data.length;

      // build 3d array site_matrix[site][year][month]
      let  site_matrix = new Array(site_data.length);
      for (var i = 0; i < site_matrix.length; i++){
          var years_arr = new Array(year_range.length);
          for (var j = 0; j < year_range.length; j++){
             if (showMonth){
              years_arr[j] = new Array(12).fill(0);
             } else {
              years_arr[j] = new Array(1).fill(0);
             }
          }
          site_matrix[i] = years_arr;
      }
      
      site_data.forEach( (site, site_index) => {

        // row per site
        year_range.forEach( (year, year_idx) => {
          // get the data for the year
          let yearBreakdown = site.breakdown.filter( breakdown => breakdown.y == year);
          if (yearBreakdown && yearBreakdown.length == 1) {
            if (showMonth) {
              if (yearBreakdown[0].ms) {
                yearBreakdown[0].ms.forEach(ms_month =>
                  site_matrix[site_index][year_idx][ms_month.m - 1] = ms_month.c
                );
              }
            } else {
              site_matrix[site_index][year_idx] = [yearBreakdown[0].c];
            }
          }
        })
      })

      setYears(year_range);
      setSiteMatrix(site_matrix);
      setSiteData(site_data);
      setTotalPoints(total_no_points);
    }
  }

  useEffect(() => {
    renderMatrix();
  }, [showMonth]);


  if (!results.results.temporal.locationID?.results || results.results.temporal.locationID?.results.length == 0){
    return <><div>No site data available</div></>
  }

  if (!siteMatrix || siteMatrix.length == 0){
    return <SitesTableSkeleton />
  }

  return <>
      <DataTable fixedColumn={fixed} {...{ first, prev, next, size, from, total: totalPoints, loading }} style={{ flex: "1 1 auto", height: 100, display: 'flex', flexDirection: 'column' }}>
        <tbody>
          <tr css={ styles.sites({ noOfSites: siteMatrix.length, noOfYears: years.length, showMonth: showMonth, theme }) }>
            <td className="grid-container">
              <div className="grid">
                <div className="legend">
                  <FormattedMessage id="eventDetails.siteTableLegend"/>
                </div>
                <div className="header">
                  <div className="header-grid">
                    { years.map(obj => <ul><li key={`y_${obj}`}>{obj}</li></ul>) }
                  </div>                     
                </div>
                <div className="sidebar">
                  <div className="sidebar-grid">   
                   { siteData.map( (obj, i) => <ul><li key={`s_${i}`} onClick={() => { setSiteIDCallback({locationID: obj.key}); }}>{obj.key}</li></ul>) }
                  </div>
                </div>
                <div className="main-grid">
                  <SitesDataGrid siteMatrix={siteMatrix} siteData={siteData} years={years} setSiteIDCallback={setSiteIDCallback} showMonth={showMonth} />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </DataTable>
  </>
}

export const SitesDataGrid = ({ siteMatrix, siteData, years, setSiteIDCallback, showMonth }) => {

  return <div className="data-grid">
  {
    siteMatrix.map( (siteRow, site_idx) =>
      siteRow.map( (year_cell, year_idx) =>
        <ul className="year-grid" key={`${site_idx}_${year_idx}`}>
          {   
            year_cell.map( (month_cell, month_idx) =>
                <li className={`${month_idx}_col`}
                    id={`${site_idx}_${year_idx}_${month_idx}`}
                    key={`${site_idx}_${year_idx}_${month_idx}`}
                    data-level={ month_cell > 0 ? '3': '0'}
                    onClick={() => { setSiteIDCallback({locationID: siteData[site_idx].key, year: years[year_idx], month: showMonth ? month_idx + 1 : -1}); }}
                >
                  <SitesDataGridTooltip
                      key={`${site_idx}_${year_idx}_${month_idx}_tt`}
                      month_cell={month_cell}
                      month_idx={month_idx}
                      site_id={siteData[site_idx].key}
                      year={years[year_idx]}
                      showMonth={showMonth} />
                </li>
            )
          }
        </ul>
      )
    )
  }
  </div>
}

export const SitesDataGridTooltip = ({ month_cell, month_idx, site_id, year, showMonth }) => {
  if (month_cell > 0 ){
    return <span className="tooltiptext">
      <FormattedMessage id="eventDetails.siteTooltip"
          values={ {count: month_cell, site: site_id, date: ((showMonth ? ((month_idx + 1) + '/') : '') + year) } }  />
      </span>;
  }
  return null;
}

export default SitesTable;