/** @jsx jsx */
import { jsx } from '@emotion/core';
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
  isLoading,
  suggestions,
  loadingError,
  style,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);

  const [debouncedText] = useDebounce(inputProps.value, 100);
  useEffect(
    () => {
      if (debouncedText) {
        onSuggestionsFetchRequested({value: debouncedText});
      }
    },
    [debouncedText, onSuggestionsFetchRequested]
  );

  const itemToString= item => {
    if (typeof item === 'undefined' || item === null) return undefined; 
    return getSuggestionValue(item)
  };
  
  const hasSuggestions = suggestions && suggestions.length > 0;

  return <Downshift
    onChange={selection => {
        onSuggestionSelected({item: selection, value: itemToString(selection)});
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
              onChange: event => inputProps.onChange(event, {newValue: event.target.value}),
              onKeyDown: event => {
                if (event.key === 'Escape') {
                  // If the suggestions are not open and escape is pressed, then do not prevent default
                  if (!isOpen) {
                    event.nativeEvent.preventDownshiftDefault = true
                  }
                }
              }
              })}/>
          </div>
          <div css={styles.wrapper({ theme, isOpen })}>
            <StripeLoader active={isLoading} error={loadingError}/>
            {(isOpen && inputProps.value.length > 0) && <ul {...getMenuProps()} css={styles.menu({ theme })}>
              {(!isLoading && !hasSuggestions) && <li css={styles.item({ theme })} style={{color: '#aaa'}}>No suggestions provided</li>}
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
                        backgroundColor: highlightedIndex === index ? '#f5f5f5' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      },
                    })}
                  >
                    {renderSuggestion(item, {debouncedText, isHighlighted: highlightedIndex === index})}
                  </li>
                ))}
            </ul>}
          </div>
        </div>
      )}
  </Downshift>
});

Autocomplete.displayName = 'Autocomplete';
