import React, {useCallback, useContext, useEffect, useState} from "react";
import styles from './styles';
import ThemeContext from "../../../../style/themes/ThemeContext";
import {DataTable, DetailsDrawer, Switch} from "../../../../components";
import {Skeleton} from "../../../../components";
import { FormattedMessage } from "react-intl";
import {useGraphQLContext} from "../../../../dataManagement/api/GraphQLContext";
import {SiteSidebar} from "../../../../entities/SiteSidebar/SiteSidebar";
import {ResultsHeader} from "../../../ResultsHeader";
import {useDialogState} from "reakit/Dialog";
import {useUpdateEffect} from "react-use";

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

export const SitesTable = ({ query, first, prev, next, size, from, data, total, loading }) => {

  const theme = useContext(ThemeContext);
  const [fixedColumn, setFixed] = useState(true);
  const fixed = fixedColumn;

  const dialog = useDialogState({ animated: true, modal: false });

  const [showMonth, setShowMonth] = useState(false);
  const [activeSiteID, setActiveSiteID] = useState(false);
  const [activeYear, setActiveYear] = useState(false);
  const [activeMonth, setActiveMonth] = useState(false);
  const {details, setQuery} = useGraphQLContext();

  let siteMatrix = [];
  let siteData = [];
  let years = [];
  let locationIDs = [];
  let totalPoints = 0;

  useEffect(() => {
    setQuery({ query, size, from });
  }, [query, size, from]);

  //TODO move to i18n
  const stateProvinces = {
    "new south wales": "NSW",
    "victoria": "VIC",
    "australian capital territory": "ACT",
    "northern territory": "NT ",
    "queensland": "QLD",
    "western australia": "WA ",
    "tasmania": "TAS"
  }

  Array.range = (start, end) => Array.from({length: (end + 1 - start)}, (v, k) => k + start);

  function renderMatrix(){

    let items = data;
    if (items && items.results?.temporal?.locationID?.results){

      const locationIDLookup = new Map();

      items.locations.multifacet.locationIDStateProvince.forEach(details => {
        locationIDLookup.set(details.keys[0], stateProvinces[details.keys[1]?.toLowerCase()]);
      });

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

      locationIDs = locationIDLookup;
      years = year_range;
      siteMatrix = site_matrix;
      siteData = site_data;
      totalPoints = total_no_points;
    }
  }

  useEffect(() => {
    if (activeSiteID) {
      dialog.show();
    } else {
      dialog.hide();
    }
  }, [activeSiteID]);

  useUpdateEffect(() => {
    if (!dialog.visible) {
      setActiveSiteID(null);
      setActiveYear(null);
      setActiveMonth(null);
    }
  }, [dialog.visible]);

  const setSiteIDCallback = ({locationID, year, month}) => {
    setActiveSiteID(locationID);
    setActiveYear(year);
    setActiveMonth(month);
  }

  const closeSidebar = () => {
    setActiveSiteID(null);
    setActiveYear(null);
    setActiveMonth(null);
    dialog.hide();
  }

  const toggleMonthYearDisplay = useCallback(() => {
    setShowMonth(!showMonth);
  });

  if (data && !loading){
    renderMatrix();
  }

  return <>
      <DetailsDrawer href={`${activeSiteID}`} dialog={dialog}>
        <SiteSidebar
              siteID={activeSiteID}
              year={activeYear}
              month={activeMonth}
              defaultTab='details'
              style={{ maxWidth: '100%', width: 700, height: '100%' }}
              onCloseRequest={() => closeSidebar()}
          />
        </DetailsDrawer>
        <div style={{
          flex: "1 1 100%",
          display: "flex",
          height: "100%",
          maxHeight: "100vh",
          flexDirection: "column"
        }}>
          <ResultsHeader loading={loading} total={data?.results?.temporal?.locationID?.cardinality}>
              <Switch checked={showMonth} style={{fontSize: 18, margin: 0, marginLeft: '20px', marginRight: '5px'}}
                      onClick={() => toggleMonthYearDisplay()} />  Show months
          </ResultsHeader>
          { loading &&
            <SitesTableSkeleton />
          }
          {!loading &&
              <DataTable fixedColumn={fixed} {...{first, prev, next, size, from, total: totalPoints, loading}}
                         style={{flex: "1 1 auto", height: 100, display: 'flex', flexDirection: 'column'}}>
                <tbody>
                <tr css={styles.sites({
                  noOfSites: siteMatrix.length,
                  noOfYears: years.length,
                  showMonth: showMonth,
                  theme
                })}>
                  <td className="grid-container">
                    <div className="grid">
                      <div className="legend">
                        <FormattedMessage id="eventDetails.siteTableLegend"/>
                      </div>
                      <div className="header">
                        <div className="header-grid">
                          {years.map(obj => <ul>
                            <li key={`y_${obj}`}>{obj}</li>
                          </ul>)}
                        </div>
                      </div>
                      <div className="sidebar">
                        <div className="sidebar-grid">
                          {siteData.map((obj, i) => <ul>
                            <li key={`s_${i}`} onClick={() => {
                              setSiteIDCallback({locationID: obj.key});
                            }}><span
                                style={{fontWeight: 'bold'}}>{locationIDs.get(obj.key)}</span> {obj.key?.substring(0, 18)}
                            </li>
                          </ul>)}
                        </div>
                      </div>
                      <div className="main-grid">
                        <SitesDataGrid siteMatrix={siteMatrix} siteData={siteData} years={years}
                                       onCellClick={setSiteIDCallback} showMonth={showMonth}/>
                      </div>
                    </div>
                  </td>
                </tr>
                </tbody>
              </DataTable>
          }
        </div>
  </>
}

