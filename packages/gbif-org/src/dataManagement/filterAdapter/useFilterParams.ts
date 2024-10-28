import { useCallback, useState, useEffect } from 'react';
import { filter2v1 } from '.';
import { cleanUpFilter, FilterType } from '../../contexts/filter';
import { FilterConfigType } from './filter2predicate';
import isPlainObject from 'lodash/isPlainObject';
import { useSearchParams } from 'react-router-dom';
import { asStringParams, ParamQuery, parseParams } from '@/utils/querystring';
import v12filter from './v12filter';
import objectHash from 'object-hash';

// function v12filter(query: any, filterConfig: FilterConfigType): FilterType {
//   const filter = {};
//   // TODO
//   return {
//     must: {
//       country: ['DK'],
//     },
//   };
// }

export function useFilterParams({ filterConfig }: { filterConfig: FilterConfigType }): [FilterType, (filter: FilterType) => void] {
  const [filter, setPublicFilter] = useState({});
  const [emptyQuery, setEmptyQuery] = useState({});
  const [observedParams, setObservedParams] = useState<string[]>([]);
  const [query, setQuery] = useQueryParams({observedParams});

  // create an empty map to use as overwrites when a param is present in updates.
  // this simply generates a map with all keys set to undefined, but only the keys that are defined in the filterConfig
  // this way we won't have meddle with params that are not our business.
  useEffect(() => {
    const fields = filterConfig?.fields ?? {};
    if (!isPlainObject(fields)) return;
    setObservedParams(Object.keys(fields));

    const empty: { [key: string]: undefined } = Object.keys(fields).reduce(
      (accumulator: { [key: string]: undefined }, curr: string) => {
        const fieldConfig = fields[curr];
        accumulator[fieldConfig?.defaultKey || curr] = undefined;
        return accumulator;
      },
      {}
    );
    empty.filter = undefined;
    setEmptyQuery(empty);
  }, [filterConfig]);

  // transform the filter to a string that can go into the url.
  // Field names can change according to the configuration
  const setFilter = useCallback(
    (nextFilter: FilterType) => {
      if (objectHash(cleanUpFilter(nextFilter)) === objectHash(cleanUpFilter(filter))) {
        return;
      }
      const { filter: v1Filter, errors } = filter2v1(nextFilter, filterConfig);
      if (errors) {
        // if we cannot serialize the filter to version 1 API, then just serialize the json and put it in the filter param
        setQuery({ ...emptyQuery, filter: nextFilter });
      } else {
        setQuery({ ...emptyQuery, ...v1Filter });
      }
      // setQuery({q: 'sdf', country: ['DK', 'DE', 'SE']});
    },
    [filterConfig, emptyQuery, filter, setQuery]
  );

  // Transform the query from the url to the naming the consumer prefers.
  // Field names can change according to the configuration
  useEffect(() => {
    let f;
    if (query.filter) {
      f = query.filter;
    } else {
      f = v12filter(query, filterConfig);
    }
    setPublicFilter(f);
  }, [query, filterConfig]);

  return [filter, setFilter];
}

function useQueryParams({observedParams}: {observedParams: string[]}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({});
  
  // useCallback to to setsearchparams, but before doing so it should turn everything into string or array of strings
  const updateQuery = useCallback((nextQuery: any) => {
    debugger;
    const stringParams = asStringParams(nextQuery);
    console.log(stringParams);
    setSearchParams(stringParams);
  }, [setSearchParams, observedParams]);

  // use effect to watch searchParams and set a public query after having parsed the strings into objects, numbers etc
  useEffect(() => {
    const query = parseParams(searchParams, true);
    // delete query properties that aren't observedParams
    Object.keys(query).forEach(key => {
      if (!observedParams.includes(key)) {
        delete query[key];
      }
    });
    setQuery(query);
  }, [searchParams, observedParams]);

  return [query, updateQuery] as [ParamQuery, (query: ParamQuery) => void];
}
