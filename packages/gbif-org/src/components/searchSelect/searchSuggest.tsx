import React from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { IoMdCheckmark as Checkmark } from 'react-icons/io';
import { LuChevronsUpDown as ChevronsUpDown } from 'react-icons/lu';
import { cn } from '@/utils/shadcn';
import { useUncontrolledProp } from 'uncontrollable';

type Props<T> = {
  search(searchTerm: string): void;
  results: T[];
  selected?: T | null;
  setSelected(value: T | null | undefined): void;
  labelSelector(value: T): string;
  keySelector(value: T): string;
  noSelectionPlaceholder?: React.ReactNode;
  noSearchResultsPlaceholder?: React.ReactNode;
  searchInputPlaceholder?: string;
  className?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export function SearchSuggest<T>({
  selected,
  setSelected,
  labelSelector,
  keySelector,
  results,
  search,
  className,
  open,
  setOpen,
  // TODO: Add translations
  noSelectionPlaceholder = 'Select an item',
  noSearchResultsPlaceholder = 'No results found',
  searchInputPlaceholder = 'Search...',
}: Props<T>) {
  const [controlledOpen, setControlledOpen] = useUncontrolledProp(open, false, setOpen);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Fetch new search results when the search term changes
  React.useEffect(() => {
    search(searchTerm);
  }, [searchTerm, search]);

  // Keep track of the width of the popover trigger so we can set the width of the popover
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const triggerWidth = triggerRef.current?.offsetWidth;

  return (
    <Popover open={controlledOpen} onOpenChange={setControlledOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant={selected ? 'default' : 'outline'}
          role="combobox"
          aria-expanded={open}
          className={cn('g-w-full g-flex', className)}
          // Override styles from our gb-button css class
          style={{ justifyContent: 'space-between' }}
        >
          {selected ? labelSelector(selected) : noSelectionPlaceholder}
          <ChevronsUpDown className="g-ml-2 g-h-4 g-w-4 g-shrink-0 g-opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ minWidth: triggerWidth }} className="g-p-0">
        <Command>
          <CommandInput
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
                  value={labelSelector(result)}
                  className="g-flex g-items-center g-justify-between g-w-full"
                  onSelect={() => {
                    // Reselecting the same item should deselect it
                    if (selected && keySelector(selected) === keySelector(result)) {
                      setSelected(null);
                    } else {
                      setSelected(result);
                    }
                    setOpen?.(false);
                  }}
                >
                  {labelSelector(result)}
                  <Checkmark
                    className={cn(
                      'g-mr-2 g-h-4 g-w-4',
                      selected && keySelector(selected) === keySelector(result)
                        ? 'g-opacity-100'
                        : 'g-opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
