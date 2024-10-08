import { cn } from '@/utils/shadcn';
import { useCombobox } from 'downshift';
import React, { useCallback } from 'react';
import { MdCheck, MdSearch } from 'react-icons/md';
import { IntlShape, useIntl } from 'react-intl';

export interface SuggestionItem {
  key: string;
  title: string;
  description?: string;
}

export type SuggestProps = {
  onSelect: (item: SuggestionItem) => void;
  className?: string;
  getSuggestions?: ({
    q,
    locale,
    endpoints,
  }: {
    q: string;
    locale?: string;
    endpoints?: { v1: string; graphql: string };
    intl?: IntlShape;
  }) => Promise<SuggestionItem[]>;
  selected?: (string | number)[];
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const Suggest = React.forwardRef<HTMLInputElement, SuggestProps>(
  (
    {
      onSelect,
      className,
      getSuggestions,
      selected,
      onKeyPress,
    }: SuggestProps,
    ref
  ) => {
    return (
      <Search
        ref={ref}
        onSearch={getSuggestions || (() => Promise.resolve([]))}
        onSelect={onSelect}
        className={className}
        selected={selected}
        onKeyPress={onKeyPress}
      />
    );
  }
);

const Search = React.forwardRef(
  (
    {
      onSearch,
      onSelect,
      className,
      selected,
      onKeyPress,
    }: {
      onSearch: ({ q, intl }: { q: string, intl?: IntlShape }) => Promise<SuggestionItem[]>;
      onSelect: (item: SuggestionItem) => void;
      className?: string;
      selected?: (string | number)[];
      onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    },
    ref
  ) => {
    const intl = useIntl();
    const [items, setItems] = React.useState<SuggestionItem[]>([]);
    const [selectedItem, setSelectedItem] = React.useState<SuggestionItem | null>(null);
    // const [inputValue, setInputValue] = React.useState('');
    const {
      isOpen,
      inputValue,
      getLabelProps,
      getMenuProps,
      getInputProps,
      highlightedIndex,
      getItemProps,
    } = useCombobox({
      onInputValueChange({ inputValue }) {
        // setInputValue(inputValue);
        onSearch({ q: inputValue, intl })
          .then((data) => {
            // setResults(data);
            setItems(data);
          })
          .catch((err) => {
            console.error(err);
          });
      },
      items: items || [],
      itemToString(item: SuggestionItem | null) {
        return item ? item.title : '';
      },
      // inputValue,
      selectedItem,
      onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
        onSelect(newSelectedItem);
        setSelectedItem(null);
      },
      defaultHighlightedIndex: 0,
      stateReducer: (state, actionAndChanges) => {
        const { changes, type } = actionAndChanges;
        const inputChanges = { ...changes, inputValue: inputValue };
        switch (type) {
          case useCombobox.stateChangeTypes.InputChange:
            return changes;
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
            return {
              ...inputChanges,
              isOpen: false, // keep menu open after selection.
              highlightedIndex: state.highlightedIndex,
              inputValue: inputValue, // don't add the item string as input value at selection.
            };
          case useCombobox.stateChangeTypes.ItemClick:
            return {
              ...inputChanges,
              isOpen: false, // keep menu open after selection.
              highlightedIndex: state.highlightedIndex,
              inputValue: inputValue, // don't add the item string as input value at selection.
            };
          default:
            return { ...inputChanges };
        }
      },
    });

    return (
      <div className="g-w-full g-relative">
        <div className="g-w-full g-flex g-flex-col g-gap-1">
          <label className="g-w-fit g-sr-only" {...getLabelProps()}>
            Search publishers
          </label>
          {/* <SearchInput placeholder="Search publishers" className="g-w-full" {...getInputProps()} /> */}
          <div
            className={cn(
              'g-flex disabled:g-opacity-50 g-items-center g-justify-center g-w-full',
              className
            )}
          >
            <MdSearch className="g-text-slate-400 g-me-2 g-text-center g-flex-none" />
            <input
              type="input"
              placeholder="Search..."
              className={cn(
                'g-flex-auto g-w-full g-bg-transparent g-py-1 g-text-sm g-transition-colors file:g-border-0 file:g-bg-transparent file:g-text-sm file:g-font-medium placeholder:g-text-muted-foreground focus-visible:g-outline-none disabled:g-cursor-not-allowed',
                // 'focus-visible:g-ring-2 focus-visible:g-ring-blue-400/30 focus-visible:g-ring-offset-0 g-ring-inset',
              )}
              {...getInputProps({ref, onKeyPress})}
            />
          </div>
        </div>
        <div className="g-absolute g-w-full">
          <ul
            className={`g-w-full g-bg-white g-shadow-2xl g-max-h-80 g-overflow-auto g-p-0 g-z-10 g-rounded g-border ${
              !(isOpen && items.length) && 'g-hidden'
            }`}
            {...getMenuProps()}
          >
            {isOpen &&
              items.map((item, index) => (
                <li
                  className={cn(
                    highlightedIndex === index && 'g-bg-slate-100',
                    selectedItem === item && 'g-font-bold',
                    'g-text-sm g-py-2 g-px-2 g-border-b g-border-slate-100 g-flex g-flex-row g-items-start'
                  )}
                  key={item.key}
                  {...getItemProps({ item, index })}
                >
                  <MdCheck
                    className={cn(
                      'g-flex-none g-me-1 g-mt-1',
                      selected?.includes(item.key) ? 'g-visible' : 'g-invisible'
                    )}
                  />
                  <div className="g-flex-auto">
                    <div>{item.title}</div>
                    {item.description && <div className="g-text-sm g-text-gray-700">{item.description}</div>}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
);
