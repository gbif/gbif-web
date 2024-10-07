import React, { useEffect, useRef } from 'react';
import { SuggestFilter } from './suggestFilter';
import { FilterPopover } from './filterPopover';
import {
  filter2predicate,
  FilterConfigType,
} from '@/dataManagement/filterAdapter/filter2predicate';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { EnumFilter } from './enumFilter';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { MdArrowBack } from 'react-icons/md';
import { FilterType } from '@/contexts/filter';
import { SearchMetadata } from '@/contexts/search';
import { filter2v1 } from '@/dataManagement/filterAdapter';
import { FilterButton } from './filterButton';
import { QFilter } from './QFilter';
import { QContextFilter } from '@/routes/publisher/search/filters/QFilterButton';

export const filterConfigTypes = {
  SUGGEST: 'SUGGEST',
  ENUM: 'ENUM',
  FREE_TEXT: 'FREE_TEXT',
};

export type filterConfig = {
  filterType: string;
  filterHandle: string;
  displayName: React.FC<{ id: string }>;
  filterTranslation: string;
  content?: React.FC;
  options?: (string | number)[];
  suggest?: (args: { q: string; intl: IntlShape }) => Promise<any>;
  facetQuery?: string;
  filterButtonProps?: { hideSingleValues: boolean };
};

// generic type for a facet query
export type FacetQuery = {
  search: {
    facet?: {
      field?: Array<{
        name: string;
        count: number;
        item?: {
          title?: string | null;
        } | null;
      } | null> | null;
    } | null;
  };
};

function getPopoverFilter({
  Content,
}: {
  config: filterConfig;
  Content: React.FC<{
    onApply?: ({ keepOpen, filter }: { keepOpen?: boolean, filter?: FilterType }) => void;
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
        onApply?: ({ keepOpen, filter }: { keepOpen?: boolean, filter?: FilterType }) => void;
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
          searchConfig={searchConfig}
          {...{ onApply, onCancel, className, style, pristine }}
        />
      );
    }
  );
};

