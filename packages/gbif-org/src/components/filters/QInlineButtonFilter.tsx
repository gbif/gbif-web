import { SearchInput } from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import { useContext, useEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { cn } from '@/utils/shadcn';
import { FilterContext } from '@/contexts/filter';

export function QInlineButtonFilter({ className }: { className?: string }) {
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

function QFilter({
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

function FilterButton({
  onClear,
  onOpen,
  children,
  selectedLabel, // a react object or a string
  isInputHidden,
  className,
}: {
  onClear: () => void;
  onOpen: () => void;
  selectedLabel: string | React.ReactNode;
  className?: string;
  isInputHidden: boolean;
  children: React.ReactNode;
}) {
  if (!isInputHidden) {
    return children;
  }
  return (
    <div className={cn('g-inline-block g-items-center', className)}>
      <div className="g-inline-flex g-w-full g-rounded-md g-shadow-sm" role="group">
        <Button onClick={onOpen} type="button" className="g-flex-auto g-rounded-e-none g-rounded-s g-justify-start">
          {selectedLabel}
        </Button>
        <Button onClick={onClear} type="button" aria-label="Clear filter" className="g-rounded-s-none g-rounded-e g-px-2">
          <span>
            <MdClose />
          </span>
        </Button>
      </div>
    </div>
  );
}