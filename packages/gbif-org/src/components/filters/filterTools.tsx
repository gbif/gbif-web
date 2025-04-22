import { FilterContext, FilterContextType, FilterType } from '@/contexts/filter';
import { QueryTypeEnum, SearchMetadata } from '@/contexts/search';
import { filter2v1 } from '@/dataManagement/filterAdapter';
import {
  filter2predicate,
  FilterConfigType,
} from '@/dataManagement/filterAdapter/filter2predicate';
import { Predicate } from '@/gql/graphql';
import { cn } from '@/utils/shadcn';
import { SuggestConfig } from '@/utils/suggestEndpoints';
import React, { useContext } from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import { Button } from '../ui/button';
import { AboutButton } from './aboutButton';
import { DateRangeFilter } from './dateRangeFilter';
import { EnumFilter } from './enumFilter';
import { Exists } from './exists';
import { FilterButton } from './filterButton';
import { FilterPopover } from './filterPopover';
import { GeometryFilter } from './geometryFilter';
import MoreFilters from './More';
import { SkeletonOption } from './option';
import { OptionalBooleanFilter } from './optionalBooleanFilter';
import { QFilter } from './QFilter';
import { QInlineButtonFilter } from './QInlineButtonFilter';
import { RangeFilter } from './rangeFilter';
import { SuggestionItem } from './suggest';
import { SuggestFilter } from './suggestFilter';
import { WildcardFilter } from './wildcardFilter';

export enum filterConfigTypes {
  SUGGEST = 'SUGGEST',
  ENUM = 'ENUM',
  FREE_TEXT = 'FREE_TEXT',
  RANGE = 'RANGE',
  DATE_RANGE = 'DATE_RANGE',
  OPTIONAL_BOOL = 'OPTIONAL_BOOL',
  WILDCARD = 'WILDCARD',
  LOCATION = 'LOCATION',
}

export type AdditionalFilterProps = {
  searchConfig: FilterConfigType;
  onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
  onCancel?: () => void;
  pristine?: boolean;
};

export type filterConfigShared = {
  filterType: string;
  filterHandle: string;
  displayName: React.FC<{ id: string | number | object }>;
  filterTranslation: string;
  content?: React.FC;
  filterButtonProps?: {
    hideSingleValues: boolean;
    getCount: (filter: FilterType) => number;
    onClear?: (filterContext: FilterContextType) => void;
  };
  info?: React.FC;
  about?: React.FC;
  group?: string;
  order?: number;
};

export type filterBoolConfig = filterConfigShared & {
  filterType: filterConfigTypes.OPTIONAL_BOOL;
  facetQuery?: string;
  disableFacetsForSelected?: boolean;
};

export type filterSuggestConfig = filterConfigShared & {
  filterType: filterConfigTypes.SUGGEST;
  facetQuery?: string;
  disableFacetsForSelected?: boolean;
  suggestConfig?: SuggestConfig;
  allowExistence?: boolean;
  allowNegations?: boolean;
};

export type filterWildcardConfig = filterConfigShared & {
  filterType: filterConfigTypes.WILDCARD;
  allowExistence?: boolean;
  allowNegations?: boolean;
  queryKey?: string;
  keepCase?: boolean;
  suggestQuery: string;
  disallowLikeFilters?: boolean;
  defaultDescription?: () => React.ReactNode;
};

export type filterEnumConfig = filterConfigShared & {
  filterType: filterConfigTypes.ENUM;
  facetQuery?: string;
  options?: string[];
  allowExistence?: boolean;
  allowNegations?: boolean;
};

export type filterRangeConfig = filterConfigShared & {
  filterType: filterConfigTypes.RANGE;
  regex?: RegExp;
  allowExistence?: boolean;
  rangeExample?: () => React.ReactNode;
};

export type filterDateRangeConfig = filterConfigShared & {
  filterType: filterConfigTypes.DATE_RANGE;
  allowExistence?: boolean;
  rangeExample?: () => React.ReactNode;
};

export type filterLocationConfig = filterConfigShared & {
  filterType: filterConfigTypes.LOCATION;
};

export type filterFreeTextConfig = filterConfigShared & {
  filterType: filterConfigTypes.FREE_TEXT;
};

