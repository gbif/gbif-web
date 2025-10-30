import { useStringParam } from '@/hooks/useParam';
import { useEffect, useRef, useState } from 'react';
import { MdSearch } from 'react-icons/md';

interface SearchInputProps {
  placeholder: string;
}

export function SearchInput({ placeholder }: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useStringParam({
    key: 'q',
    defaultValue: '',
    hideDefault: true,
  });
  const [value, setValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <div className="g-relative">
      <MdSearch className="g-absolute g-left-3 g-top-1/2 g--translate-y-1/2 g-text-gray-400 g-h-5 g-w-5" />
      <input
        type="text"
        ref={inputRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyUp={(e) => {
          // if enter is pressed, call onChange
          if (e.key === 'Enter') {
            setSearchQuery(value);
          }
        }}
        onBlur={() => {
          setSearchQuery(value);
        }}
        placeholder={placeholder}
        className="g-w-full g-pl-10 g-pr-4 g-py-3 g-rounded-lg g-border g-border-solid g-border-gray-200 focus:g-border-primary-500 focus:g-ring-2 focus:g-ring-primary-200 g-transition-all g-outline-none g-text-lg"
      />
    </div>
  );
}
