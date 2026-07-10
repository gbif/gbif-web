import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { FilterContext, FilterType } from '@/contexts/filter';
import { FilterProvider } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import React, { useEffect, useMemo, useState } from 'react';
import { MdArrowBack, MdChevronRight, MdClose } from 'react-icons/md';
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
import { normalizeString } from '@/utils/normalizeString';

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

  // Clear every filter in the drawer; preserves checklistKey from the current filter.
  const handleClearAll = React.useCallback(() => {
    if (!filterContext) return;
    const { checklistKey } = filterContext.filter || {};
    filterContext.setFilter(checklistKey ? { checklistKey } : {});
  }, [filterContext]);

  const hasActiveFilters = useMemo(() => {
    if (!filterContext) return false;
    return Object.keys(filters).some((handle) => {
      const summary = getFilterSummary(filterContext.filter, handle);
      return summary.defaultCount > 0;
    });
  }, [filterContext, filters]);

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
      {activeFilterHandle ? (
        <div className="g-flex g-flex-nowrap g-items-center g-gap-1 g-px-2 g-h-14 g-border-b g-border-solid g-border-slate-200">
          <Button
            size="sm"
            variant="ghost"
            aria-label={formatMessage({
              id: 'filterSupport.backToFilterList',
              defaultMessage: 'Back to filter list',
            })}
            className="g-flex-none g-min-w-11 g-min-h-11 sm:g-min-w-9 sm:g-min-h-9 g-justify-center g-text-slate-600"
            onClick={handleCancel}
          >
            <MdArrowBack className="g-h-6 g-w-6 sm:g-h-5 sm:g-w-5" />
          </Button>
          <h3 className="g-flex-auto g-text-slate-800 g-text-base g-font-semibold g-m-0">
            {filters[activeFilterHandle]?.translatedFilterName}
          </h3>
        </div>
      ) : (
        <div className="g-flex g-flex-nowrap g-items-center g-justify-between g-px-4 g-h-14 g-border-b g-border-solid g-border-slate-200">
          <h3 className="g-text-slate-800 g-text-base g-font-semibold g-m-0">
            <FormattedMessage id="filterSupport.filters" defaultMessage="Filters" />
          </h3>
          <DialogClose asChild>
            <Button
              size="sm"
              variant="ghost"
              aria-label={formatMessage({ id: 'phrases.close', defaultMessage: 'Close' })}
              className="g-min-w-11 g-min-h-11 sm:g-min-w-9 sm:g-min-h-9 g-justify-center g-text-slate-500 hover:g-text-slate-800 -g-me-2"
            >
              <MdClose className="g-h-6 g-w-6 sm:g-h-5 sm:g-w-5" />
            </Button>
          </DialogClose>
        </div>
      )}

      <Command
        className={cn('g-flex-1 g-min-h-0', activeFilterHandle && 'g-hidden')}
        aria-hidden={activeFilterHandle ? true : undefined}
        filter={(value, search) => {
          if (normalizeString(value).includes(normalizeString(search))) return 1;
          return 0;
        }}
      >
        <div className="g-relative g-px-3 g-py-2 g-border-b g-border-solid g-border-slate-200">
          <CommandInput
            value={searchValue}
            onValueChange={setSearchValue}
            autoFocus={false}
            placeholder={formatMessage({
              id: 'search.placeholders.default',
              defaultMessage: 'Search filters',
            })}
            wrapperClassName="g-border-b-0 g-rounded g-bg-slate-100 g-px-3 focus-within:g-ring-2 focus-within:g-ring-blue-400/70 focus-within:g-ring-offset-0 g-ring-inset"
            iconClassName="g-h-5 g-w-5 g-opacity-60"
            className={cn('g-h-11 g-text-base', searchValue && 'g-pe-9')}
          />
          {searchValue && (
            <button
              type="button"
              aria-label={formatMessage({
                id: 'filterSupport.clear',
                defaultMessage: 'Clear',
              })}
              onClick={() => setSearchValue('')}
              className="g-absolute g-top-1/2 g-end-5 g--translate-y-1/2 g-flex g-items-center g-justify-center g-h-7 g-w-7 g-rounded-full g-text-slate-500 hover:g-text-slate-700 hover:g-bg-slate-200 focus:g-outline-none focus-visible:g-ring-2 focus-visible:g-ring-blue-400/70"
            >
              <MdClose className="g-h-4 g-w-4" />
            </button>
          )}
        </div>

        <CommandEmpty className="g-p-4">
          <FormattedMessage
            id="filterSupport.noMathcingFilters"
            defaultMessage="No matching filters"
          />
        </CommandEmpty>

        <CommandList className="g-flex-1 g-px-2 g-overflow-y-auto g-max-h-none" key={listVersion}>
          <ActiveFilters filters={filters} onSelectFilter={setActiveFilterHandle} />

          <HighlightedFilters filters={filters} onSelectFilter={setActiveFilterHandle} />

          <OtherFilters filters={filters} groups={groups} onSelectFilter={setActiveFilterHandle} />
        </CommandList>
      </Command>

      {activeFilterHandle && Content && (
        <div className="g-flex g-flex-col g-flex-1 g-min-h-0">
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

      {!activeFilterHandle && (
        <div className="g-flex g-items-center g-gap-2 g-px-4 g-py-3 g-border-t g-border-solid g-border-slate-200 g-bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
            className="g-flex-none g-h-11 g-px-4 g-text-slate-700 disabled:g-opacity-40"
          >
            <FormattedMessage id="filterSupport.clearAll" defaultMessage="Clear all" />
          </Button>
          <DialogClose asChild>
            <Button type="button" className="g-flex-1 g-h-11 g-text-base g-font-medium">
              <FormattedMessage id="filterSupport.apply" defaultMessage="Apply" />
            </Button>
          </DialogClose>
        </div>
      )}
    </div>
  );
});

