import React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components//ui/command';
import { IoMdCheckmark as Checkmark } from 'react-icons/io';
import { cn } from '@/utils/shadcn';

type Props<T> = {
  search(searchTerm: string): void;
  results: T[];
  selectedKey?: string | number | null;
  setSelected(value: T | null | undefined): void;
  labelSelector(value: T): string;
  keySelector(value: T): string;
  noSelectionPlaceholder?: React.ReactNode;
  noSearchResultsPlaceholder?: React.ReactNode;
  searchInputPlaceholder?: string;
  className?: string;
  onApply?: () => void;
};

export const SearchCommand = React.forwardRef<HTMLInputElement, Props<unknown>>(
  <T,>(
    {
      search,
      results,
      searchInputPlaceholder,
      noSearchResultsPlaceholder,
      keySelector,
      labelSelector,
      selectedKey,
      setSelected,
      onApply,
    }: Props<T>,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    // Fetch new search results when the search term changes
    React.useEffect(() => {
      search(searchTerm);
    }, [searchTerm, search]);

    return (
      <Command shouldFilter={false}>
        <CommandInput
          ref={ref}
          value={searchTerm}
          onValueChange={setSearchTerm}
          placeholder={searchInputPlaceholder}
        />
        <CommandEmpty>{noSearchResultsPlaceholder}</CommandEmpty>
        <CommandList>
          <CommandGroup>
            {results.map((result) => (
              <CommandItem
                key={keySelector(result)}
                value={keySelector(result)}
                className="g-flex g-items-center g-justify-between g-w-full"
                onSelect={() => {
                  // Reselecting the same item should deselect it
                  if (selectedKey === keySelector(result)) {
                    setSelected(null);
                  } else {
                    setSelected(result);
                  }
                  onApply?.();
                }}
              >
                {labelSelector(result)}
                <Checkmark
                  className={cn(
                    'g-mr-2 g-h-4 g-w-4',
                    selectedKey === keySelector(result) ? 'g-opacity-100' : 'g-opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }
);