// define a type that is one of filterBoolConfig, filterSuggestConfig or filterEnumConfig
export type filterConfig =
  | filterBoolConfig
  | filterSuggestConfig
  | filterEnumConfig
  | filterRangeConfig
  | filterFreeTextConfig
  | filterWildcardConfig
  | filterDateRangeConfig
  | filterLocationConfig;

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

// generic type for a wildcard queries
export interface WildcardQuery {
  search: {
    cardinality: {
      total: number;
    };
    facet?: {
      field?: Array<{
        name: string;
        count: number;
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
  filterTranslation,
}: {
  Content: React.FC<{
    onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
    onCancel?: () => void;
    className?: string;
    style?: React.CSSProperties;
  }>;
  filterTranslation: string;
  className?: string;
}) {
  return function PopoverFilter({
    trigger,
    className,
  }: {
    trigger: React.ReactNode;
    className?: string;
  }) {
    const title = (
      <div className="g-flex g-flex-nowrap g-items-center g-border-b g-p-2 g-px-4">
        <h3 className="g-flex-auto g-text-slate-800 g-text-sm g-font-semibold">
          <FormattedMessage id={filterTranslation} />
        </h3>
      </div>
    );

    return (
      <FilterPopover trigger={trigger} title={title} className={className}>
        <Content />
      </FilterPopover>
    );
  };
}

const getSuggestFilter = ({
  config,
  searchConfig,
}: {
  config: filterSuggestConfig;
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
          {...config}
          searchConfig={searchConfig}
          {...{ onApply, onCancel, className, style, pristine }}
        />
      );
    }
  );
};

const getWildcardFilter = ({
  config,
  searchConfig,
}: {
  config: filterWildcardConfig;
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
        <WildcardFilter
          ref={ref}
          {...config}
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
  config: filterEnumConfig;
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
          options={config.options}
          facetQuery={config.facetQuery}
          filterHandle={config.filterHandle}
          displayName={config.displayName}
          allowExistence={config.allowExistence}
          allowNegations={config.allowNegations}
          searchConfig={searchConfig}
          about={config.about}
          {...{ onApply, onCancel, className, style, pristine }}
        />
      );
    }
  );
};

const getLocationFilter = ({
  config,
  searchConfig,
}: {
  config: filterLocationConfig;
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
        <GeometryFilter
          ref={ref}
          {...config}
          {...{ onApply, onCancel, className, style, pristine }}
        />
      );
    }
  );
};

const getOptionalBooleanFilter = ({
  config,
  searchConfig,
}: {
  config: filterBoolConfig;
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
        <OptionalBooleanFilter
          ref={ref}
          facetQuery={config.facetQuery}
          filterHandle={config.filterHandle}
          displayName={config.displayName}
          searchConfig={searchConfig}
          about={config.about}
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
  config: filterRangeConfig;
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
          {...config}
          searchConfig={searchConfig}
          {...{ onApply, onCancel, className, style, pristine }}
        />
      );
    }
  );
};

const getDateRangeFilter = ({
  config,
  searchConfig,
}: {
  config: filterDateRangeConfig;
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
        <DateRangeFilter
          ref={ref}
          {...config}
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
    ref?: React.ForwardedRef<unknown>;
    className?: string;
    style?: React.CSSProperties;
    pristine?: boolean;
  }>;
  name: string;
  handle: string;
  displayName: React.FC<{ id: string | number | object }>;
  translatedFilterName: string;
  allowNegations?: boolean;
  allowExistence?: boolean;
  filterType: string;
};

