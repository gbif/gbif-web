import { Button } from '@/components/ui/button';
import { FilterContext, FilterType } from '@/contexts/filter';
import { FilterProvider } from '@/contexts/filter';
import { SearchMetadata } from '@/contexts/search';
import React, { useEffect, useState } from 'react';
import { MdArrowBack, MdClose } from 'react-icons/md';
import { FilterSetting } from './filterTools';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '../ui/command';
import { getFilterSummary } from './filterTools';
import { sortFilters } from './More';

type Filters = Record<string, FilterSetting>;

export const MobileFilterDrawerContent = React.forwardRef<
  HTMLDivElement,
  {
    filters: Filters;
    groups?: string[];
    searchContext?: SearchMetadata;
  }
>(({ filters, groups, searchContext }, ref) => {
  const { formatMessage } = useIntl();
  const filterContext = React.useContext(FilterContext);
  const [activeFilterHandle, setActiveFilterHandle] = useState<string | null>(null);
  const [pristine, setPristine] = useState(true);
  const [tmpFilter, setTmpFilter] = useState(filterContext?.filter || {});
  const Content = activeFilterHandle ? filters?.[activeFilterHandle]?.Content : null;

  // onApply function for filter content
  const handleApply = ({ keepOpen, filter }: { keepOpen?: boolean; filter?: FilterType } = {}) => {
    if (filterContext) {
      filterContext.setFilter(filter ?? tmpFilter);
    }
    if (!keepOpen) {
      setActiveFilterHandle(null);
    }
    setPristine(true);
  };

  // onFilterChange callback to track when filter changes
  const onFilterChange = React.useCallback((filter: FilterType) => {
    setTmpFilter(filter);
    setPristine(false);
  }, []);

  // Cancel function to revert changes and close filter
  const handleCancel = React.useCallback(() => {
    setTmpFilter(filterContext?.filter || {});
    setPristine(true);
    setActiveFilterHandle(null);
  }, [filterContext?.filter]);

  // Clear a specific filter
  const handleClearFilter = React.useCallback(
    (filterHandle: string) => {
      if (filterContext?.setFullField) {
        filterContext.setFullField(filterHandle, [], []);
      }
    },
    [filterContext]
  );

  useEffect(() => {
    // Reset pristine state when a filter is selected
    if (activeFilterHandle) {
      setPristine(true);
    }
  }, [activeFilterHandle]);

  // Reset tmpFilter when filter context changes
  useEffect(() => {
    setTmpFilter(filterContext?.filter || {});
    setPristine(true);
  }, [filterContext?.filterHash, filterContext?.filter]);

  return (
    <div className="g-flex g-flex-col g-h-full g-bg-white">
      {activeFilterHandle && (
        <div className="g-flex g-flex-nowrap g-items-center g-border-b">
          <Button size="sm" variant="ghost" className="g-flex-none" onClick={handleCancel}>
            <MdArrowBack />
          </Button>
          <h3 className="g-flex-auto g-text-slate-800 g-text-sm g-font-semibold">
            {filters[activeFilterHandle]?.translatedFilterName}
          </h3>
        </div>
      )}

      <div className="g-flex-1 g-overflow-hidden">
        {!activeFilterHandle && (
          <Command className="g-h-full">
            <CommandInput
              placeholder={formatMessage({
                id: 'search.placeholders.default',
                defaultMessage: 'Search filters',
              })}
            />

            <CommandEmpty className="g-p-4">
              <FormattedMessage
                id="filterSupport.noMathcingFilters"
                defaultMessage="No matching filters"
              />
            </CommandEmpty>

            <CommandList className="g-flex-1 g-overflow-y-auto g-max-h-none">
              <ActiveFilters
                filters={filters}
                onSelectFilter={setActiveFilterHandle}
                onClearFilter={handleClearFilter}
              />

              <HighlightedFilters
                filters={filters}
                searchContext={searchContext}
                onSelectFilter={setActiveFilterHandle}
              />

              <OtherFilters
                filters={filters}
                groups={groups}
                searchContext={searchContext}
                onSelectFilter={setActiveFilterHandle}
              />
            </CommandList>
          </Command>
        )}

        {activeFilterHandle && Content && (
          <div className="g-flex-1 g-overflow-y-auto">
            <FilterProvider filter={tmpFilter} onChange={onFilterChange}>
              <Content
                onApply={handleApply}
                onCancel={handleCancel}
                pristine={pristine}
                ref={ref as React.ForwardedRef<unknown>}
              />
            </FilterProvider>
          </div>
        )}
      </div>
    </div>
  );
});

MobileFilterDrawerContent.displayName = 'MobileFilterDrawerContent';

interface ActiveFiltersProps {
  filters: Filters;
  onSelectFilter: (filterHandle: string) => void;
  onClearFilter: (filterHandle: string) => void;
}

