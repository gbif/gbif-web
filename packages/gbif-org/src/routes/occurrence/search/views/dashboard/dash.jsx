import { ClientSideOnly } from '@/components/clientSideOnly';
import { getAsQuery } from '@/components/filters/filterTools';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useFilters } from '../../filters';
import { searchConfig } from '../../searchConfig';
import { Dashboard as DashboardPresentation } from './dashboard';

export function Dashboard() {
  const currentFilterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  // const [searchPredicate, setSearchPredicate] = useState();
  const [chartsTypes, setChartsTypes] = useState([]);

  const query = useMemo(() => {
    const query = getAsQuery({ filter: currentFilterContext.filter, searchContext, searchConfig });
    return query;
    // const predicate = {
    //   type: 'and',
    //   predicates: [scope, filter2predicate(currentFilterContext.filter, searchConfig)].filter(
    //     (x) => x
    //   ),
    // };
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterContext.filterHash, searchContext]);

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
        predicate={query?.predicate}
        q={query?.q}
        chartsTypes={[
          'map',
          'table',
          'gallery',
          'occurrenceSummary',
          'TaxonomicBreakdown',
          'dataQuality',
          'synonyms',
          'taxa',
          'sex',
          'occurrenceIssue',
          ...chartsTypes,
        ]}
      />
    </ClientSideOnly>
  );
}
