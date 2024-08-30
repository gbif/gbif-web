import { useCallback, useState, useEffect } from 'react';
import { filter2v1 } from '.';
import { FilterType } from '../../contexts/filter';
import { FilterConfigType, FieldType } from './filter2predicate';
import isPlainObject from 'lodash/isPlainObject';
import { useSearchParams } from 'react-router-dom';
import { asStringParams, ParamQuery, parseParams } from '@/utils/querystring';
import v12filter from './v12filter';

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
  const [query, setQuery] = useQueryParams();

  // create an empty map to use as overwrites when a param is present in updates.
  // this simply generates a map with all keys set to undefined, but only the keys that are defined in the filterConfig
  // this way we won't have meddle with params that are not our business.
  useEffect(() => {
    const fields = filterConfig?.fields ?? {};
    if (!isPlainObject(fields)) return;

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
      const { filter, errors } = filter2v1(nextFilter, filterConfig);
      if (errors) {
        debugger;
        // if we cannot serialize the filter to version 1 API, then just serialize the json and put it in the filter param
        setQuery({ ...emptyQuery, filter: nextFilter });
      } else {
        setQuery({ ...emptyQuery, ...filter });
      }
      // setQuery({q: 'sdf', country: ['DK', 'DE', 'SE']});
    },
    [filterConfig, emptyQuery]
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
  }, [query]);

  return [filter, setFilter];
}

function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({});
  
  // useCallback to to setsearchparams, but before doing so it should turn everything into string or array of strings
  const updateQuery = useCallback((query: any) => {
    const stringParams = asStringParams(query);
    setSearchParams(stringParams);
  }, [setSearchParams]);

  // use effect to watch searchParams and set a public query after having parsed the strings into objects, numbers etc
  useEffect(() => {
    const query = parseParams(searchParams, true);
    setQuery(query);
  }, [searchParams]);

  return [query, updateQuery] as [ParamQuery, (query: ParamQuery) => void];
}