const SitesDataGrid = ({ siteMatrix, siteData, years, onCellClick, showMonth }) => {

  return <div className="data-grid">
  {
    siteMatrix.map( (siteRow, site_idx) =>
      siteRow.map( (year_cell, year_idx) =>
        <ul className="year-grid" key={`${site_idx}_${year_idx}`}>
          {   
            year_cell.map( (month_cell, month_idx) =>
                <GridCell site_idx={site_idx}
                          year_idx={year_idx}
                          month_idx={month_idx}
                          month_cell={month_cell}
                          onCellClick={onCellClick}
                          years={years}
                          siteData={siteData}
                          showMonth={showMonth} />
            )
          }
        </ul>
      )
    )
  }
  </div>
}

const GridCell = ({ site_idx, year_idx, month_idx, month_cell, onCellClick, years, siteData, showMonth}) => {

  const onClickDead = () => {
    console.log('Clicked dead')
  }

  const onClick = () => {
    console.log('Clicked')
    onCellClick({
      locationID: siteData[site_idx].key,
      year: years[year_idx],
      month: showMonth ? month_idx + 1 : -1
    });
  }

  if (month_cell == 0){
    return <li id={`${site_idx}_${year_idx}_${month_idx}`}
               key={`${site_idx}_${year_idx}_${month_idx}`}
               data-level={'0'}
               onClick={() => onClickDead()}
    ></li>
  } else {
    return <li id={`${site_idx}_${year_idx}_${month_idx}`}
               key={`${site_idx}_${year_idx}_${month_idx}`}
               data-level={month_cell > 0 ? '3' : '0'}
               onClick={() => onClick()}>
      {month_cell > 0 &&
          <SitesDataGridTooltip
              key={`${site_idx}_${year_idx}_${month_idx}_tt`}
              month_cell={month_cell}
              month_idx={month_idx}
              site_id={siteData[site_idx].key}
              year={years[year_idx]}
              showMonth={showMonth}/>
      }
    </li>
  }
}


export const SitesDataGridTooltip = ({ month_cell, month_idx, site_id, year, showMonth }) => {
  return <span className="tooltiptext">
    <FormattedMessage id="eventDetails.siteTooltip"
        values={ {count: month_cell, site: site_id, date: ((showMonth ? ((month_idx + 1) + '/') : '') + year) } }  />
    </span>;
}

export default SitesTable;