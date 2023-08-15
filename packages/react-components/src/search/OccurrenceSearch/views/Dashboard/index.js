import React, { useEffect, useContext, useState, useRef, useCallback } from "react";
import { FilterContext } from '../../../..//widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import { Dashboard as DashboardPresentation } from './Dashboard';

function Dashboard() {
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(OccurrenceContext);
  const [searchPredicate, setSearchPredicate] = useState();

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

  return <DashboardPresentation
    predicate={searchPredicate}
  />
}

export default Dashboard;

