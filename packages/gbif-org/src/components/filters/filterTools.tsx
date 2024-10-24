import React, { useContext } from 'react';
import { SuggestFilter } from './suggestFilter';
import { FilterPopover } from './filterPopover';
import {
  filter2predicate,
  FilterConfigType,
} from '@/dataManagement/filterAdapter/filter2predicate';
import { IntlShape } from 'react-intl';
import { EnumFilter } from './enumFilter';
import { FilterContext, FilterType } from '@/contexts/filter';
import { SearchMetadata } from '@/contexts/search';
import { filter2v1 } from '@/dataManagement/filterAdapter';
import { FilterButton } from './filterButton';
import { QFilter } from './QFilter';
import { QInlineButtonFilter } from './QInlineButtonFilter';
import { cn } from '@/utils/shadcn';
import { SuggestionItem } from './suggest';
import MoreFilters from './More';
import { RangeFilter } from './rangeFilter';

export const filterConfigTypes = {
  SUGGEST: 'SUGGEST',
  ENUM: 'ENUM',
  FREE_TEXT: 'FREE_TEXT',
  RANGE: 'RANGE',
};

export type filterConfigShared = {
  filterType: string;
  filterHandle: string;
  displayName: React.FC<{ id: string | number | object }>;
  filterTranslation: string;
  content?: React.FC;
  facetQuery?: string;
  filterButtonProps?: { hideSingleValues: boolean };
};

export type filterConfig = {
  filterType: string;
  filterHandle: string;
  displayName: React.FC<{ id: string | number | object }>;
  filterTranslation: string;
  content?: React.FC;
  options?: string[];
  suggest?: (args: { q: string; intl?: IntlShape }) => Promise<SuggestionItem[]>;
  facetQuery?: string;
  filterButtonProps?: { hideSingleValues: boolean };
  regex?: RegExp;
};

// generic type for a facet query
export interface FacetQuery {
  search: {
    facet?: {
      field?: Array<{
        name: string;
        count: number;
        item?: {
          title?: string | null;
        } | null;
      }>;
    } | null;
  };
}

export type FacetQueryResponse = {
  data: {
    search: {
      facet: {
        field: {
          name: string;
          count: number;
          item?: {
            title: string;
          };
        }[];
      };
    };
  };
};

function getPopoverFilter({
  Content,
}: {
  Content: React.FC<{
    onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
    onCancel?: () => void;
    className?: string;
    style?: React.CSSProperties;
  }>;
}) {
  return function PopoverFilter({ trigger }: { trigger: React.ReactNode }) {
    return (
      <FilterPopover trigger={trigger}>
        <Content />
      </FilterPopover>
    );
  };
}

const getSuggestFilter = ({
  config,
  searchConfig,
}: {
  config: filterConfig;
  searchConfig: FilterConfigType;
}) => {
  return React.forwardRef(
    (
      {
        onApply,
        onCancel,
        className,
        style,
        pristine,
      }: {
        onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
        onCancel?: () => void;
        className?: string;
        style?: React.CSSProperties;
        pristine?: boolean;
      },
      ref
    ) => {
      return (
        <SuggestFilter
          ref={ref}
          getSuggestions={config.suggest}
          facetQuery={config.facetQuery}
          filterHandle={config.filterHandle}
          DisplayName={config.displayName}
          disableFacetsForSelected={config.disableFacetsForSelected}
          searchConfig={searchConfig}
          {...{ onApply, onCancel, className, style, pristine }}
        />
      );
    }
  );
};

const getFreeTextFilter = ({
  config,
}: {
  config: filterConfig;
  searchConfig: FilterConfigType;
}) => {
  return React.forwardRef(
    (
      {
        onApply,
        onCancel,
        className,
        style,
        pristine,
      }: {
        onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
        onCancel?: () => void;
        className?: string;
        style?: React.CSSProperties;
        pristine?: boolean;
      },
      ref
    ) => {
      return (
        <QFilter
          ref={ref}
          filterHandle={config.filterHandle}
          {...{ onApply, onCancel, className, style, pristine }}
        />
      );
    }
  );
};

const getEnumFilter = ({
  config,
  searchConfig,
}: {
  config: filterConfig;
  searchConfig: FilterConfigType;
}) => {
  return React.forwardRef(
    (
      {
        onApply,
        onCancel,
        className,
        style,
        pristine,
      }: {
        onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
        onCancel?: () => void;
        className?: string;
        style?: React.CSSProperties;
        pristine?: boolean;
      },
      ref
    ) => {
      return (
        <EnumFilter
          ref={ref}
          enumOptions={config.options}
          facetQuery={config.facetQuery}
          filterHandle={config.filterHandle}
          DisplayName={config.displayName}
          searchConfig={searchConfig}
          {...{ onApply, onCancel, className, style, pristine }}
        />
      );
    }
  );
};

