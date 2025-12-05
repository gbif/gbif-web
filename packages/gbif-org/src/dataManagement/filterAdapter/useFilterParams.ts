import { asStringParams, ParamQuery, parseParams } from '@/utils/querystring';
import { Base64 } from 'js-base64';
import isPlainObject from 'lodash/isPlainObject';
import objectHash from 'object-hash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { filter2v1 } from '.';
import { cleanUpFilter, FilterType } from '../../contexts/filter';
import { FilterConfigType } from './filter2predicate';
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

export function useFilterParams({
  filterConfig,
  defaultChecklistKey,
  paramsToRemove,
}: {
  filterConfig: FilterConfigType;
  defaultChecklistKey?: string;
  paramsToRemove: string[];
}): [FilterType, (filter: FilterType) => void] {
  const [remove] = useState(paramsToRemove ?? []);
  const [emptyQuery, setEmptyQuery] = useState({});
  const [observedParams, setObservedParams] = useState<string[]>([]);
  const [query, setQuery] = useQueryParams({ observedParams });

  // create an empty map to use as overwrites when a param is present in updates.
  // this simply generates a map with all keys set to undefined, but only the keys that are defined in the filterConfig
  // this way we won't have meddle with params that are not our business.
  useEffect(() => {
    const fields = filterConfig?.fields ?? {};
    if (!isPlainObject(fields)) return;
    setObservedParams([
      ...Object.keys(fields).map((x) => fields?.[x]?.defaultKey ?? x),
      'filter',
      'checklistKey',
    ]);

    const empty: { [key: string]: undefined } = [
      ...Object.keys(fields),
      'checklistKey',
      ...remove,
    ].reduce((accumulator: { [key: string]: undefined }, curr: string) => {
      const fieldConfig = fields[curr];
      accumulator[fieldConfig?.defaultKey || curr] = undefined;
      return accumulator;
    }, {});
    empty.filter = undefined;
    setEmptyQuery(empty);
  }, [filterConfig, remove]);

  // Transform the query from the url to the naming the consumer prefers.
  // Field names can change according to the configuration
  const filter = useMemo(() => {
    let f;
    if (query?.filter) {
      const encodedFilter = Array.isArray(query.filter) ? query.filter[0] : query.filter;
      f = Base64JsonParam.decode(encodedFilter);
    } else {
      f = v12filter(query, filterConfig, defaultChecklistKey);
    }
    return f;
  }, [query, filterConfig, defaultChecklistKey]);

  // transform the filter to a string that can go into the url.
  // Field names can change according to the configuration
  const setFilter = useCallback(
    (nextFilter: FilterType) => {
      if (objectHash(cleanUpFilter(nextFilter)) === objectHash(cleanUpFilter(filter))) {
        return;
      }
      const { filter: v1Filter, errors } = filter2v1(nextFilter, filterConfig);
      if (v1Filter && v1Filter?.checklistKey === defaultChecklistKey) {
        delete v1Filter.checklistKey;
      }
      if (errors) {
        // if we cannot serialize the filter to version 1 API, then just serialize the json and put it in the filter param
        setQuery({ ...emptyQuery, filter: Base64JsonParam.encode(nextFilter) });
      } else {
        setQuery({ ...emptyQuery, ...v1Filter });
      }
    },
    [filterConfig, emptyQuery, filter, setQuery]
  );

  return [filter, setFilter];
}

function useQueryParams({ observedParams }: { observedParams: string[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({});

  // Store setSearchParams in a ref, so we can read current value without dependency
  const setSearchParamsRef = useRef(setSearchParams);
  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  // Store searchParams in a ref, so we can read current value without dependency
  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const updateQuery = useCallback(
    (nextQuery: any) => {
      const existingQuery = parseParams(searchParamsRef.current, true);
      const mergedQuery = { ...existingQuery, ...nextQuery };
      const stringParams = asStringParams(mergedQuery);
      setSearchParamsRef.current(stringParams, { preventScrollReset: true });
    },
    [] // to avoid recreating the callback on every parameter change we move dependencies to refs
  );

  useEffect(() => {
    const parsedQuery = parseParams(searchParams, true);
    const filteredQuery = Object.keys(parsedQuery).reduce((acc, key) => {
      if (observedParams.includes(key)) {
        acc[key] = parsedQuery[key];
      }
      return acc;
    }, {} as any);

    if (objectHash(filteredQuery) === objectHash(query)) {
      return;
    }

    setQuery(filteredQuery);
  }, [searchParams, observedParams, query]);

  return [query, updateQuery] as [ParamQuery, (query: ParamQuery) => void];
}

export const Base64JsonParam = {
  encode: (obj: object) => (obj ? Base64.encode(JSON.stringify(obj)) : undefined),
  decode: (obj: string) => {
    try {
      const value = obj ? Base64.decode(obj) : obj;
      const parsedValue = JSON.parse(value);
      return parsedValue;
    } catch (err) {
      return undefined;
    }
  },
};

export default Base64JsonParam;
