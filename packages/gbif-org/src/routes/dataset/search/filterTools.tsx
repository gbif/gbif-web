import React from 'react';
import { SuggestFilter } from './suggestFilter';
import { FilterApplyPopover, FilterButton, FilterPopover } from './filterPopover';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { IntlShape } from 'react-intl';
import { EnumFilter } from './enumFilter';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUncontrolledProp } from 'uncontrollable';

export const filterConfigTypes = {
  SUGGEST: 'SUGGEST',
  ENUM: 'ENUM',
};

export type filterConfig = {
  filterType: string;
  filterHandle: string;
  displayName: React.FC<{ id: string }>;
  filterTranslation: string;
  content?: React.FC;
  options?: (string | number)[];
  suggest?: (args: { q: string; intl: IntlShape }) => Promise<any>;
  facetQuery: string;
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

function getPopoverFilter({ Content }: { config: filterConfig; Content: React.FC }) {
  return function PopoverFilter({ trigger }: { trigger: React.ReactNode }) {
    return (
      <FilterApplyPopover
        trigger={trigger}
      >
        <Content />
      </FilterApplyPopover>
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
      }: {
        onApply?: ({ keepOpen }: { keepOpen?: boolean }) => void;
        onCancel: () => void;
        className: string;
        style: React.CSSProperties;
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
          {...{ onApply, onCancel, className, style }}
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
      }: {
        onApply?: ({ keepOpen }: { keepOpen?: boolean }) => void;
        onCancel: () => void;
        className: string;
        style: React.CSSProperties;
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
          {...{ onApply, onCancel, className, style }}
        />
      );
    }
  );
};

export function generateFilters({
  config,
  searchConfig,
}: {
  config: filterConfig;
  searchConfig: FilterConfigType;
}) {
  let Content = null;
  if (config.filterType === filterConfigTypes.SUGGEST) {
    Content = getSuggestFilter({ config, searchConfig });
  } else if (config.filterType === filterConfigTypes.ENUM) {
    Content = getEnumFilter({ config, searchConfig });
  } else {
    throw new Error(`Unknown filter type ${config?.filterType}`);
  }
  const PopoverFilter = getPopoverFilter({ config, Content });
  function FilterButtonPopover() {
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
  }

  return {
    FilterButton: FilterButtonPopover,
    FilterPopover: PopoverFilter,
    FilterContent: Content,
  };
}

const ContentWrapper = React.forwardRef(
  (
    {
      onApply,
      onCancel,
      filters,
    }: {
      onApply?: ({ keepOpen }: { keepOpen?: boolean }) => void;
      onCancel?: () => void;
      filters: {
        [key: string]: {
          FilterContent: React.FC<{
            onApply?: ({ keepOpen }: { keepOpen?: boolean }) => void;
            onCancel?: () => void;
            ref: React.ForwardedRef<unknown>;
          }>;
        };
      };
    },
    ref
  ) => {
    const [activeFilterHandle, setActiveFilterHandle] = React.useState<string | null>(null);

    const Content = activeFilterHandle ? filters?.[activeFilterHandle]?.FilterContent : null;

    return (
      <div>
        {!activeFilterHandle && (
          <div>
            <ul>
              {Object.keys(filters).map((filterHandle) => (
                <li key={filterHandle} onClick={() => setActiveFilterHandle(filterHandle)}>
                  {filterHandle}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeFilterHandle && (
          <div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (typeof onApply === 'function') onApply({ keepOpen: true });
                setActiveFilterHandle(null);
              }}
            >
              Back
            </Button>
            {Content && <Content onApply={onApply} onCancel={onCancel} ref={ref} />}
          </div>
        )}
      </div>
    );
  }
);

export function MoreFilters({
  filters,
}: {
  filters: { [key: string]: any };
}) {
  return (
    <FilterApplyPopover
      trigger={
        <Button variant="primaryOutline" className="g-mx-1 g-mb-1 g-max-w-md g-text-slate-600">
          More
        </Button>
      }
    >
      <ContentWrapper filters={filters} />
    </FilterApplyPopover>
  );
}
