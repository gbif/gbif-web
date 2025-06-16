import { asStringParams, ParamQuery, parseParams } from '@/utils/querystring';
import { Base64 } from 'js-base64';
import isPlainObject from 'lodash/isPlainObject';
import objectHash from 'object-hash';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

  // useCallback to to setsearchparams, but before doing so it should turn everything into string or array of strings
  const updateQuery = useCallback(
    (nextQuery: any) => {
      const existingQuery = parseParams(searchParams, true);
      const mergedQuery = { ...existingQuery, ...nextQuery };
      const stringParams = asStringParams(mergedQuery);
      setSearchParams(stringParams, { preventScrollReset: true });
    },
    [setSearchParams, observedParams]
  );

  // use effect to watch searchParams and set a public query after having parsed the strings into objects, numbers etc
  useEffect(() => {
    const query = parseParams(searchParams, true);
    // delete query properties that aren't observedParams
    Object.keys(query).forEach((key) => {
      if (!observedParams.includes(key)) {
        delete query[key];
      }
    });
    setQuery(query);
  }, [searchParams, observedParams]);

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
