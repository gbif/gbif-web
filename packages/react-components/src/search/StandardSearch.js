import React, { useEffect, useContext, useCallback } from "react";
import { useUpdateEffect } from 'react-use';
import { FilterContext } from '../widgets/Filter/state';
import SearchContext from './SearchContext';
import { useQuery } from '../dataManagement/api';
import { filter2v1 } from '../dataManagement/filterAdapter';
import { ResultsTable } from './ResultsTable';
import { useQueryParam, NumberParam } from 'use-query-params';

function StandardSearch({presentationComponent:PresentationComponent=ResultsTable, presentationProps, graphQuery, resultKey, offsetName = 'offset', defaultTableConfig, ...props}) {
  const [offset = 0, setOffset] = useQueryParam('from', NumberParam);
  const limit = 20;
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const { data, error, loading, load } = useQuery(graphQuery, { lazyLoad: true });

  useEffect(() => {
    const { v1Filter, error } = filter2v1(currentFilterContext.filter, predicateConfig);
    const filter = { ...v1Filter, ...rootPredicate };
    
    load({ keepDataWhileLoading: true, variables: { ...filter, limit, offset } });
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
  
  return <>
    <PresentationComponent
      {...props}
      loading={loading}
      results={data?.[resultKey].results}
      next={next}
      prev={prev}
      first={first}
      size={limit}
      from={offset}
      total={data?.[resultKey]?.count}
      defaultTableConfig={defaultTableConfig}
    />
  </>
}

export default StandardSearch;