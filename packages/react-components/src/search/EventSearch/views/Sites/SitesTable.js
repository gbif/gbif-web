import React, {useContext, useEffect, useState} from "react";
import styles from './styles';
import ThemeContext from "../../../../style/themes/ThemeContext";
import {Button, DataTable, Skeleton} from "../../../../components";
import {ResultsHeader} from "../../../ResultsHeader";
import {css} from "@emotion/react";
import * as style from "../List/style";

function SitesSkeleton() {
  return <div css={style.datasetSkeleton}>
    <Skeleton width="random" style={{ height: '1.5em' }} />
    <Skeleton width="random" />
    <Skeleton width="random" />
    <Skeleton width="random" />
  </div>
}

export const SitesTable = ({ first, prev, next, size, from, results, total, loading, setSiteIDCallback }) => {

  const theme = useContext(ThemeContext);
  const [fixedColumn, setFixed] = useState(true);
  const fixed = fixedColumn;

  const [activeSiteID, setActiveSiteID] = useState(false);
  const [showMonth, setShowMonth] = useState(true);

  const toggle = () => {
    setShowMonth(!showMonth);
    renderMatrix();
  }

  Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

  useEffect(() => {
    if (activeSiteID) {
      setSiteIDCallback(activeSiteID)
    }
  }, [activeSiteID]);

  // current result set
  const items = results;

  let site_data = [];
  let no_of_sites = 0;
  let no_of_years = 0;
  let years = [];
  let no_of_squares_in_row =0;
  let total_no_points = 0;

  // columns are months  by  rows are sites,
  let site_matrix = [];

  const renderMatrix = () => {
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

      years = Array.range(earliest_year, latest_year);

      no_of_years = years.length;
      no_of_squares_in_row = no_of_years * 12;
      total_no_points = no_of_squares_in_row * no_of_sites
      site_matrix = new Array(years.length * 12).fill(0).map(() => new Array(no_of_sites).fill(0));

      site_data.forEach( (site, site_index) => {

        //row per site
        years.forEach( (year, year_idx) => {
          // get the data for the year
          let yearBreakdown = site.breakdown.filter( breakdown => breakdown.y == year);
          if (yearBreakdown && yearBreakdown.length == 1) {
            if (yearBreakdown[0].ms) {
              if (showMonth) {
                yearBreakdown[0].ms.forEach(month => {
                  site_matrix[(month.m - 1) + (year_idx * 12)][site_index] = month.c;
                });
              } else {

                let total = 0;
                yearBreakdown[0].ms.forEach(month => {
                  total = total + month.c;
                });

                [...Array(12).keys()].forEach(month => {
                      site_matrix[month + (year_idx * 12)][site_index] = total;
                    }
                );
              }
            }
          }
        })
      })
    }
  }

  renderMatrix();

  return <>
    <div style={{
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column",
    }}>
      <ResultsHeader loading={loading} total={total}>
          <Button onClick={() => toggle()} look="primaryOutline" css={css`margin-left: 30px; font-size: 11px;`}>Show year / month</Button>
      </ResultsHeader>
      <DataTable fixedColumn={fixed} {...{ first, prev, next, size, from, total: total_no_points, loading }} style={{ flex: "1 1 auto", height: 100, display: 'flex', flexDirection: 'column' }}>
        <tbody>
        <tr  css={ styles.sites({ noOfSites: no_of_sites, noOfYears: no_of_years, showMonth: showMonth, theme }) }>
          <td className={`graph`} >
            <ul className={`time`}>
              { years.map(obj => <li key={`y_${obj}`}>{obj}</li>) }
            </ul>
            <ul className={`sites`}>
              { site_data.map( (obj, i) => <li key={`s_${i}`} onClick={() => { setActiveSiteID(obj.key); }}>{obj.key}</li>) }
            </ul>
            <ul className={`squares`}>
              {
                site_matrix.map( (month_column, c_idx) =>
                    month_column.map( (square, ce_idx) =>
                            <li className={`${c_idx % 12}_col`}
                                id={`${c_idx}_${ce_idx}`}
                                key={`${c_idx}_${ce_idx}`}
                                data-level={ square > 0 ? '3': '0'}
                                onClick={() => { setActiveSiteID(site_data[ce_idx].key); }}
                            >
                              { square > 0 && <span className={`tooltiptext`}>{ square } events</span> }
                            </li>
                    )
                )
              }
            </ul>
          </td>
        </tr>
        </tbody>
      </DataTable>
    </div>
  </>
}

export default SitesTable;