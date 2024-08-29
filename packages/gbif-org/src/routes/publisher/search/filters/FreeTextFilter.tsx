import { SearchInput } from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { FilterButton } from './filterButton';

export function FreeTextFilter({
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
    setIsInputHidden(false);
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
      selectedLabel={<span>text: {value}</span>}
    >
      <SearchInput
        defaultValue={value}
        ref={inputRef}
        placeholder="Search"
        className="g-inline-block g-w-auto g-me-2 g-border-primary-500 g-min-w-48"
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

  // if no value, then just provide an input box.
  // if there is a value, then provide a 2 part chip/button with a clear on the right of the button group.
  if (!isInputHidden) {
    // update value when user press enter or when the input loses focus
    return (
      <SearchInput
        defaultValue={value}
        ref={inputRef}
        placeholder="Search"
        className="g-inline-block g-w-auto g-me-2 g-border-primary-500 g-min-w-48"
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
    );
  }
  return (
    <div className="g-inline-block g-items-center g-me-2">
      <div className="g-inline-flex g-rounded-md g-shadow-sm g-min-w-48" role="group">
        <Button
          onClick={() => setIsInputHidden(false)}
          type="button"
          className="g-flex-auto g-rounded-e-none g-rounded-s"
        >
          <span className="">Text: "{value}"</span>
        </Button>
        <Button
          onClick={handleClearClick}
          type="button"
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
