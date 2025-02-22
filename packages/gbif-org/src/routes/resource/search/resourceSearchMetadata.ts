import { SearchMetadata } from '@/contexts/search';
import { Tab } from './resourceSearch';
import { unique } from '@/utils/unique';
import { useMemo } from 'react';

const tabToRelavantFiltersLookup: Record<Tab, string[]> = {
  all: ['q'],
  news: ['q', 'countriesOfCoverage', 'topics'],
  dataUse: ['q', 'countriesOfResearcher', 'countriesOfCoverage', 'topics'],
  event: ['q'], // TODO _showPastEvents
  project: ['q', 'contractCountry', 'gbifProgrammeAcronym', 'purposes'],
  programme: ['q'],
  tool: ['q'],
  document: ['q'],
};

const allFilters = unique(Object.values(tabToRelavantFiltersLookup).flat());

export function useResourceSearchMetadata(tab: Tab): SearchMetadata {
  return useMemo(() => {
    const relevantFilters = tabToRelavantFiltersLookup[tab];

    return {
      queryType: 'PREDICATE',
      highlightedFilters: relevantFilters,
      excludedFilters: allFilters.filter((filter) => !relevantFilters.includes(filter)),
    };
  }, [tab]);
}
