import { SearchInput } from '@/components/searchInput';
import { cn } from '@/utils/shadcn';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useCombobox } from 'downshift';
import React, { useCallback, useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';

export function ComboBoxExample({
  onSelect,
  className,
}: {
  onSelect: (item: any) => void;
  className?: string;
}) {
  const search = useCallback((q: string) => {
    // fetch data from https://api.gbif.org/v1/organization/suggest?limit=8&q=${q} and store it in results
    return fetch(`https://api.gbif.org/v1/organization/suggest?limit=20&q=${q}`)
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
  }, []);

  return <ComboBox onSearch={search} onSelect={onSelect} className={className} />;
}

function ComboBox({
  onSearch,
  onSelect,
  className,
}: {
  onSearch: (q: string) => Promise<any>;
  onSelect: (item: any) => void;
  className?: string;
}) {
  const [items, setItems] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState(null);
  // const [inputValue, setInputValue] = React.useState('');
  const {
    isOpen,
    getToggleButtonProps,
    inputValue,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      // setInputValue(inputValue);
      onSearch(inputValue)
        .then((data) => {
          // setResults(data);
          setItems(data);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    items: items || [],
    itemToString(item) {
      return item ? item.title : '';
    },
    // inputValue,
    selectedItem,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      onSelect(newSelectedItem);
      setSelectedItem(null);
    },
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
        // case useCombobox.stateChangeTypes.InputBlur:
        //   return {
        //     ...inputChanges,
        //     inputValue: '', // don't add the item string as input value at selection.
        //   }
        default:
          return { ...inputChanges };
      }
    },
  });

  // useEffect(() => {
  //   onSearch('')
  //       .then((data) => {
  //         setItems(data);
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  // }, []);

  return (
    <div className="g-w-full g-relative">
      <div className="g-w-full g-flex g-flex-col g-gap-1">
        <label className="g-w-fit g-sr-only" {...getLabelProps()}>
          Search publishers
        </label>
        {/* <SearchInput placeholder="Search publishers" className="g-w-full" {...getInputProps()} /> */}
        <div
          className={cn(
            'g-flex disabled:g-opacity-50 g-items-center g-justify-center g-w-full', className
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
            {...getInputProps()}
          />
        </div>
      </div>
      <ul
        className={`g-absolute g-w-full g-bg-white g-mt-1 g-shadow-lg g-max-h-80 g-overflow-auto g-p-0 g-z-10 g-rounded g-border ${
          !(isOpen && items.length) && 'g-hidden'
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={cn(
                highlightedIndex === index && 'g-bg-blue-300',
                selectedItem === item && 'g-font-bold',
                'g-text-sm g-py-2 g-px-3 g-shadow-sm g-flex g-flex-col'
              )}
              key={item.key}
              {...getItemProps({ item, index })}
            >
              <span>{item.title}</span>
              {/* <span className="g-text-sm g-text-gray-700">{item.key}</span> */}
            </li>
          ))}
      </ul>
    </div>
  );
}
