
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext, useEffect } from 'react';
import Downshift from 'downshift';
import { useDebounce } from "use-debounce"; // example here https://codesandbox.io/s/rr40wnropq
import { Input } from '../Input/Input';
import { StripeLoader } from '../Loaders/StripeLoader';
import styles from './styles';

export const Autocomplete = React.forwardRef(({
  onSuggestionsFetchRequested,
  renderSuggestion,
  getSuggestionValue,
  onSuggestionSelected,
  inputProps,
  defaultIsOpen,
  isLoading,
  suggestions,
  loadingError,
  style,
  listCss,
  menuCss,
  delay = 300,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  const menuStyle = listCss || styles.menu;
  const wrapperStyle = menuCss || styles.wrapper;
  const [debouncedText] = useDebounce(inputProps.value, delay);
  useEffect(
    () => {
      if (typeof debouncedText === 'string') {
        onSuggestionsFetchRequested({ value: debouncedText });
      }
    },
    [debouncedText, onSuggestionsFetchRequested]
  );

  const itemToString = item => {
    if (typeof item === 'undefined' || item === null) return undefined;
    return getSuggestionValue(item)
  };

  const hasSuggestions = suggestions && suggestions.length > 0;

  return <Downshift
    defaultIsOpen={defaultIsOpen}
    onChange={selection => {
      onSuggestionSelected({ item: selection, value: itemToString(selection) });
    }
    }
    defaultHighlightedIndex={0}
    itemToString={itemToString}
  >
    {({
      getInputProps,
      getItemProps,
      getLabelProps,
      getMenuProps,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem,
      getRootProps,
    }) => (
        <div style={{ position: 'relative', display: 'inline-block', ...style }}>
          {/* <label {...getLabelProps()}>Enter a fruit</label> */}
          <div
            {...getRootProps({}, { suppressRefError: true })}
          >
            <Input {...getInputProps({
              ref: ref,
              ...inputProps,
              onChange: event => inputProps.onChange(event, { newValue: event.target.value }),
              onKeyDown: event => {
                if (event.key === 'Escape') {
                  // If the suggestions are not open and escape is pressed, then do not prevent default
                  if (!isOpen) {
                    event.nativeEvent.preventDownshiftDefault = true
                  }
                }
              }
            })} />
          </div>
          <div css={wrapperStyle({ theme, isOpen })}>
            {isOpen && <>
              <StripeLoader active={isLoading || loadingError} error={loadingError} />
              <ul {...getMenuProps()} css={menuStyle({ theme })}>
                {(!isLoading && !hasSuggestions && !loadingError) && <li css={styles.item({ theme })} style={{ color: '#aaa' }}>No suggestions provided</li>}
                {(!isLoading && !hasSuggestions && loadingError) && <li css={styles.item({ theme })} style={{ color: '#aaa' }}>Failed to load suggestions</li>}
                {hasSuggestions && suggestions
                  .map((item, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <li
                      css={styles.item({ theme })}
                      {...getItemProps({
                        key: index,
                        index,
                        item,
                        style: {
                          backgroundColor: highlightedIndex === index ? theme.paperBackground800 : theme.paperBackground500,
                          fontWeight: selectedItem === item ? 'bold' : 'normal',
                        },
                      })}
                    >
                      {renderSuggestion(item, { debouncedText, isHighlighted: highlightedIndex === index })}
                    </li>
                  ))}
              </ul>
            </>}
          </div>
        </div>
      )}
  </Downshift>
});

Autocomplete.displayName = 'Autocomplete';