const getFreeTextFilter = ({
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
        onApply?: ({ keepOpen, filter }: { keepOpen?: boolean, filter?: FilterType }) => void;
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
        onApply?: ({ keepOpen, filter }: { keepOpen?: boolean, filter?: FilterType }) => void;
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

export function generateFilters({
  config,
  searchConfig,
  formatMessage,
}: {
  config: filterConfig;
  searchConfig: FilterConfigType;
  formatMessage: IntlShape['formatMessage'];
}) {
  let Content = null;
  if (config.filterType === filterConfigTypes.SUGGEST) {
    Content = getSuggestFilter({ config, searchConfig });
  } else if (config.filterType === filterConfigTypes.ENUM) {
    Content = getEnumFilter({ config, searchConfig });
  } else if (config.filterType === filterConfigTypes.FREE_TEXT) {
    Content = getFreeTextFilter({ config, searchConfig });
  } else {
    throw new Error(`Unknown filter type ${config?.filterType}`);
  }
  const PopoverFilter = getPopoverFilter({ config, Content });
  let FilterButtonPopover = ({ className }: { className?: string }) => {
    return (
      <PopoverFilter
        trigger={
          <FilterButton
            className="g-mx-1 g-mb-1 g-max-w-md g-text-slate-600"
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
    FilterButtonPopover = ({ className, ...props }: { className?: string }) => (
      <QContextFilter className={className} />
    );
  }

  return {
    Button: FilterButtonPopover,
    Popover: PopoverFilter,
    Content: Content,
    name: config.filterTranslation,
    handle: config.filterHandle,
    DisplayName: config.displayName,
    translatedFilterName: formatMessage({ id: config.filterTranslation }),
  };
}

const ContentWrapper = React.forwardRef(
  (
    {
      onApply,
      onCancel,
      pristine,
      filters,
    }: {
      onApply?: ({ keepOpen, filter }: { keepOpen?: boolean, filter?: FilterType }) => void;
      onCancel?: () => void;
      pristine?: boolean;
      filters: {
        [key: string]: {
          translatedFilterName: string;
          Content: React.FC<{
            onApply?: ({ keepOpen, filter }: { keepOpen?: boolean, filter?: FilterType }) => void;
            onCancel?: () => void;
            ref: React.ForwardedRef<unknown>;
          }>;
        };
      };
    },
    ref
  ) => {
    const searchRef = useRef<HTMLInputElement>(null);
    const [activeFilterHandle, setActiveFilterHandle] = React.useState<string | null>(null);
    const Content = activeFilterHandle ? filters?.[activeFilterHandle]?.Content : null;

    useEffect(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, [activeFilterHandle]);

    return (
      <div>
        {!activeFilterHandle && (
          <Command>
            <CommandInput placeholder="Select a filter" ref={searchRef} />
            <CommandEmpty>No matching filters</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {Object.keys(filters).map((filterHandle) => {
                  const { translatedFilterName } = filters[filterHandle];
                  return (
                    <CommandItem
                      key={filterHandle}
                      value={translatedFilterName}
                      className="g-flex g-items-center g-justify-between g-w-full"
                      onSelect={() => {
                        setActiveFilterHandle(filterHandle);
                      }}
                    >
                      {translatedFilterName}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
        {activeFilterHandle && (
          <div>
            <div className="g-flex g-flex-nowrap g-items-center g-border-b">
              <Button
                size="sm"
                variant="ghost"
                className="g-flex-none"
                onClick={() => {
                  if (typeof onApply === 'function') onApply({ keepOpen: true });
                  setActiveFilterHandle(null);
                }}
              >
                <MdArrowBack />
              </Button>
              <h3 className="g-flex-auto g-text-slate-800 g-text-sm g-font-semibold">
                {filters?.[activeFilterHandle]?.name && <FormattedMessage
                  id={filters?.[activeFilterHandle]?.name}
                  defaultMessage={filters[activeFilterHandle]?.name ?? activeFilterHandle}
                />}
              </h3>
            </div>
            {Content && <Content {...{ pristine, onApply, onCancel }} ref={searchRef} />}
          </div>
        )}
      </div>
    );
  }
);

export function MoreFilters({ filters }: { filters: { [key: string]: any } }) {
  return (
    <FilterPopover
      trigger={
        <Button variant="primaryOutline" className="g-mx-1 g-mb-1 g-max-w-md g-text-slate-600">
          More
        </Button>
      }
    >
      <ContentWrapper filters={filters} />
    </FilterPopover>
  );
}

// Given a set of filters, return a configuration object that can be used to render the filters
// existing filters: the filters that exists as an option in code
// excluded filters: filters that should not be shown - these are decided by the site owner
// highlighted filters: filters that should be shown by default - these are decided by the site owner
// visible filters: the union of (highlighted filters minus excluded) plus filters that have a value set.
// available filters: the existing filters minus those that are excluded
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

export function getAsQuery({
  filter,
  searchContext,
  searchConfig,
}: {
  filter: FilterType;
  searchContext: SearchMetadata;
  searchConfig: FilterConfigType;
}) {
  if (searchContext.queryType === 'V1') {
    const v1Filter = filter2v1(filter, searchConfig);
    const scope = searchContext.scope ?? {};
    // TODO, we could do more to merge here.
    // E.g. the intersection of overlapping keys.
    // But for now we must assume that you cannot search on something that is defined in the root scope
    return { ...v1Filter?.filter, ...scope };
  } else {
    const rootPredicate = searchContext.scope;
    const currentPredicate = filter2predicate(filter, searchConfig);
    const predicates = [rootPredicate, currentPredicate].filter((x) => x);
    if (predicates.length === 0) {
      return undefined;
    } else {
      return { variables: { predicate: { type: 'and', predicates } } };
    }
  }
}
