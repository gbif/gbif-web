import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../dataManagement/api/axios';
import { css } from '@emotion/react';
import Card from './Card';
import { StringParam, useQueryParam } from 'use-query-params';
import OpenLayersMap from './Map';

export const MapWrapper = ({ onPolygonSelect, ...props }) => {
  const [annotations, setAnnotations] = useState([]);
  const [contextType = 'TAXON'] = useQueryParam('type', StringParam);
  const [contextKey] = useQueryParam('key', StringParam);

  useEffect(() => {
    const fetchAnnotations = async () => {
      let params = {};
      if (contextType) params = Object.assign(params, { contextType });
      if (contextKey) params = Object.assign(params, { contextKey });
      const response = await (axios.get('http://labs.gbif.org:7013/v1/occurrence/annotation/rule', {params})).promise;
      setAnnotations(response.data);
    };
    fetchAnnotations();
  }, [contextType, contextKey]);

  return <OpenLayersMap data={annotations} onPolygonSelect={onPolygonSelect} />
}
