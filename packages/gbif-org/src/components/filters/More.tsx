import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { FilterType } from '@/contexts/filter';
import { normalizeString } from '@/utils/normalizeString';
import React, { useEffect, useRef } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { FilterPopover } from './filterPopover';

type Filters = {
  [key: string]: {
    translatedFilterName: string;
    Content: React.FC<{
      onApply?: ({ keepOpen, filter }: { keepOpen?: boolean; filter?: FilterType }) => void;
      onCancel?: () => void;
      ref: React.ForwardedRef<unknown>;
    }>;
    group?: string;
    order?: number;
  };
};
const ContentWrapper = React.forwardRef(
  (
    {
      onApply,
      onCancel,
      pristine,
      filters,
      groups,
    }: {
      onApply?: ({ keepOpen, filter }: { keepOpen?: boolean; filter?: FilterType }) => void;
      onCancel?: () => void;
      pristine?: boolean;
      filters: Filters;
      groups?: string[];
    },
    ref
  ) => {
    const { formatMessage } = useIntl();
    const placeholder = formatMessage({
      id: 'search.placeholders.default',
      defaultMessage: 'Search filters',
    });
    const searchRef = useRef<HTMLInputElement>(null);
    const [activeFilterHandle, setActiveFilterHandle] = React.useState<string | null>(null);
    const Content = activeFilterHandle ? filters?.[activeFilterHandle]?.Content : null;

    useEffect(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, [activeFilterHandle]);

    // filter groups to only show groups with filters in them
    const filteredGroups = groups?.filter((group) =>
      Object.keys(filters).some((filterHandle) => filters[filterHandle]?.group === group)
    );

    const hasGroups = filteredGroups && filteredGroups?.length > 0;

    return (
      <div>
        {!activeFilterHandle && (
          <Command
            filter={(value, search) => {
              if (normalizeString(value).includes(normalizeString(search))) return 1;
              return 0;
            }}
          >
            <CommandInput placeholder={placeholder} ref={searchRef} />
            <CommandEmpty>
              <FormattedMessage
                id="filterSupport.noMathcingFilters"
                defaultMessage="No matching filters"
              />
            </CommandEmpty>
            <CommandList>
              {!hasGroups && (
                <Group
                  filters={filters}
                  onSelect={(filterHandle) => {
                    setActiveFilterHandle(filterHandle);
                  }}
                />
              )}
              {hasGroups &&
                filteredGroups?.map((group, i) => {
                  return (
                    <>
                      <Group
                        key={group}
                        name={group}
                        filters={filters}
                        onSelect={(filterHandle) => {
                          setActiveFilterHandle(filterHandle);
                        }}
                      />
                      {i < filteredGroups.length - 1 && <CommandSeparator />}
                    </>
                  );
                })}
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
                {filters?.[activeFilterHandle]?.translatedFilterName}
              </h3>
            </div>
            {Content && <Content {...{ pristine, onApply, onCancel }} ref={searchRef} />}
          </div>
        )}
      </div>
    );
  }
);

function Group({
  name,
  filters,
  onSelect,
  title,
}: {
  name?: string;
  title?: string;
  filters: Filters;
  onSelect: (filterHandle: string) => void;
}) {
  const header = title ?? (name ? `dashboard.group.${name}` : undefined);
  return (
    <CommandGroup heading={header ? <FormattedMessage id={header} /> : undefined}>
      {Object.keys(filters)
        .filter((filterHandle) => filters[filterHandle]?.group === name)
        .sort((x, y) => {
          // sort by order f available and else by translated filterName
          const xOrder = filters[x]?.order ?? 1000;
          const yOrder = filters[y]?.order ?? 1000;
          if (xOrder < yOrder) return -1;
          if (xOrder > yOrder) return 1;
          // sort filters by translatedFilterName
          const xName = filters[x]?.translatedFilterName ?? x;
          const yName = filters[y]?.translatedFilterName ?? y;
          if (xName < yName) return -1;
          if (xName > yName) return 1;
          return 0;
        })
        .map((filterHandle) => {
          const { translatedFilterName } = filters[filterHandle];
          return (
            <CommandItem
              key={filterHandle}
              value={translatedFilterName}
              className="g-flex g-items-center g-justify-between g-w-full"
              onSelect={() => {
                onSelect(filterHandle);
              }}
            >
              {translatedFilterName}
            </CommandItem>
          );
        })}
    </CommandGroup>
  );
}

export default function MoreFilters({
  filters,
  groups,
}: {
  filters: { [key: string]: any };
  groups?: string[];
}) {
  return (
    <FilterPopover
      trigger={
        <Button
          variant="primaryOutline"
          size="sm"
          className="g-text-sm g-mx-1 g-mb-1 g-max-w-md g-text-slate-600"
        >
          <FormattedMessage id="pagination.moreFilters" />
        </Button>
      }
    >
      <ContentWrapper filters={filters} groups={groups} />
    </FilterPopover>
  );
}