const ActiveFilters = React.memo<ActiveFiltersProps>(
  ({ filters, onSelectFilter, onClearFilter }) => {
    const filterContext = React.useContext(FilterContext);

    const activeFilters = React.useMemo(() => {
      if (!filterContext) return [];

      return Object.keys(filters).filter((handle) => {
        const summary = getFilterSummary(filterContext.filter, handle);
        return summary.defaultCount > 0;
      });
    }, [filters, filterContext]);

    if (activeFilters.length === 0) return null;

    return (
      <>
        <CommandGroup heading={<FormattedMessage id="filterSupport.activeFilters" />}>
          {activeFilters.map((filterHandle) => {
            const filterConfig = filters[filterHandle];
            if (!filterConfig) return null;

            const summary = getFilterSummary(filterContext?.filter || {}, filterHandle);

            return (
              <CommandItem
                key={filterHandle}
                onSelect={() => onSelectFilter(filterHandle)}
                className="g-flex g-items-center g-justify-between"
              >
                <div className="g-flex g-items-center g-gap-2">
                  <span className="g-font-medium g-text-primary-600">
                    {filterConfig.translatedFilterName}
                  </span>
                  <span className="g-font-medium g-bg-primary-400 g-text-xs g-rounded-full g-text-primaryContrast g-size-5 g-flex g-items-center g-justify-center">
                    <FormattedNumber value={summary.defaultCount} />
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearFilter(filterHandle);
                  }}
                  className="g-p-1 g-h-6 g-w-6 g-text-slate-500 hover:g-text-slate-700"
                  aria-label={`Clear ${filterConfig.translatedFilterName} filter`}
                >
                  <MdClose className="g-h-4 g-w-4" />
                </Button>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
      </>
    );
  }
);

ActiveFilters.displayName = 'ActiveFilters';

interface HighlightedFiltersProps {
  filters: Filters;
  searchContext?: SearchMetadata;
  onSelectFilter: (filterHandle: string) => void;
}

const HighlightedFilters = React.memo<HighlightedFiltersProps>(
  ({ filters, searchContext, onSelectFilter }) => {
    const filterContext = React.useContext(FilterContext);

    const inactiveHighlightedFilters = React.useMemo(() => {
      const highlightedFilters = searchContext?.highlightedFilters || [];

      return highlightedFilters.filter((handle) => {
        const summary = getFilterSummary(filterContext?.filter || {}, handle);
        return summary.defaultCount === 0;
      });
    }, [searchContext, filterContext]);

    if (inactiveHighlightedFilters.length === 0) return null;

    return (
      <>
        <CommandGroup heading={<FormattedMessage id="filterSupport.highlighted" />}>
          {inactiveHighlightedFilters.map((filterHandle) => {
            const filterConfig = filters[filterHandle];
            if (!filterConfig) return null;

            return (
              <CommandItem
                key={filterHandle}
                onSelect={() => onSelectFilter(filterHandle)}
                className="g-flex g-items-center g-justify-between"
              >
                <div className="g-flex g-items-center g-gap-2">
                  <span className="g-font-medium g-text-slate-700">
                    {filterConfig.translatedFilterName}
                  </span>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
      </>
    );
  }
);

HighlightedFilters.displayName = 'HighlightedFilters';

interface OtherFiltersProps {
  filters: Filters;
  groups?: string[];
  searchContext?: SearchMetadata;
  onSelectFilter: (filterHandle: string) => void;
}

const OtherFilters = React.memo<OtherFiltersProps>(
  ({ filters, groups, searchContext, onSelectFilter }) => {
    const filterContext = React.useContext(FilterContext);

    const filterState = React.useMemo(() => {
      // Get highlighted filters (configured to be highlighted by default)
      const highlightedFilters = searchContext?.highlightedFilters || [];

      // Get all other filters (non-highlighted and inactive)
      const otherFilters = Object.keys(filters)
        .filter((handle) => {
          // Exclude highlighted filters
          if (highlightedFilters.includes(handle)) return false;

          // Exclude active filters (they go in the "Active filters" section)
          if (filterContext) {
            const summary = getFilterSummary(filterContext.filter, handle);
            if (summary.defaultCount > 0) return false;
          }

          return true;
        })
        .sort(sortFilters(filters));

      // Filter groups to only show groups with filters in them
      const filteredGroups = groups?.filter((group) =>
        otherFilters.some((filterHandle) => filters[filterHandle]?.group === group)
      );

      const hasGroups = filteredGroups && filteredGroups.length > 0;

      return {
        otherFilters,
        filteredGroups,
        hasGroups,
      };
    }, [filters, groups, searchContext, filterContext]);

    if (filterState.otherFilters.length === 0) return null;

    return (
      <>
        {!filterState.hasGroups && (
          <CommandGroup>
            {filterState.otherFilters.map((filterHandle) => {
              const filterConfig = filters[filterHandle];
              if (!filterConfig) return null;

              return (
                <CommandItem key={filterHandle} onSelect={() => onSelectFilter(filterHandle)}>
                  {filterConfig.translatedFilterName}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
        {filterState.hasGroups &&
          filterState.filteredGroups?.map((group, i) => {
            const groupFilters = filterState.otherFilters.filter(
              (filterHandle) => filters[filterHandle]?.group === group
            );

            if (groupFilters.length === 0) return null;

            return (
              <React.Fragment key={group}>
                <CommandGroup heading={<FormattedMessage id={`dashboard.group.${group}`} />}>
                  {groupFilters.map((filterHandle) => {
                    const filterConfig = filters[filterHandle];
                    if (!filterConfig) return null;

                    return (
                      <CommandItem key={filterHandle} onSelect={() => onSelectFilter(filterHandle)}>
                        {filterConfig.translatedFilterName}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {i < (filterState.filteredGroups?.length ?? 0) - 1 && <CommandSeparator />}
              </React.Fragment>
            );
          })}
      </>
    );
  }
);

OtherFilters.displayName = 'OtherFilters';
