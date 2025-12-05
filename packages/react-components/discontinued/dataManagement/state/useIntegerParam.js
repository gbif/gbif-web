import React, { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';
import isObjectLike from 'lodash/isObjectLike';
import isEmpty from 'lodash/isEmpty';
import equal from 'fast-deep-equal/react';
import { Base64 } from 'js-base64';
import { useHistory, useLocation } from "react-router-dom";

export function useIntegerParam({
  param,
  dataType = dynamicParam,
  defaultValue,
  initialState
}) {
  const [value, setValue] = useState();
  let history = useHistory();
  let location = useLocation();

  const updateParam = useCallback(
    (newValue) => {
      console.log('update');
      const parsed = queryString.parse(location.search);

      if (!newValue) {
        delete parsed[param];
      } else {
        parsed[param] = newValue;
      }
      if (typeof defaultValue !== 'undefined' && newValue === defaultValue) {
        delete parsed[param];
      }

      history.push(location.pathname + '?' + queryString.stringify(parsed));
    },
    [],
  );

  useEffect(() => {
    const parsed = queryString.parse(location?.search);
    let parsedValue = parsed[param];
    parsedValue = dataType.parse(parsedValue);
    if (typeof parsedValue === 'undefined' && typeof defaultValue !== 'undefined') {
      parsedValue = defaultValue;
    }
    if (value !== parsedValue) setValue(parsedValue);

    if (initialState) updateUrl(initialState);
    return () => {
      // remove our param from the url as it is just litter now
      const parsed = queryString.parse(location.search);
      delete parsed[param];
      history.replace(location.pathname + '?' + queryString.stringify(parsed));
    };
  }, [location]);

  return [value, updateParam];
}

export const stringParam = {
  parse: val => val,
  stringify: val => val
}

export const dynamicParam = {
  parse: guessType,
  stringify: val => typeof val === 'object' ? JSON.stringify(val) : val
}

function guessType(value) {
  //try to guess
  try {
    let parsedValue = JSON.parse(value);
    return parsedValue;
  } catch (err) {
    return value;
  }
}