import React, { useEffect, useContext, useCallback } from "react";
import { useUpdateEffect } from 'react-use';
import { FilterContext } from '../widgets/Filter/state';
import SearchContext from './SearchContext';
import { useQuery } from '../dataManagement/api';
import { filter2v1 } from '../dataManagement/filterAdapter';
import { ResultsTable } from './ResultsTable';
import { useQueryParam, NumberParam } from 'use-query-params';
import merge from 'lodash/merge';

function StandardSearchTable({graphQuery, slowQuery, resultKey, offsetName = 'offset', defaultTableConfig, ...props}) {
  // const [offset, setOffset] = useUrlState({ param: 'offset', defaultValue: 0 });
  const [offset = 0, setOffset] = useQueryParam('from', NumberParam);
  const limit = 50;
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const { data, error, loading, load } = useQuery(graphQuery, { lazyLoad: true, throwAllErrors: true, queryTag: 'table' });
  const { data: slowData, error: slowError, loading: slowLoading, load: slowLoad } = useQuery(slowQuery, { lazyLoad: true, queryTag: 'tableSlow' });

  useEffect(() => {
    const { v1Filter, error } = filter2v1(currentFilterContext.filter, predicateConfig);
    const filter = { ...v1Filter, ...rootPredicate };
    
    load({ keepDataWhileLoading: true, variables: { ...filter, limit, offset } });
    if (slowQuery) {
      slowLoad({ keepDataWhileLoading: false, variables: { ...filter, limit, offset } });
    }
  }, [currentFilterContext.filterHash, rootPredicate, offset]);

  // https://stackoverflow.com/questions/55075604/react-hooks-useeffect-only-on-update
  useUpdateEffect(() => {
    setOffset(undefined);
  }, [currentFilterContext.filterHash]);

  const next = useCallback(() => {
    setOffset(Math.max(0, offset + limit));
  });

  const prev = useCallback(() => {
    const offsetValue = Math.max(0, offset - limit);
    setOffset(offsetValue !== 0 ? offsetValue : undefined);
  });

  const first = useCallback(() => {
    setOffset(undefined);
  });

  if (error) {
    return <div>Failed to fetch data</div>
  }
  
  // allow both response types
  const results = data?.[resultKey]?.documents?.results || data?.[resultKey]?.results;
  const slowresults = slowData?.[resultKey]?.documents?.results || slowData?.[resultKey]?.results || [];
  const total = data?.[resultKey]?.documents?.total || data?.[resultKey]?.documents?.count || data?.[resultKey]?.count;

  let mergedResults = results ? merge([], results, slowresults) : results;

  return <>
    <ResultsTable
      {...props}
      loading={loading}
      results={mergedResults}
      next={next}
      prev={prev}
      first={first}
      size={limit}
      from={offset}
      total={total}
      defaultTableConfig={defaultTableConfig}
    />
  </>
}

export default StandardSearchTable;