const getRangeFilter = ({
  config,
  searchConfig,
}: {
  config: filterConfig;
  searchConfig: FilterConfigType;
}) => {
  return React.forwardRef(
    (
      {
        onApply,
        onCancel,
        className,
        style,
        pristine,
      }: {
        onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
        onCancel?: () => void;
        className?: string;
        style?: React.CSSProperties;
        pristine?: boolean;
      },
      ref
    ) => {
      return (
        <RangeFilter
          ref={ref}
          regex={config.regex}
          filterHandle={config.filterHandle}
          DisplayName={config.displayName}
          searchConfig={searchConfig}
          {...{ onApply, onCancel, className, style, pristine }}
        />
      );
    }
  );
};

export type FilterSetting = {
  Button: React.FC<{ className?: string }>;
  Popover: React.FC<{ trigger: React.ReactNode }>;
  Content: React.FC<{
    onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
    onCancel?: () => void;
    ref: React.ForwardedRef<unknown>;
    className?: string;
    style?: React.CSSProperties;
    pristine?: boolean;
  }>;
  name: string;
  handle: string;
  DisplayName: React.FC<{ id: string | number | object }>;
  translatedFilterName: string;
};

type FilterSettingDefaults = {
  Button: React.FC<{ className?: string }>;
  Popover: React.FC<{ trigger: React.ReactNode }>;
  name: string;
  handle: string;
  DisplayName: React.FC<{ id: string | number | object }>;
  translatedFilterName: string;
};

type ContentShared = {
  onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
  onCancel?: () => void;
  ref: React.ForwardedRef<unknown>;
  className?: string;
  style?: React.CSSProperties;
  pristine?: boolean;
};

export type FilterSettingSuggest = FilterSettingDefaults & {
  Content: React.FC<
    ContentShared & {
      disableFacetsForSelected: boolean;
      facetQuery?: string;
      getSuggestions?: ({ q, intl }: { q: string; intl?: IntlShape }) => Promise<SuggestionItem[]>;
    }
  >;
};

export function generateFilter({
  Content,
  config,
  formatMessage,
}: {
  config: filterConfig;
  formatMessage: IntlShape['formatMessage'];
  Content: React.FC;
}): FilterSetting {
  const PopoverFilter = getPopoverFilter({ config, Content });
  let FilterButtonPopover = ({ className }: { className?: string }) => {
    return (
      <PopoverFilter
        trigger={
          <FilterButton
            className={cn('g-mx-1 g-mb-1 g-max-w-md g-text-slate-600', className)}
            filterHandle={config.filterHandle}
            DisplayName={config.displayName}
            titleTranslationKey={config.filterTranslation}
            {...config.filterButtonProps}
          />
        }
      />
    );
  };
  if (config.filterType === filterConfigTypes.FREE_TEXT) {
    FilterButtonPopover = ({ className }: { className?: string }) => (
      <QInlineButtonFilter className={className} />
    );
  }

  return {
    // ...config,
    Button: FilterButtonPopover,
    Popover: PopoverFilter,
    Content: Content,
    name: config.filterTranslation,
    handle: config.filterHandle,
    DisplayName: config.displayName,
    translatedFilterName: formatMessage({ id: config.filterTranslation }),
  };
}

export function getSuggestFilterConfig({
  config,
  searchConfig,
  formatMessage,
}: {
  config: filterConfig;
  searchConfig: FilterConfigType;
  formatMessage: IntlShape['formatMessage'];
}): FilterSettingSuggest {
  return generateFilter({
    config,
    formatMessage,
    Content: getSuggestFilter({ config, searchConfig }),
  });
}

export function generateFilters({
  config,
  searchConfig,
  formatMessage,
}: {
  config: filterConfig;
  searchConfig: FilterConfigType;
  formatMessage: IntlShape['formatMessage'];
}): FilterSetting {
  if (config.filterType === filterConfigTypes.SUGGEST) {
    return generateFilter({
      config,
      formatMessage,
      Content: getSuggestFilter({ config, searchConfig }),
    });
  } else if (config.filterType === filterConfigTypes.ENUM) {
    return generateFilter({
      config,
      formatMessage,
      Content: getEnumFilter({ config, searchConfig }),
    });
  } else if (config.filterType === filterConfigTypes.FREE_TEXT) {
    return generateFilter({
      config,
      formatMessage,
      Content: getFreeTextFilter({ config, searchConfig }),
    });
  } else if (config.filterType === filterConfigTypes.RANGE) {
    return generateFilter({
      config,
      formatMessage,
      Content: getRangeFilter({ config, searchConfig }),
    });
  } else {
    throw new Error(`Unknown filter type ${config?.filterType}`);
  }
}

/**
 * Decide which filtesr to show and which to put in a dropdown (and which to remove completely)
 * @param {FilterType} filter - Current filter that the user has selected
 * @param {string[]} existingFilters - A list of all available filters (generally, not for the individual site)
 * @param {string[]} excludedFilters - A list of filters that should not be shown (site owner might have excluded some filters)
 * @param {string[]} highlightedFilters - A list of filters that should always be shown (configured by site owner, default visible filteres)
 * @returns { visibleFilters: string[]; availableFilters: string[] } An object with visibleFilters and availableFilters
 */
