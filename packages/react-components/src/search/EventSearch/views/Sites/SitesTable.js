import React, {useContext, useEffect, useState} from "react";
import styles from './styles';
import ThemeContext from "../../../../style/themes/ThemeContext";
import {DataTable} from "../../../../components";

export const SitesTable = ({ first, prev, next, size, from, results, loading, setSiteIDCallback, showMonth }) => {

  const theme = useContext(ThemeContext);
  const [fixedColumn, setFixed] = useState(true);
  const fixed = fixedColumn;

  Array.range = (start, end) => Array.from({length: (end + 1 - start)}, (v, k) => k + start);

  let site_data = [];
  let no_of_sites = 0;
  let no_of_years = 0;
  let years = [];
  let no_of_squares_in_row =0;
  let total_no_points = 0;

  // columns are months by rows are sites,
  let site_matrix = [];

  const renderMatrix = () => {
    let items = results;
    if (items && items.results?.temporal?.locationID?.results){
      site_data = items.results.temporal.locationID?.results;
      no_of_sites = site_data.length;

      let all_years = [];
      site_data.map(obj => obj.breakdown).forEach( breakdown => {
            breakdown.forEach( yearGroup => {
              all_years.push(yearGroup.y);
            })
          }
      )

      let earliest_year = Math.min(...all_years);
      let latest_year = Math.max(...all_years);
      if (earliest_year == latest_year){
        years = [earliest_year];
      } else {
        years = Array.range(earliest_year, latest_year);
      }

      no_of_years = years.length;
      no_of_squares_in_row = no_of_years * 12;
      total_no_points = no_of_squares_in_row * no_of_sites;

      // build 3d array site_matrix[site][year][month]
      site_matrix = new Array(no_of_sites);
      for (var i = 0; i < site_matrix.length; i++){
          var years_arr = new Array(no_of_years);
          for (var j = 0; j < years_arr.length; j++){
             if (showMonth){
              years_arr[j] = new Array(12).fill(0);
             } else {
              years_arr[j] = new Array(1).fill(0);
             }
          }
          site_matrix[i] = years_arr;
      }
      
      site_data.forEach( (site, site_index) => {

        //row per site
        years.forEach( (year, year_idx) => {

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
    }
  }

  renderMatrix();

  if (no_of_sites == 0){
    return <><div>No site data available</div></>
  }

  return <>
      <DataTable fixedColumn={fixed} {...{ first, prev, next, size, from, total: total_no_points, loading }} style={{ flex: "1 1 auto", height: 100, display: 'flex', flexDirection: 'column' }}>
        <tbody>
        <tr  css={ styles.sites({ noOfSites: no_of_sites, noOfYears: no_of_years, showMonth: showMonth, theme }) }>
          <td className={`grid-container`}>
            <div className={`grid`}>
              <div className={`legend`}> 
                Site / Year
              </div>
              <div className={`header`}>
                <div className={`header-grid`}>  
                  { years.map(obj => <ul><li key={`y_${obj}`}>{obj}</li></ul>) }
                 </div>                     
              </div>
             <div className={`sidebar`}>
              <div className={`sidebar-grid`}>   
                { site_data.map( (obj, i) => <ul><li key={`s_${i}`} onClick={() => { setSiteIDCallback(obj.key); }}>{obj.key}</li></ul>) }
              </div>
              </div>
              <div className={`main-grid`}>
                <SitesDataGrid site_matrix={site_matrix} site_data={site_data} years={years} setSiteIDCallback={setSiteIDCallback} showMonth={showMonth} />
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </DataTable>
  </>
}

export const SitesDataGrid = ({ site_matrix, site_data, years, setSiteIDCallback, showMonth }) => {

  return <div className={`data-grid`}>              
  {
    site_matrix.map( (site_row, site_idx) => 
      site_row.map( (year_cell, year_idx) => 
        <ul className={`year-grid`}>
          {   
            year_cell.map( (month_cell, month_idx) =>
                <li className={`${month_idx}_col`}
                    id={`${site_idx}_${year_idx}_${month_idx}`}
                    key={`${site_idx}_${year_idx}_${month_idx}`}
                    data-level={ month_cell > 0 ? '3': '0'}
                    onClick={() => { setSiteIDCallback(site_data[site_idx].key); }}
                >
                  <SitesDataGridTooltip month_cell={month_cell} 
                      month_idx={month_idx}
                      site_id={site_data[site_idx].key} 
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
    return <span className={`tooltiptext`}>{month_cell} events at {site_id} in {showMonth ? ((month_idx + 1) + '/') : ''}{year}</span>;  
  }
  return null;
}


export default SitesTable;