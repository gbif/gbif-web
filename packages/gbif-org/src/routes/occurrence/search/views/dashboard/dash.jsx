import { ClientSideOnly } from '@/components/clientSideOnly';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { filter2predicate } from '@/dataManagement/filterAdapter';
import { useContext, useEffect, useState } from 'react';
import { useFilters } from '../../filters';
import { searchConfig } from '../../searchConfig';
import { Dashboard as DashboardPresentation } from './dashboard';

export function Dashboard() {
  const currentFilterContext = useContext(FilterContext);
  const { scope } = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const [searchPredicate, setSearchPredicate] = useState();
  const [chartsTypes, setChartsTypes] = useState([]);

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [scope, filter2predicate(currentFilterContext.filter, searchConfig)].filter(
        (x) => x
      ),
    };
    setSearchPredicate(predicate);
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterContext.filterHash, scope]);

  useEffect(() => {
    // set chart types to be names of available filters
    const availableFilters = Object.keys(filters);
    if (filters.iucnRedListCategory) {
      availableFilters.push('iucn');
      availableFilters.push('iucnCounts');
    }
    setChartsTypes(availableFilters);
  }, [filters]);
  return (
    <ClientSideOnly>
      <DashboardPresentation
        predicate={searchPredicate}
        chartsTypes={[
          'map',
          'table',
          'gallery',
          'occurrenceSummary',
          'dataQuality',
          'synonyms',
          'taxa',
          'sex',
          ...chartsTypes,
        ]}
      />
    </ClientSideOnly>
  );
}
