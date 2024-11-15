import { useEffect, useContext, useCallback, useState } from 'react';
import { FilterContext } from '@/contexts/filter';
import useQuery from '@/hooks/useQuery';
import { filter2predicate } from '@/dataManagement/filterAdapter';
import { useSearchContext } from '@/contexts/search';
import { searchConfig } from '../../searchConfig';
import { DatasetPresentation } from './datasetPresentation';
import { useStringParam } from '@/hooks/useParam';
import { useOrderedList } from '../browseList/useOrderedList';

const OCCURRENCE_DATASETS = `
query occurrenceDatasets($predicate: Predicate, $size: Int) {
  occurrenceSearch(predicate: $predicate, size: 0, from: 0) {
    cardinality {
      datasetKey
    }
    facet {
      datasetKey(size: $size) {
        count
        key
        dataset {
          key
          title
          excerpt
        }
      }
    }
  }
}
`;

export function Dataset({ size: defaultSize = 100 }) {
  const [from, setFrom] = useState(0);
  const currentFilterContext = useContext(FilterContext);
  const { scope } = useSearchContext();
  const { data, loading, load } = useQuery(OCCURRENCE_DATASETS, {
    lazyLoad: true,
    throwAllErrors: true,
  });
  const { setOrderedList } = useOrderedList();
  const [, setPreviewKey] = useStringParam({ key: 'entity' });
  const [size, setSize] = useState(defaultSize);

  const [allData, setAllData] = useState([]);

  useEffect(() => {
    setSize(defaultSize);
  }, [currentFilterContext.filterHash]);

  const more = useCallback(() => {
    setSize(size + 100);
  }, [size]);

  // update ordered list on items change
  useEffect(() => {
    setOrderedList(allData.map((item) => `d_${item.key}`));
  }, [allData, setOrderedList]);

  useEffect(() => {
    setAllData(prev => {
      const all = [...prev, ...(data?.occurrenceSearch?.facet?.datasetKey || [])];
      // get unique by key
      const unique = all.reduce((acc, cur) => {
        if (acc.find((x) => x.key === cur.key)) {
          return acc;
        }
        return [...acc, cur];
      }, []);
      return unique;
    });
  }, [data]);

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        scope,
        filter2predicate(currentFilterContext.filter, searchConfig),
      ].filter((x) => x),
    };
    load({ keepDataWhileLoading: true, variables: { predicate, size } });
  }, [from, currentFilterContext.filterHash, scope, load, size]);

  useEffect(() => {
    setFrom(0);
    setAllData([]);
  }, [currentFilterContext.filterHash, scope]);

  const total = data?.occurrenceSearch?.cardinality?.datasetKey;
  return (
    <DatasetPresentation
      results={allData}
      loading={loading}
      endOfRecords={from + size >= total}
      next={more}
      total={total}
      onSelect={({ key }: { key: string | number }) => setPreviewKey(`d_${key}`)}
    />
  );
}
