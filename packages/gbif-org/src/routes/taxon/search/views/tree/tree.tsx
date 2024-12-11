import { useEffect, useContext, useCallback, useState } from 'react';
import { FilterContext } from '@/contexts/filter';
import useQuery from '@/hooks/useQuery';
import { filter2predicate } from '@/dataManagement/filterAdapter';
import { useSearchContext } from '@/contexts/search';
import { searchConfig } from '../../searchConfig';
import { TreePresentation } from './treePresentation';
import { useStringParam } from '@/hooks/useParam';
import { useOrderedList } from '@/routes/occurrence/search/views/browseList/useOrderedList';

const OCCURRENCE_DATASETS = `
query occurrenceTrees($predicate: Predicate, $size: Int) {
  occurrenceSearch(predicate: $predicate, size: 0, from: 0) {
    cardinality {
      treeKey
    }
    facet {
      treeKey(size: $size) {
        count
        key
        tree {
          key
          title
          excerpt
        }
      }
    }
  }
}
`;

export function Tree({ size: defaultSize = 100 }) {
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
  }, [currentFilterContext.filterHash, defaultSize]);

  const more = useCallback(() => {
    setSize(size + 100);
  }, [size]);

  // update ordered list on items change
  useEffect(() => {
    setOrderedList(allData.map((item) => `d_${item.key}`));
  }, [allData, setOrderedList]);

  useEffect(() => {
    setAllData((prev) => {
      const all = [...prev, ...(data?.occurrenceSearch?.facet?.treeKey || [])];
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
      predicates: [scope, filter2predicate(currentFilterContext.filter, searchConfig)].filter(
        (x) => x
      ),
    };
    load({ keepDataWhileLoading: true, variables: { predicate, size } });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, currentFilterContext.filterHash, scope, load, size]);

  useEffect(() => {
    setFrom(0);
    setAllData([]);
  }, [currentFilterContext.filterHash, scope]);

  const total = data?.occurrenceSearch?.cardinality?.treeKey;
  return (
    <TreePresentation
      results={allData}
      loading={loading}
      endOfRecords={from + size >= total}
      next={more}
      total={total}
      onSelect={({ key }: { key: string | number }) => setPreviewKey(`d_${key}`)}
    />
  );
}
