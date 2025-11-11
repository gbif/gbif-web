import React, { useEffect, useContext, useState, useRef, useCallback } from "react";
import { FilterContext } from '../../../..//widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import { Dashboard as DashboardPresentation } from './Dashboard';

function Dashboard() {
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig, filters } = useContext(OccurrenceContext);
  const [searchPredicate, setSearchPredicate] = useState();
  const [chartsTypes, setChartsTypes] = useState([]);

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig)
      ].filter(x => x)
    }
    setSearchPredicate(predicate);
  }, [currentFilterContext.filterHash, rootPredicate]);

  useEffect(() => {
    // set chart types to be names of available filters
    const availableFilters = Object.keys(filters);
    if (filters.iucnRedListCategory) {
      availableFilters.push('iucn');
      availableFilters.push('iucnCounts');
    }
    setChartsTypes(availableFilters);
  }, [filters]);

  return <DashboardPresentation
    predicate={searchPredicate} chartsTypes={['map', 'table', 'gallery', 'occurrenceSummary', 'dataQuality', 'taxa', ...chartsTypes]}
  />
}

export default Dashboard;

