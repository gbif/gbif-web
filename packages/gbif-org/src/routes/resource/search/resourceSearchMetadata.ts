import { SearchMetadata } from '@/contexts/search';
import { useMemo } from 'react';
import { allFilters, tabsConfig } from './tabsConfig';

export function useResourceSearchMetadata(tab: string): SearchMetadata {
  return useMemo(() => {
    const { contentTypes, filters: relevantFilters } = tabsConfig[tab];

    return {
      queryType: 'PREDICATE',
      highlightedFilters: relevantFilters,
      excludedFilters: allFilters.filter((filter) => !relevantFilters.includes(filter)),
      scope: {
        type: 'in',
        key: 'contentType',
        values: contentTypes,
      },
    };
  }, [tab]);
}
