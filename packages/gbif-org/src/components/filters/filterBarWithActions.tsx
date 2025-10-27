import { Button } from '@/components/ui/button';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { cn } from '@/utils/shadcn';
import React, { useContext, useMemo } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { FilterBar, FilterButtons } from './filterTools';
import { MobileFilters } from './mobileFilters';
import { Filters } from './filterTools';

interface FilterBarWithActionsProps {
  filters: Filters;
  groups?: string[];
  additionalActions?: React.ReactNode;
  className?: string;
}

export function FilterBarWithActions({
  filters,
  groups,
  additionalActions,
  className,
}: FilterBarWithActionsProps) {
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();

  // Count visible filters, accounting for excluded filters
  const visibleFilterCount = useMemo(() => {
    return Object.keys(filters).filter(
      (filter) => !searchContext?.excludedFilters?.includes(filter)
    ).length;
  }, [filters, searchContext]);

  // If 2 or fewer filters, always show FilterButtons and never show MobileFilters
  const shouldShowMobileFilters = visibleFilterCount > 2;

  return (
    <FilterBar className={cn('g-flex f-flex-nowrap g-items-start g-gap-2', className)}>
      <div className={cn(shouldShowMobileFilters && 'g-hidden sm:g-block')}>
        <FilterButtons filters={filters} searchContext={searchContext} groups={groups} />
      </div>
      <div className="g-flex g-items-center g-gap-1 g-flex-1 g-justify-end">
        {shouldShowMobileFilters && (
          <MobileFilters className="sm:g-hidden" filters={filters} groups={groups} />
        )}
        {additionalActions}
        <Button
          size="sm"
          variant="ghost"
          className="g-px-1 g-mb-1 g-text-slate-400 hover:g-text-red-800"
          onClick={() => filterContext?.setFilter({})}
        >
          <MdDeleteOutline className="g-text-base" />
        </Button>
      </div>
    </FilterBar>
  );
}