export function getFilterConfig({
  currentFilter,
  existingFilters,
  excludedFilters,
  highlightedFilters,
}: {
  currentFilter: FilterType;
  existingFilters: string[]; // a list of filterHandles
  excludedFilters: string[]; // a list of filterHandles
  highlightedFilters: string[]; // a list of filterHandles
}): { visibleFilters: string[]; availableFilters: string[] } {
  const visibleFilters = new Set<string>();
  const highlighted = new Set(highlightedFilters);
  const excluded = new Set(excludedFilters);
  const existing = new Set(existingFilters);
  for (const filter of highlighted) {
    if (!excluded.has(filter)) {
      visibleFilters.add(filter);
    }
  }
  for (const filter of existing) {
    if (currentFilter?.must?.[filter]?.length || currentFilter?.mustNot?.[filter]?.length) {
      visibleFilters.add(filter);
    }
  }
  // get available defined as existing minus excluded
  const availableFilters = new Set(existingFilters.filter((x) => !excludedFilters.includes(x)));

  return {
    visibleFilters: Array.from(visibleFilters),
    availableFilters: Array.from(availableFilters),
  };
}

/**
 * Returns a query variable for graphql. A combination of the search scope (e.g. only data from a certain country) + the current user filter. And then transformed to the appropriate field names.
 * It needs a filter. A search context to know the default scope. And it needs to know how to map the filters (which names to use, is it arrays or strings etc)
 * @param {FilterType} filter - Current filter
 * @param {SearchMetadata} searchContext - Context with the underlying scope (e.g. a country or taxon)
 * @param {FilterConfigType} searchConfig - How to map the filters to a query. E.g. how to map it to v1 API or a predicate.
 * @returns {Object} A graphql variable for the query.
 */
export function getAsQuery({
  filter,
  searchContext,
  searchConfig,
}: {
  filter: FilterType;
  searchContext: SearchMetadata;
  searchConfig: FilterConfigType;
}) {
  // should we use get v1 syntax or predicates (we have later added predicates to v1, so the naming is less meaningful now)
  if (searchContext.queryType === 'V1') {
    const v1Filter = filter2v1(filter, searchConfig);
    const scope = searchContext.scope ?? {};
    // TODO, we could do more to merge here.
    // E.g. the intersection of overlapping keys so you can have a scope of 10 countries but still have the option to search for a country without being able to get something out of scope.
    // But for now we must assume that you cannot search on something that is defined in the root scope
    return { ...v1Filter?.filter, ...scope };
  } else {
    // query by predicate
    const rootPredicate = searchContext.scope;
    const currentPredicate = filter2predicate(filter, searchConfig);
    const predicates = [rootPredicate, currentPredicate].filter((x) => x);
    if (predicates.length === 0) {
      return undefined;
    } else if (predicates.length === 1) {
      return predicates[0];
    } else {
      return { type: 'and', predicates };
    }
  }
}

/**
 * Return filter buttons based on settings. Handles which should be shown, available, hidden, more buttons etc.
 *  @param {FilterType} filter - Current filter
 * @param {SearchMetadata} searchContext - Context with which filters to exclude and highlight
 * @returns
 */
export function FilterButtons({
  filters,
  searchContext,
}: {
  filters?: Record<string, FilterSetting>;
  searchContext: SearchMetadata;
}) {
  const filterContext = useContext(FilterContext);

  if (!filters) {
    return null;
  }
  if (!filterContext) {
    console.error('FilterContext not found');
    return null;
  }

  const { visibleFilters, availableFilters } = getFilterConfig({
    currentFilter: filterContext.filter,
    existingFilters: Object.keys(filters).map((x) => filters[x].handle ?? x),
    excludedFilters: searchContext?.excludedFilters ?? [],
    highlightedFilters: searchContext?.highlightedFilters ?? [],
  });

  // map availableFilters to the form {filterHandle: {Button, Popover, Content}}
  const otherFilters = availableFilters
    .filter((x) => {
      return !visibleFilters.includes(x);
    })
    .reduce((acc, filterHandle) => {
      const filterConfig = filters[filterHandle];
      return { ...acc, [filterHandle]: filterConfig };
    }, {});

  return (
    <>
      {visibleFilters?.map((filterHandle) => {
        const filterConfig = filters[filterHandle];
        if (!filterConfig) return null;
        return <filterConfig.Button key={filterHandle} className="g-mx-1 g-mb-1" />;
      })}
      {Object.keys(otherFilters).length > 0 && <MoreFilters filters={otherFilters} />}
    </>
  );
}

export function FilterBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('g-border-b g-py-2 g-px-3 -g-mb-1', className)} role="search">
      {children}
    </div>
  );
}
