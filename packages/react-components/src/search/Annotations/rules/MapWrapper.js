import React, { useState, useEffect, useContext } from 'react';
import axios from '../../../dataManagement/api/axios';
import { StringParam, useQueryParam } from 'use-query-params';
import OpenLayersMap from './Map';
import { FilterContext } from '../../../widgets/Filter/state';
import SearchContext from '../../SearchContext';
import { filter2v1 } from '../../../dataManagement/filterAdapter';

export const MapWrapper = ({ annotations, onPolygonSelect, polygons, setPolygons, ...props }) => {
  // const [annotations, setAnnotations] = useState([]);
  // const currentFilterContext = useContext(FilterContext);
  // const { rootPredicate, predicateConfig } = useContext(SearchContext);

  // useEffect(() => {
  //   const fetchAnnotations = async () => {
  //     const { v1Filter, error } = filter2v1(currentFilterContext.filter, predicateConfig);
  //     const filter = { ...v1Filter, ...rootPredicate };

  //     const response = await (axios.get('http://labs.gbif.org:7013/v1/occurrence/experimental/annotation/rule', { params: filter })).promise;
  //     setAnnotations(response.data);
  //   };
  //   fetchAnnotations();
  // }, [currentFilterContext.filterHash]);

  return <OpenLayersMap {...{polygons, setPolygons}} data={annotations} onPolygonSelect={onPolygonSelect} />
}
