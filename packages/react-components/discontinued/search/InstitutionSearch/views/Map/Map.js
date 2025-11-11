import React, { useState, useEffect, useContext } from "react";
import MapPresentation from './MapPresentation';
import SearchContext from "../../../SearchContext";
import { FilterContext } from "../../../../widgets/Filter/state";
import env from '../../../../../.env.json';
import axios from "../../../../dataManagement/api/axios";
import { filter2v1 } from "../../../../dataManagement/filterAdapter";
import SiteContext from "../../../../dataManagement/SiteContext";
import queryString from "query-string";

function Map(props) {
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const siteContext = useContext(SiteContext);
  const mapSettings = siteContext?.institution?.mapSettings;
  const [filter, setFilter] = useState({});
  const [geojsonData, setGeojsonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { v1Filter, error } = filter2v1(currentFilterContext.filter, predicateConfig);
    const filter = { ...rootPredicate, ...v1Filter };
    setFilter(filter);
    const { promise, cancel } = axios.get(`${env.API_V1}/grscicoll/institution/geojson`, {
      params: filter,
      // https://github.com/axios/axios#request-config
      paramsSerializer: function (params) {
        return queryString.stringify(params, { arrayFormat: 'repeat' })
      },
    });
    setLoading(true);
    promise
      .then(({ data }) => {
        setGeojsonData(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
    return cancel;
  }, [currentFilterContext.filterHash, rootPredicate]);

  return <MapPresentation defaultMapSettings={mapSettings} loading={loading} total={geojsonData?.features?.length} geojsonData={geojsonData} filterHash={currentFilterContext.filterHash} {...props} style={{ width: '100%', height: '100%' }} />
}

export default Map;