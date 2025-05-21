import { SearchInput } from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import { FilterContext } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import { useContext, useEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useIntl } from 'react-intl';

export function QInlineButtonFilter({
  className,
  filterHandle = 'q',
}: {
  className?: string;
  filterHandle?: string;
}) {
  const { filter, setField } = useContext(FilterContext);
  return (
    <QFilter
      className={cn('g-min-w-48 g-mx-1 g-mb-1 g-max-w-full', className)}
      value={filter.must?.[filterHandle]?.[0]}
      onChange={(x) => {
        if (x !== '' && x) {
          setField(filterHandle, [x]);
        } else {
          // if (filter.must?.q?.[0]) {
          setField(filterHandle, []);
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
  const { formatMessage } = useIntl();

  const handleClearClick = () => {
    onChange();
  };

  useEffect(() => {
    if (!isInputHidden && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
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
      selectedLabel={
        <span className="g-overflow-hidden g-whitespace-nowrap g-text-ellipsis g-max-w-[250px]">
          “{value}”
        </span>
      }
      className={cn('', className)}
    >
      <SearchInput
        defaultValue={value}
        ref={inputRef}
        placeholder={formatMessage({ id: 'filters.q.name' })}
        className={cn(
          'g-h-9 g-px-2 g-py-2 g-rounded-md g-w-auto g-border-solid g-border-primary-500 g-text-sm',
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
        <Button
          onClick={onOpen}
          type="button"
          className="g-flex-auto g-rounded-e-none g-rounded-s g-justify-start g-overflow-hidden g-whitespace-nowrap g-text-ellipsis"
        >
          {selectedLabel}
        </Button>
        <Button
          onClick={onClear}
          type="button"
          aria-label="Clear filter"
          className="g-rounded-s-none g-rounded-e g-px-2"
        >
          <span>
            <MdClose />
          </span>
        </Button>
      </div>
    </div>
  );
}
