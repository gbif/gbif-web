import React, { useEffect, useContext, useState, useCallback } from "react";
import { FilterContext } from '../../../../widgets/Filter/state';
import DatasetContext from '../../config/DatasetContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2v1 } from '../../../../dataManagement/filterAdapter';
import { TablePresentation } from './TablePresentation';

const DATASET_LIST = `
query list($publishingOrg: [ID], $hostingOrg: [ID], $publishingCountry: [Country]){
  datasetSearch(publishingOrg:$publishingOrg, hostingOrg: $hostingOrg, publishingCountry: $publishingCountry) {
    count
    offset
    limit
    results {
      key
      title
    }
  }
}
`;

function List() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(DatasetContext);
  const { data, error, loading, load } = useQuery(DATASET_LIST, { lazyLoad: true, keepDataWhileLoading: true });

  useEffect(() => {
    console.log(predicateConfig);
    console.log(currentFilterContext.filter);
    const filter = filter2v1(currentFilterContext.filter, predicateConfig);
    console.log(filter);
    load({ variables: { ...filter, limit, offset } });
  }, [currentFilterContext.filterHash, rootPredicate, offset]);

  useEffect(() => {
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
    <ListPresentation
      loading={loading}
      data={data}
      next={next} 
      prev={prev} 
      first={first} 
      size={limit} 
      from={offset}
      total={data?.datasetSearch?.count}
    />
  </>
}

export default List;

