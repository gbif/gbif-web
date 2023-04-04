
import { css, jsx } from '@emotion/react';
import React, { useCallback, useEffect } from "react";
import { Autocomplete } from './Autocomplete';
import axios from 'axios';
import { MdClear } from 'react-icons/md';
import { Button } from '../Button';
import { useIntl } from 'react-intl';
import { uncontrollable } from 'uncontrollable';

export const SuggestControlled = ({
  itemToString = a => a,
  renderSuggestion = a => a,
  onBlur,
  getSuggestions,
  onKeyPress,
  allowClear,
  value,
  item,
  onSelect,
  onChange,
  initialValue,
  placeholderTranslationPath,
  focusRef,
  ...props
}) => {
  const intl = useIntl();
  const [suggestions, setSuggestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const ref = React.useRef();

  useEffect(() => {
    if (typeof (initialValue) !== 'function') {
      onChange(initialValue);
    } else {
      initialValue(axios).then((value) => {
        onChange(value);
      });
    }
  }, [initialValue])

  const onSuggestionsFetchRequested = useCallback(async ({ value }) => {
    setLoading(false);
    const suggestions = await getSuggestions({q: value, axios});
    setLoading(true);
    setSuggestions(suggestions);
  }, [getSuggestions]);

  const onSuggestionSelected = useCallback(({ item, value }) => {
    onSelect(item);
    onChange(value);
  }, [onSelect]);

  const blurHandler = useCallback((event) => {
    if (onBlur) {
      onBlur(event);
    } else {
      let newText = '';
      if (item) {
        newText = itemToString(item);
      }
      onChange(newText);
    }
  }, [onBlur, item, onChange, itemToString]);

  // const onSuggestionsClearRequested = useCallback(() => {
  //   setSuggestions([]);
  // }, []);

  const changeHandler = useCallback((event, { newValue }) => {
    onChange(newValue);
  }, []);

  const clearHandler = useCallback(event => {
    onSelect();
    onChange('');
    if (ref && ref.current) {
      ref.current.focus();
    }
  }, [onSelect, onChange]);

  const inputProps = {
    placeholder: intl.formatMessage({ id: placeholderTranslationPath, defaultMessage: placeholderTranslationPath }),
    value,
    onChange: changeHandler,
    onBlur: blurHandler,
    onKeyPress: onKeyPress
  };

  return (
    <>
      <Autocomplete
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        // onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={itemToString}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
        isLoading={loading}
        allowClear={allowClear && (item || value)}
        onClear={clearHandler}
        ref={ref}
        {...props}
      />
    </>
  );
}

export const Suggest = uncontrollable(SuggestControlled, {
  value: 'onChange',
  item: 'onSelect'
});