import { SearchInput } from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import { useContext, useEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { FilterButton } from './filterButton';
import { cn } from '@/utils/shadcn';
import { FilterContext } from '@/contexts/filter';

export function QContextFilter({ className }: { className?: string }) {
  const { filter, setField } = useContext(FilterContext);
  return (
    <QFilter
      className={cn('g-min-w-48 g-mx-1 g-mb-1', className)}
      value={filter.must?.q?.[0]}
      onChange={(x) => {
        if (x !== '' && x) {
          setField('q', [x]);
        } else {
          // if (filter.must?.q?.[0]) {
            setField('q', []);
          // }
        }
      }}
    />
  );
}

export function QFilter({
  onChange,
  value,
  className,
}: {
  onChange: (x?: string) => void;
  value: string;
  className?: string;
}) {
  const [isInputHidden, setIsInputHidden] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearClick = () => {
    onChange();
  };

  useEffect(() => {
    if (!isInputHidden && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputHidden]);

  useEffect(() => {
    if (value && value !== '') {
      setIsInputHidden(true);
    } else {
      setIsInputHidden(false);
    }
  }, [value]);

  return (
    <FilterButton
      onClear={handleClearClick}
      onOpen={() => setIsInputHidden(false)}
      isInputHidden={isInputHidden}
      selectedLabel={<span>“{value}”</span>}
      className={cn('', className)}
    >
      <SearchInput
        defaultValue={value}
        ref={inputRef}
        placeholder="Text search"
        className={cn(
          'g-h-9 g-px-2 g-py-2 g-rounded-md g-w-auto g-border g-border-primary-500',
          className
        )}
        onBlur={(e) => {
          onChange(e.target.value);
          if (e.target.value !== '') {
            setIsInputHidden(true);
          }
        }}
        onKeyDown={(e) => {
          // if user press enter, then update the value
          if (e.key === 'Enter') {
            onChange(e.currentTarget.value);
          }
          // if esc, then just leave the input and value as is
          if (e.key === 'Escape' && value !== '') {
            setIsInputHidden(true);
          }
        }}
      />
    </FilterButton>
  );
}
