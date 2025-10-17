import { Button } from '@/components/ui/button';
import { FilterContext, FilterType } from '@/contexts/filter';
import { FilterProvider } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import React, { useEffect, useState } from 'react';
import { MdArrowBack, MdClose } from 'react-icons/md';
import { Filters, sortFilters } from './filterTools';
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
import { cn } from '@/utils/shadcn';

export const MobileFilterDrawerContent = React.forwardRef<
  HTMLDivElement,
  {
    filters: Filters;
    groups?: string[];
  }
>(({ filters, groups }, ref) => {
  const { formatMessage } = useIntl();
  const filterContext = React.useContext(FilterContext);
  const [activeFilterHandle, setActiveFilterHandle] = useState<string | null>(null);
  const [pristine, setPristine] = useState(true);
  const [tmpFilter, setTmpFilter] = useState(filterContext?.filter || {});
  const [searchValue, setSearchValue] = useState('');
  const Content = activeFilterHandle ? filters?.[activeFilterHandle]?.Content : null;
  const [listVersion, setListVersion] = useState(0);

  // onApply function for filter content
  const handleApply = ({ keepOpen, filter }: { keepOpen?: boolean; filter?: FilterType } = {}) => {
    if (filterContext) {
      filterContext.setFilter(filter ?? tmpFilter);
    }
    if (!keepOpen) {
      setActiveFilterHandle(null);
      // Scroll Command list to top when filter is applied
      setListVersion((v) => v + 1);
      // Clear the search input when filter is applied
      setSearchValue('');
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

      <Command
        className={cn('g-h-full', activeFilterHandle && 'g-hidden')}
        aria-hidden={activeFilterHandle ? true : undefined}
      >
        <CommandInput
          value={searchValue}
          onValueChange={setSearchValue}
          autoFocus={false}
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

        <CommandList className="g-flex-1 g-overflow-y-auto g-max-h-none" key={listVersion}>
          <ActiveFilters
            filters={filters}
            onSelectFilter={setActiveFilterHandle}
            onClearFilter={handleClearFilter}
          />

          <HighlightedFilters filters={filters} onSelectFilter={setActiveFilterHandle} />

          <OtherFilters filters={filters} groups={groups} onSelectFilter={setActiveFilterHandle} />
        </CommandList>
      </Command>

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

      return Object.values(filters)
        .filter((filter) => {
          const summary = getFilterSummary(filterContext.filter, filter.handle);
          return summary.defaultCount > 0;
        })
        .sort(sortFilters);
    }, [filters, filterContext]);

    if (activeFilters.length === 0) return null;

    return (
      <>
        <CommandGroup heading={<FormattedMessage id="filterSupport.activeFilters" />}>
          {activeFilters.map((filter) => {
            const summary = getFilterSummary(filterContext?.filter || {}, filter.handle);

            return (
              <CommandItem
                key={filter.handle}
                onSelect={() => onSelectFilter(filter.handle)}
                className="g-flex g-items-center g-justify-between"
              >
                <div className="g-flex g-items-center g-gap-2">
                  <span className="g-font-medium g-text-primary-600">
                    {filter.translatedFilterName}
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
                    onClearFilter(filter.handle);
                  }}
                  className="g-p-1 g-h-6 g-w-6 g-text-slate-500 hover:g-text-slate-700"
                  aria-label={`Clear ${filter.translatedFilterName} filter`}
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
  onSelectFilter: (filterHandle: string) => void;
}

const HighlightedFilters = React.memo<HighlightedFiltersProps>(({ filters, onSelectFilter }) => {
  const searchContext = useSearchContext();
  const filterContext = React.useContext(FilterContext);

  const inactiveHighlightedFilters = React.useMemo(() => {
    const highlightedFilters = searchContext?.highlightedFilters || [];

    return highlightedFilters
      .filter((handle) => handle in filters)
      .filter((handle) => {
        const summary = getFilterSummary(filterContext?.filter || {}, handle);
        return summary.defaultCount === 0;
      })
      .map((handle) => filters[handle]);
  }, [searchContext, filterContext, filters]);

  // If all filters are highlighted, there is no need to show the group heading
  const allFiltersHighlighted = React.useMemo(() => {
    if (!searchContext?.highlightedFilters) return false;
    return Object.keys(filters).every((handle) =>
      searchContext?.highlightedFilters?.includes(handle)
    );
  }, [filters, searchContext]);

  if (inactiveHighlightedFilters.length === 0) return null;

  return (
    <>
      <CommandGroup
        heading={allFiltersHighlighted || <FormattedMessage id="filterSupport.highlighted" />}
      >
        {inactiveHighlightedFilters.map((filter) => (
          <CommandItem
            key={filter.handle}
            onSelect={() => onSelectFilter(filter.handle)}
            className="g-flex g-items-center g-justify-between"
          >
            <div className="g-flex g-items-center g-gap-2">
              <span className="g-font-medium g-text-slate-700">{filter.translatedFilterName}</span>
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
      {allFiltersHighlighted || <CommandSeparator />}
    </>
  );
});

HighlightedFilters.displayName = 'HighlightedFilters';

interface OtherFiltersProps {
  filters: Filters;
  groups?: string[];
  onSelectFilter: (filterHandle: string) => void;
}

const OtherFilters = React.memo<OtherFiltersProps>(({ filters, groups, onSelectFilter }) => {
  const searchContext = useSearchContext();
  const filterContext = React.useContext(FilterContext);

  const { otherFilters, filteredGroups, hasGroups } = React.useMemo(() => {
    // Get highlighted filters (configured to be highlighted by default)
    const highlightedFilters = searchContext?.highlightedFilters || [];

    // Get all other filters (non-highlighted and inactive)
    const otherFilters = Object.values(filters)
      .filter((filter) => {
        // Exclude highlighted filters
        if (highlightedFilters.includes(filter.handle)) return false;

        // Exclude active filters (they go in the "Active filters" section)
        if (filterContext) {
          const summary = getFilterSummary(filterContext.filter, filter.handle);
          if (summary.defaultCount > 0) return false;
        }

        return true;
      })
      .sort(sortFilters);

    // Filter groups to only show groups with filters in them
    const filteredGroups = groups
      ?.map((group) => ({
        name: group,
        filters: otherFilters.filter((filter) => filter.group === group),
      }))
      .filter((group) => group.filters.length > 0);

    const hasGroups = filteredGroups && filteredGroups.length > 0;

    return {
      otherFilters,
      filteredGroups,
      hasGroups,
    };
  }, [filters, groups, searchContext, filterContext]);

  if (otherFilters.length === 0) return null;

  return (
    <>
      {!hasGroups && (
        <CommandGroup>
          {otherFilters.map((filter) => (
            <CommandItem key={filter.handle} onSelect={() => onSelectFilter(filter.handle)}>
              {filter.translatedFilterName}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
      {hasGroups &&
        filteredGroups?.map((group, i) => {
          return (
            <React.Fragment key={group.name}>
              <CommandGroup heading={<FormattedMessage id={`dashboard.group.${group.name}`} />}>
                {group.filters.map((filter) => (
                  <CommandItem key={filter.handle} onSelect={() => onSelectFilter(filter.handle)}>
                    {filter.translatedFilterName}
                  </CommandItem>
                ))}
              </CommandGroup>
              {i < (filteredGroups?.length ?? 0) - 1 && <CommandSeparator />}
            </React.Fragment>
          );
        })}
    </>
  );
});

OtherFilters.displayName = 'OtherFilters';
