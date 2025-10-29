import { Button } from '@/components/ui/button';
import { Dialog, DialogBottomSheetContent, DialogTrigger } from '@/components/ui/dialog';
import { FilterContext } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import { useContext, useMemo } from 'react';
import { LuSettings2 as FilterIcon } from 'react-icons/lu';
import { Filters, FilterSetting, getFilterSummary } from './filterTools';
import { MobileFilterDrawerContent } from './mobileFilterDrawer';
import { FormattedNumber } from 'react-intl';
import { useSearchContext } from '@/contexts/search';

interface MobileFiltersProps {
  filters: Filters;
  groups?: string[];
  className?: string;
}

export function MobileFilters({ filters, groups, className }: MobileFiltersProps) {
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();

  const { inlineFilters, otherFilters } = useMemo(() => {
    const enabledFilters = { ...filters };
    searchContext?.excludedFilters?.forEach((filter) => {
      delete enabledFilters[filter];
    });

    // Extract inline filters (q and eventFiltering) to show them outside the drawer
    const inlineFilters: FilterSetting[] = [];
    const highlightedFilters = searchContext?.highlightedFilters || [];

    if (highlightedFilters.includes('q') && enabledFilters.q) {
      inlineFilters.push(enabledFilters.q);
      delete enabledFilters.q;
    }

    // eventFiltering is always inline when present
    if (enabledFilters.eventFiltering) {
      inlineFilters.push(enabledFilters.eventFiltering);
      delete enabledFilters.eventFiltering;
    }

    return {
      inlineFilters,
      otherFilters: enabledFilters,
    };
  }, [filters, searchContext]);

  const activeFilterCount = useMemo(() => {
    if (!filterContext) return 0;

    // Count all active filters
    const otherFilterHandles = Object.keys(otherFilters);
    return otherFilterHandles.reduce((count, handle) => {
      const summary = getFilterSummary(filterContext.filter, handle);
      return count + summary.defaultCount;
    }, 0);
  }, [filterContext, otherFilters]);

  return (
    <div className={cn('g-flex g-flex-1 g-flex-row g-items-center g-gap-1', className)}>
      {inlineFilters.map((filter) => (
        <filter.Button key={filter.handle} />
      ))}
      {Object.keys(otherFilters).length > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="g-relative g-px-1 g-mb-1 g-text-slate-400 g-ml-auto"
            >
              <FilterIcon className="g-text-base" />
              {activeFilterCount > 0 && (
                <span className="g-absolute -g-top-1 -g-right-1 g-bg-primary-500 g-text-white g-text-xs g-rounded-full g-size-5 g-flex g-items-center g-justify-center g-font-medium">
                  <FormattedNumber value={activeFilterCount} />
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogBottomSheetContent
            className="g-w-full g-p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <MobileFilterDrawerContent filters={otherFilters} groups={groups} />
          </DialogBottomSheetContent>
        </Dialog>
      )}
    </div>
  );
}