MobileFilterDrawerContent.displayName = 'MobileFilterDrawerContent';

interface ActiveFiltersProps {
  filters: Filters;
  onSelectFilter: (filterHandle: string) => void;
}

const ActiveFilters = React.memo<ActiveFiltersProps>(({ filters, onSelectFilter }) => {
  const filterContext = React.useContext(FilterContext);
  const intl = useIntl();

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
          const rawAlias = intl.messages[`filterAliases.${filter.handle}`];
          const aliases = typeof rawAlias === 'string' ? rawAlias : '';
          const searchValue = aliases
            ? `${filter.translatedFilterName} ${aliases}`
            : filter.translatedFilterName;

          return (
            <CommandItem
              key={filter.handle}
              value={searchValue}
              onSelect={() => onSelectFilter(filter.handle)}
              className="g-flex g-items-center g-justify-between g-py-3"
            >
              <span className="g-font-medium g-text-slate-700">{filter.translatedFilterName}</span>
              <span className="g-ms-auto g-font-medium g-bg-slate-700 g-text-xs g-rounded-full g-text-white g-size-5 g-flex g-items-center g-justify-center">
                <FormattedNumber value={summary.defaultCount} />
              </span>
              <MdChevronRight
                aria-hidden="true"
                className="gbif-rtl-icon g-ms-1 g-h-5 g-w-5 g-text-slate-400"
              />
            </CommandItem>
          );
        })}
      </CommandGroup>
      <CommandSeparator />
    </>
  );
});

ActiveFilters.displayName = 'ActiveFilters';

interface HighlightedFiltersProps {
  filters: Filters;
  onSelectFilter: (filterHandle: string) => void;
}

const HighlightedFilters = React.memo<HighlightedFiltersProps>(({ filters, onSelectFilter }) => {
  const searchContext = useSearchContext();
  const filterContext = React.useContext(FilterContext);
  const intl = useIntl();

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
        heading={
          allFiltersHighlighted ? undefined : <FormattedMessage id="filterSupport.highlighted" />
        }
      >
        {inactiveHighlightedFilters.map((filter) => {
          const rawAlias = intl.messages[`filterAliases.${filter.handle}`];
          const aliases = typeof rawAlias === 'string' ? rawAlias : '';
          const searchValue = aliases
            ? `${filter.translatedFilterName} ${aliases}`
            : filter.translatedFilterName;
          return (
            <CommandItem
              key={filter.handle}
              value={searchValue}
              onSelect={() => onSelectFilter(filter.handle)}
              className="g-flex g-items-center g-justify-between g-py-3"
            >
              <div className="g-flex g-items-center g-gap-2">
                <span className="g-font-medium g-text-slate-700">
                  {filter.translatedFilterName}
                </span>
              </div>
              <MdChevronRight
                aria-hidden="true"
                className="gbif-rtl-icon g-ms-auto g-h-5 g-w-5 g-text-slate-400"
              />
            </CommandItem>
          );
        })}
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
  const intl = useIntl();

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
          {otherFilters.map((filter) => {
            const rawAlias = intl.messages[`filterAliases.${filter.handle}`];
            const aliases = typeof rawAlias === 'string' ? rawAlias : '';
            const searchValue = aliases
              ? `${filter.translatedFilterName} ${aliases}`
              : filter.translatedFilterName;
            return (
              <CommandItem
                key={filter.handle}
                value={searchValue}
                onSelect={() => onSelectFilter(filter.handle)}
                className="g-flex g-items-center g-justify-between g-py-3"
              >
                {filter.translatedFilterName}
                <MdChevronRight
                  aria-hidden="true"
                  className="gbif-rtl-icon g-ms-auto g-h-5 g-w-5 g-text-slate-400"
                />
              </CommandItem>
            );
          })}
        </CommandGroup>
      )}
      {hasGroups &&
        filteredGroups?.map((group, i) => {
          return (
            <React.Fragment key={group.name}>
              <CommandGroup heading={<FormattedMessage id={`dashboard.group.${group.name}`} />}>
                {group.filters.map((filter) => {
                  const rawAlias = intl.messages[`filterAliases.${filter.handle}`];
                  const aliases = typeof rawAlias === 'string' ? rawAlias : '';
                  const searchValue = aliases
                    ? `${filter.translatedFilterName} ${aliases}`
                    : filter.translatedFilterName;
                  return (
                    <CommandItem
                      key={filter.handle}
                      value={searchValue}
                      onSelect={() => onSelectFilter(filter.handle)}
                      className="g-flex g-items-center g-justify-between g-py-3"
                    >
                      {filter.translatedFilterName}
                      <MdChevronRight
                        aria-hidden="true"
                        className="gbif-rtl-icon g-ms-auto g-h-5 g-w-5 g-text-slate-400"
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {i < (filteredGroups?.length ?? 0) - 1 && <CommandSeparator />}
            </React.Fragment>
          );
        })}
    </>
  );
});

OtherFilters.displayName = 'OtherFilters';
