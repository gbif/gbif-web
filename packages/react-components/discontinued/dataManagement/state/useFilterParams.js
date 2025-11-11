import { useCallback, useState, useEffect } from 'react';
import { encodeDelimitedArray, decodeDelimitedArray, useQueryParams, ArrayParam, StringParam, JsonParam, NumericArrayParam } from 'use-query-params';
import { filter2v1, v12filter } from '../filterAdapter';
import { Base64JsonParam } from './base64JsonParam';

export function useFilterParams({ predicateConfig } = {}) {
  const [params, setParams] = useState({});
  const [filter, setPublicFilter] = useState({});
  const [emptyQuery, setEmptyQuery] = useState({});
  const [query, setQuery] = useQueryParams(params);

  // create an empty map to use as overwrites when a param is present in updates.
  useEffect(() => {
    const empty = Object.keys(predicateConfig.fields).reduce((prev, curr) => {
      const fieldConfig = predicateConfig.fields[curr];
      prev[fieldConfig.defaultKey || curr] = undefined;
      return prev;
    }, {});
    empty.filter = undefined;
    setEmptyQuery(empty);

    const paramsConfig = Object.keys(predicateConfig.fields).reduce((prev, curr) => {
      const fieldConfig = predicateConfig.fields[curr];
      prev[fieldConfig.defaultKey || curr] = ArrayParam;
      return prev;
    }, {});
    paramsConfig.filter = Base64JsonParam;
    setParams(paramsConfig);
    
  }, [predicateConfig]);

  // transform the filter to a string that can go into the url. 
  // Field names can change according to the configuration
  const setFilter = useCallback((nextFilter) => {
    const { v1Filter, errors } = filter2v1(nextFilter, predicateConfig);
    if (errors) {
      setQuery({ ...emptyQuery, filter: nextFilter });
    } else {
      setQuery({ ...emptyQuery, ...v1Filter });
    }
  }, [predicateConfig, emptyQuery]);

  // Transform the query from the url to the naming the consumer prefers. 
  // Field names can change according to the configuration
  useEffect(() => {
    let f;
    if (query.filter) {
      f = query.filter;
    } else {
      f = v12filter(query, predicateConfig);
    }
    setPublicFilter(f)
  }, [query])

  return [filter, setFilter];
}