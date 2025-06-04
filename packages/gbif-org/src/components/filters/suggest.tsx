import { Config, LanguageOption, useConfig } from '@/config/config';
import { SearchMetadata, useSearchContext } from '@/contexts/search';
import { useI18n } from '@/reactRouterPlugins';
import { CANCEL_REQUEST } from '@/utils/fetchWithCancel';
import { cn } from '@/utils/shadcn';
import { useCombobox } from 'downshift';
import React, { useCallback, useEffect } from 'react';
import { MdCheck, MdSearch } from 'react-icons/md';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';

export interface SuggestionItem {
  key: string;
  title: string;
  description?: string;
}

export type SuggestFnProps = {
  q?: string;
  locale: string;
  siteConfig: Config;
  searchContext: SearchMetadata;
  intl: IntlShape;
  currentLocale: LanguageOption;
};

export type SuggestResponseType = {
  cancel: () => void;
  promise: Promise<SuggestionItem[]>;
};

export type SuggestFnType = (args: SuggestFnProps) => SuggestResponseType;

export type SuggestProps = {
  onSelect: (item: SuggestionItem) => void;
  className?: string;
  getSuggestions?: SuggestFnType;
  selected?: (string | number)[];
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  render?: (item: SuggestionItem) => React.ReactNode;
  getStringValue?: (item: SuggestionItem) => string;
  placeholder?: string;
};

export const Suggest = React.forwardRef<HTMLInputElement, SuggestProps>(
  (
    {
      onSelect,
      className,
      getSuggestions,
      selected,
      onKeyDown,
      render,
      getStringValue,
      placeholder,
    }: SuggestProps,
    ref
  ) => {
    return (
      <Search
        ref={ref}
        onSearch={getSuggestions || (() => ({ cancel: () => {}, promise: Promise.resolve([]) }))}
        {...{ render, getStringValue, placeholder, onKeyDown, selected, className, onSelect }}
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
      onKeyDown,
      render,
      placeholder,
      getStringValue = (item: SuggestionItem) => item.title,
    }: {
      onSearch: ({ q, intl }: SuggestFnProps) => {
        cancel: () => void;
        promise: Promise<SuggestionItem[]>;
      };
      onSelect: (item: SuggestionItem) => void;
      className?: string;
      selected?: (string | number)[];
      onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
      render?: (item: SuggestionItem) => React.ReactNode;
      getStringValue?: (item: SuggestionItem) => string;
      placeholder?: string;
    },
    ref
  ) => {
    const config = useConfig();
    const searchContext = useSearchContext();
    const intl = useIntl();
    const { locale: currentLocale } = useI18n();
    const [items, setItems] = React.useState<SuggestionItem[]>([]);
    const [selectedItem, setSelectedItem] = React.useState<SuggestionItem | null>(null);
    const [q, setQ] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const placeholderText = intl.formatMessage({
      id: placeholder ?? 'search.placeholders.default',
    });

    useEffect(() => {
      const { cancel, promise } = onSearch({
        q,
        intl,
        searchContext,
        siteConfig: config,
        locale: intl.locale,
        currentLocale,
      });
      setIsLoading(true);
      promise
        .then((data) => {
          setItems(data);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err === CANCEL_REQUEST) return;
          console.error(err);
          setIsLoading(false);
        });

      return () => {
        if (cancel) cancel();
      };
    }, [q, intl, searchContext, config, onSearch]);

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
        setQ(inputValue);
      },
      items: items || [],
      itemToString(item: SuggestionItem | null) {
        return item ? getStringValue(item) : '';
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

    const keyDownHandler = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (isOpen) {
          event.stopPropagation();
        } else {
          onKeyDown?.(event);
        }
      },
      [isOpen, onKeyDown]
    );

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
              placeholder={placeholderText}
              className={cn(
                'g-flex-auto g-w-full g-bg-transparent g-py-1 g-text-sm g-transition-colors file:g-border-0 file:g-bg-transparent file:g-text-sm file:g-font-medium placeholder:g-text-muted-foreground focus-visible:g-outline-none disabled:g-cursor-not-allowed'
                // 'focus-visible:g-ring-2 focus-visible:g-ring-blue-400/30 focus-visible:g-ring-offset-0 g-ring-inset',
              )}
              {...getInputProps({ ref, onKeyDown: keyDownHandler })}
            />
          </div>
        </div>
        <div className="g-absolute g-w-full g-z-10">
          <ul
            className={`g-w-full g-bg-white g-shadow-2xl g-max-h-80 g-overflow-auto g-p-0 g-z-10 g-rounded g-border g-border-solid ${
              !isOpen && 'g-hidden'
            }`}
            {...getMenuProps()}
          >
            {isOpen && (
              <>
                {!isLoading && items.length === 0 && (
                  <li className="g-text-slate-500 g-text-sm g-py-2 g-px-2 g-border-b g-border-slate-100 g-flex g-flex-row g-items-start">
                    <FormattedMessage id="search.noResults" />
                  </li>
                )}
                {items.length > 0 &&
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
                        {render && render(item)}
                        {!render && (
                          <>
                            <div>{item.title}</div>
                            {item.description && (
                              <div className="g-text-sm g-text-gray-700">{item.description}</div>
                            )}
                          </>
                        )}
                      </div>
                    </li>
                  ))}
              </>
            )}
          </ul>
        </div>
      </div>
    );
  }
);
