import React, { useEffect, useContext, useState, useCallback } from "react";
import { FilterContext } from '../../../../widgets/Filter/state';
import OccurrenceContext from '../../config/OccurrenceContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import { DatasetsPresentation } from './DatasetsPresentation';

const DATASETS = `
query table($predicate: Predicate, $size: Int = 0){
  occurrenceSearch(predicate: $predicate, size: 0, from: 0) {
    facet {
      datasetKey(size: $size) {
        count
        dataset {
          title
          description
          license
        }
      }
    }
  }
}

`;

function Datasets() {
  const [size, setSize] = useState(200);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(DATASETS, { lazyLoad: true, keepDataWhileLoading: true });

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig)
      ].filter(x => x)
    }
    load({ variables: { predicate, size } });
  }, [currentFilterContext.filterHash, rootPredicate]);

  useEffect(() => {
    setSize(0);
  }, [currentFilterContext.filterHash]);

  const more = useCallback(() => {
    setSize(size + 100);
  });

  return <>
    <DatasetsPresentation
      loading={loading}
      data={data}
      more={more}
      size={size}
    />
  </>
}

export default Datasets;

