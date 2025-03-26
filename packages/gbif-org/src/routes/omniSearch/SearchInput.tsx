import { MdSearch } from 'react-icons/md';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="g-relative">
      <MdSearch className="g-absolute g-left-3 g-top-1/2 g--translate-y-1/2 g-text-gray-400 g-h-5 g-w-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search across GBIF..."
        className="g-w-full g-pl-10 g-pr-4 g-py-3 g-rounded-lg g-border g-border-gray-200 focus:g-border-green-500 focus:g-ring-2 focus:g-ring-green-200 g-transition-all g-outline-none g-text-lg"
      />
    </div>
  );
}
