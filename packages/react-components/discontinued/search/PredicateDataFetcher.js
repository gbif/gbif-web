import React, { useEffect, useContext, useCallback } from "react";
import { useUpdateEffect } from 'react-use';
import { FilterContext } from '../widgets/Filter/state';
import SearchContext from './SearchContext';
import { useQuery } from '../dataManagement/api';
import { filter2predicate } from '../dataManagement/filterAdapter';
import { useQueryParam, NumberParam } from 'use-query-params';
import hash from 'object-hash';

function PredicateDataFetcher({graphQuery, graph, resultKey, offsetName = 'from', limit = 25, customVariables = {}, componentProps, presentation: Presentation, queryProps = {}, predicateMeddler, queryTag, ...props}) {
  const [offset = 0, setOffset] = useQueryParam('offset', NumberParam);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const { data, error, loading, load } = useQuery(graphQuery, { lazyLoad: true, graph, queryTag, ...queryProps });

  const variableHash = hash(customVariables);

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig)
      ].filter(x => x)
    }

    load({ keepDataWhileLoading: true, variables: { predicate, limit, offset, ...customVariables } });
  }, [currentFilterContext.filterHash, rootPredicate, offset, limit, variableHash]);

  // https://stackoverflow.com/questions/55075604/react-hooks-useeffect-only-on-update
  useUpdateEffect(() => {
    setOffset(undefined);
  }, [currentFilterContext.filterHash]);

  // on unmount then reset offset
  useEffect(() => {
    return () => setOffset(undefined);
  }, []);

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

  const total = data?.results?.documents?.total;
  const results = data?.results?.documents?.results;
  return <>
      <Presentation
        {...props}
        query = {graphQuery}
        error={error}
        loading={loading}
        data={data}
        next={next}
        prev={prev}
        first={first}
        size={limit}
        from={offset}
        total={total}
        results={results}
        {...componentProps}
      />
  </>
}

export default PredicateDataFetcher;