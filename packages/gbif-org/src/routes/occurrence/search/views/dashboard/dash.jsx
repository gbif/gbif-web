import { useEffect, useContext, useState } from 'react';
import { Dashboard as DashboardPresentation } from './dashboard';
import { FilterContext } from '@/contexts/filter';
import { filter2predicate } from '@/dataManagement/filterAdapter';
import { searchConfig } from '../../searchConfig';
import { useSearchContext } from '@/contexts/search';
import { useFilters } from '../../filters';
import { ClientSideOnly } from '@/components/clientSideOnly';

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
          'taxa',
          ...chartsTypes,
        ]}
      />
    </ClientSideOnly>
  );
}
