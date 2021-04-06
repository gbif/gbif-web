import React, { useEffect, useContext, useCallback } from "react";
import { useUpdateEffect } from 'react-use';
import { FilterContext } from '../widgets/Filter/state';
import SearchContext from './SearchContext';
import { useQuery } from '../dataManagement/api';
import { useUrlState } from '../dataManagement/state/useUrlState';
import { filter2v1 } from '../dataManagement/filterAdapter';
import { ResultsTable } from './ResultsTable';

function StandardSearchTable({graphQuery, resultKey, offsetName = 'offset', defaultTableConfig, ...props}) {
  const [offset, setOffset] = useUrlState({ param: 'offset', defaultValue: 0 });
  const limit = 20;
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const { data, error, loading, load } = useQuery(graphQuery, { lazyLoad: true, keepDataWhileLoading: true });

  useEffect(() => {
    const filter = { ...filter2v1(currentFilterContext.filter, predicateConfig), ...rootPredicate };
    
    load({ variables: { ...filter, limit, offset } });
  }, [currentFilterContext.filterHash, rootPredicate, offset]);

  // https://stackoverflow.com/questions/55075604/react-hooks-useeffect-only-on-update
  useUpdateEffect(() => {
    setOffset(0);
  }, [currentFilterContext.filterHash]);

  const next = useCallback(() => {
    setOffset(Math.max(0, offset + limit));
  });

  const prev = useCallback(() => {
    setOffset(Math.max(0, offset - limit));
  });

  const first = useCallback(() => {
    setOffset(0);
  });
  
  return <>
    <ResultsTable
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

export default StandardSearchTable;