type FilterSettingDefaults = {
  Button: React.FC<{ className?: string }>;
  Popover: React.FC<{ trigger: React.ReactNode }>;
  name: string;
  handle: string;
  displayName: React.FC<{ id: string | number | object }>;
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
  popoverClassName,
}: {
  config: filterConfig;
  formatMessage: IntlShape['formatMessage'];
  Content: React.FC;
  popoverClassName?: string;
}): FilterSetting {
  const PopoverFilter = getPopoverFilter({ Content, filterTranslation: config.filterTranslation });
  let FilterButtonPopover = ({ className }: { className?: string }) => {
    return (
      <PopoverFilter
        className={popoverClassName}
        trigger={
          <FilterButton
            className={cn('g-mx-1 g-mb-1 g-max-w-full g-text-slate-600', className)}
            filterHandle={config.filterHandle}
            displayName={config.displayName}
            titleTranslationKey={config.filterTranslation}
            {...config.filterButtonProps}
          />
        }
      />
    );
  };
  if (config.filterType === filterConfigTypes.FREE_TEXT) {
    FilterButtonPopover = ({ className }: { className?: string }) => (
      <QInlineButtonFilter className={className} filterHandle={config.filterHandle} />
    );
  }

  return {
    // ...config,
    allowExistence: config?.allowExistence ?? false,
    allowNegations: config?.allowNegations ?? false,
    filterType: config.filterType,
    Button: FilterButtonPopover,
    Popover: PopoverFilter,
    Content: Content,
    name: config.filterTranslation,
    handle: config.filterHandle,
    displayName: config.displayName,
    translatedFilterName: formatMessage({ id: config.filterTranslation }),
    group: config.group,
    order: config.order,
  };
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
      Content: getSuggestFilter({ config: config as filterSuggestConfig, searchConfig }),
    });
  } else if (config.filterType === filterConfigTypes.ENUM) {
    return generateFilter({
      config,
      formatMessage,
      Content: getEnumFilter({ config: config as filterEnumConfig, searchConfig }),
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
      Content: getRangeFilter({ config: config as filterRangeConfig, searchConfig }),
    });
  } else if (config.filterType === filterConfigTypes.DATE_RANGE) {
    return generateFilter({
      config,
      formatMessage,
      Content: getDateRangeFilter({ config: config as filterDateRangeConfig, searchConfig }),
    });
  } else if (config.filterType === filterConfigTypes.OPTIONAL_BOOL) {
    return generateFilter({
      config,
      formatMessage,
      Content: getOptionalBooleanFilter({ config: config as filterBoolConfig, searchConfig }),
    });
  } else if (config.filterType === filterConfigTypes.WILDCARD) {
    return generateFilter({
      config,
      formatMessage,
      Content: getWildcardFilter({ config: config as filterWildcardConfig, searchConfig }),
    });
  } else if (config.filterType === filterConfigTypes.LOCATION) {
    return generateFilter({
      config,
      formatMessage,
      Content: getLocationFilter({ config: config as filterLocationConfig, searchConfig }),
      popoverClassName: 'g-w-[500px]',
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

  // if the site is configured to highlight or exlude a filter that do not exist, then log an error to console
  highlightedFilters.forEach((filter) => {
    if (!existingFilters.includes(filter)) {
      console.warn(`Filter ${filter} is configured to be highlighted, but does not exist`);
      console.warn(`Existing filter names are: ${existingFilters.join(', ')}`);
    }
  });
  excludedFilters.forEach((filter) => {
    if (!existingFilters.includes(filter)) {
      console.warn(`Filter ${filter} is configured to be excluded, but does not exist`);
      console.warn(`Existing filter names are: ${existingFilters.join(', ')}`);
    }
  });
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
  queryType = searchContext.queryType,
}: {
  filter: FilterType;
  searchContext: SearchMetadata;
  searchConfig: FilterConfigType;
  queryType?: QueryTypeEnum;
}): object | Predicate | undefined {
  // should we use get v1 syntax or predicates (we have later added predicates to v1, so the naming is less meaningful now)
  if (queryType === 'V1') {
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
  groups,
}: {
  filters?: Record<string, FilterSetting>;
  searchContext?: SearchMetadata;
  groups?: string[];
}) {
  const filterContext = useContext(FilterContext);

  // if no filter or an empty object
  if (!filters || Object.keys(filters).length === 0) {
    return null;
  }
  if (!filterContext) {
    console.error('FilterContext not found');
    return null;
  }

  const { visibleFilters, availableFilters } = getFilterConfig({
    currentFilter: filterContext.filter,
    existingFilters: Object.keys(filters).map((x) => filters[x]?.handle ?? x),
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
      {Object.keys(otherFilters).length > 0 && (
        <MoreFilters filters={otherFilters} groups={groups} />
      )}
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
    <div
      className={cn('g-border-b g-py-2 g-px-4 g-bg-paperBackground -g-mb-1', className)}
      role="search"
    >
      {children}
    </div>
  );
}

export function ApplyCancel({
  onApply,
  onCancel,
  pristine,
}: {
  onApply?: ({ keepOpen }?: { keepOpen?: boolean }) => void;
  onCancel?: () => void;
  pristine?: boolean;
}) {
  if (!onApply || !onCancel) return null;
  return (
    <div className="g-flex-none g-py-2 g-px-2 g-flex g-justify-between">
      <Button size="sm" variant="outline" onClick={onCancel}>
        <FormattedMessage id="filterSupport.cancel" />
      </Button>
      {!pristine && (
        <Button type="submit" role="button" size="sm" onClick={() => onApply({ keepOpen: false })}>
          <FormattedMessage id="filterSupport.apply" />
        </Button>
      )}
    </div>
  );
}

export function AsyncOptions({
  children,
  loading,
  error,
  className,
}: {
  children?: React.ReactNode;
  loading: boolean;
  error?: Error;
  className?: string;
}) {
  if (error) {
    return (
      <div className="g-p-2 g-m-4 g-text-red-900 g-text-sm">Unable to load suggestions...</div>
    );
  }
  if (loading) {
    return (
      <div className={cn(className)}>
        <SkeletonOption className="g-w-full g-mb-2" />
        <SkeletonOption className="g-w-36 g-max-w-full g-mb-2" />
        <SkeletonOption className="g-max-w-full g-w-48 g-mb-2" />
        <SkeletonOption className="g-max-w-full g-w-64 g-mb-2" />
      </div>
    );
  }
  return children ?? null;
}

export type FilterSummaryType = {
  defaultCount: number;
  hasNegations: boolean;
  mixed: boolean;
  isNull: boolean;
  isNotNull: boolean;
  firstValue: { type: string; value: unknown };
};

export function getFilterSummary(filter: FilterType, handle: string): FilterSummaryType {
  const must = filter?.must?.[handle] || [];
  const mustNot = filter?.mustNot?.[handle] || [];

  // check if there is a isNull or isNotNull filter among the filters
  const isNull = must?.[0]?.type === 'isNull' && must.length === 1;
  const isNotNull = must?.[0]?.type === 'isNotNull' && must.length === 1;

  return {
    defaultCount: must.length + mustNot.length,
    hasNegations: mustNot.length > 0,
    mixed: must.length > 0 && mustNot.length > 0,
    isNull,
    isNotNull,
    firstValue: must?.length > 0 ? must?.[0] : mustNot?.[0],
  };
}

export function ExistsSection({
  className,
  backupFilter,
  setFilter,
  setFullField,
  filterHandle,
  About,
  filterSummary,
  onApply,
  onCancel,
  pristine,
}: {
  className?: string;
  backupFilter?: FilterType;
  setFilter: (filter: FilterType) => void;
  setFullField: (field: string, must: unknown[], mustNot: unknown[]) => FilterType;
  filterHandle: string;
  About?: React.FC;
  filterSummary?: FilterSummaryType;
  onApply?: () => void;
  onCancel?: () => void;
  pristine?: boolean;
}) {
  return (
    <>
      <div
        className={cn(
          'g-flex g-flex-none g-text-sm g-text-slate-400 g-py-1.5 g-px-4 g-items-center g-pt-2',
          className
        )}
      >
        <button
          onClick={() => {
            if (backupFilter) setFilter(backupFilter);
            else setFullField(filterHandle, [], []);
          }}
        >
          <FormattedMessage id="filterSupport.backToSelect" />
        </button>

        <div className="g-flex-auto"></div>
        <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
          {About && (
            <AboutButton className="-g-me-1">
              <About />
            </AboutButton>
          )}
        </div>
      </div>
      <div className="g-py-1.5 g-px-4 g-w-full">
        <Exists
          isEmpty={!!filterSummary?.isNull}
          onChange={({ isEmpty }: { isEmpty: boolean }) => {
            if (isEmpty) {
              setFullField(filterHandle, [{ type: 'isNull' }], []);
            } else {
              setFullField(filterHandle, [{ type: 'isNotNull' }], []);
            }
          }}
        />
      </div>
      <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
    </>
  );
}
