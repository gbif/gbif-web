import React, {useCallback, useContext, useEffect, useState} from "react";
import styles from './styles';
import ThemeContext from "../../../../style/themes/ThemeContext";
import {Row} from "../../../../components";
import EventContext from "../../../SearchContext";
import {useQuery} from "../../../../dataManagement/api";
import {filter2predicate} from "../../../../dataManagement/filterAdapter";
import hash from "object-hash";
import {useUpdateEffect} from "react-use";
import SearchContext from "../../../SearchContext";

export const SitesTable = ({ first, prev, next, size, from, results, total, loading, setSiteIDCallback }) => {

  const theme = useContext(ThemeContext);

  const [activeSiteID, setActiveSiteID] = useState(false);

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
  let squares = [];

  if (items && items.results?.temporal?.locationID){
    site_data = items.results.temporal.locationID;
    no_of_sites = site_data.length;

    let allyears = [];
    site_data.map(obj => obj.breakdown).forEach( breakdown => {
          breakdown.forEach( yearGroup => {
            allyears.push(yearGroup.y);
          })
        }
    )

    years = allyears.filter((v, i, a) => a.indexOf(v) === i).sort();
    no_of_years = years.length;

    site_data.forEach(site => {
      //row per site
      years.forEach( year => {
        // get the data for the year
        let yearBreakdown = site.breakdown.filter( breakdown => breakdown.y == year);
        let yearSquares = Array(12).map(x => 1);
        if (yearBreakdown && yearBreakdown.length == 1) {
          if (yearBreakdown[0].ms) {
            yearBreakdown[0].ms.forEach(month => {
              yearSquares[month.m - 1] = month.c;
            })
          }
        }
        squares.push(...yearSquares);
      })
    })
  }

  return <>
    <Row>
    <div css={ styles.sites({ noOfSites: no_of_sites, noOfYears: no_of_years, theme }) }>
      <div className={`graph`}>
        <ul className={`time`}>
          { years.map(obj => <li>{obj}</li>) }
        </ul>
        <ul className={`sites`}>
          { site_data.map(obj => <li onClick={() => { setActiveSiteID(obj.key); }}>{obj.key}</li>) }
        </ul>
        <ul className={`squares`}>
          { squares.map( (obj, i) => <li data-level={obj > 0 ? '3': '0'}>
            { obj > 0 && <span className={`tooltiptext`}>{ obj } events</span> }
            </li>
          )}
        </ul>
      </div>
    </div>
    </Row>
  </>
}

export default SitesTable;