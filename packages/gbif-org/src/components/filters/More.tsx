import React, { useEffect, useRef } from 'react';
import { FilterPopover } from './filterPopover';
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

const ContentWrapper = React.forwardRef(
  ({
  onApply,
  onCancel,
  pristine,
  filters,
}: {
  onApply?: ({ keepOpen, filter }: { keepOpen?: boolean; filter?: FilterType }) => void;
  onCancel?: () => void;
  pristine?: boolean;
  filters: {
    [key: string]: {
      translatedFilterName: string;
      Content: React.FC<{
        onApply?: ({ keepOpen, filter }: { keepOpen?: boolean; filter?: FilterType }) => void;
        onCancel?: () => void;
        ref: React.ForwardedRef<unknown>;
      }>;
    };
  }
}, ref)  => {
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
              {filters?.[activeFilterHandle]?.translatedFilterName}
            </h3>
          </div>
          {Content && <Content {...{ pristine, onApply, onCancel }} ref={searchRef} />}
        </div>
      )}
    </div>
  );
});

export default function MoreFilters({ filters }: { filters: { [key: string]: any } }) {
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