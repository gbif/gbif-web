import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import history from '../history';
import queryString from 'query-string';
import isObjectLike from 'lodash/isObjectLike';
import isEmpty from 'lodash/isEmpty';

export function useUrlState({ param, dataType = dynamicParam, replaceState = false, defaultValue, base64encode = false, stripEmptyKeys = true, initialState }) {
  const [value, setValue] = useState();
  const action = replaceState ? 'replace' : 'push';

  const updateUrl = useCallback(
    (newValue) => {
      const parsed = queryString.parse(location.search);
      if (isObjectLike(newValue)) {
        if (isEmpty(newValue.must)) delete newValue.must;
        if (isEmpty(newValue.must_not)) delete newValue.must_not;
        if (isEmpty(newValue)) newValue = undefined;
      }
      if (newValue) {
        let stringifiedValue = Array.isArray(newValue) ? newValue.map(x => dataType.stringify(x)) : dataType.stringify(newValue);
        if (base64encode) stringifiedValue = btoa(stringifiedValue);
        parsed[param] = stringifiedValue;
      } else {
        delete parsed[param];
      }
      if (typeof defaultValue !== 'undefined' && newValue === defaultValue) {
        delete parsed[param];
      }
      history[action](window.location.pathname + '?' + queryString.stringify(parsed));
    },
    [],
  );

  useEffect(() => {
    const changeHandler = ({ location }) => {
      const parsed = queryString.parse(location.search);
      let parsedValue = parsed[param];
      if (base64encode && parsedValue) parsedValue = atob(parsedValue);
      parsedValue = dataType.parse(parsedValue);
      let parsedNormalizedValue = Array.isArray(parsedValue) ?
        parsedValue.map(x => dataType.parse(x)) :
        dataType.parse(parsedValue);
      if (typeof parsedNormalizedValue === 'undefined' && typeof defaultValue !== 'undefined') {
        parsedNormalizedValue = defaultValue;
      }
      setValue(parsedNormalizedValue);
    };
    changeHandler({ location: window.location });
    const unlisten = history.listen(changeHandler);

    if (initialState) updateUrl(initialState);

    return () => {
      unlisten();
      const parsed = queryString.parse(location.search);
      delete parsed[param];
      history[action](window.location.pathname + '?' + queryString.stringify(parsed));
      console.log(location.search);
    };
  }, []);

  return [value, updateUrl];
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


// Usage
// import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
// const [num, setNum] = useQueryParam('x', NumberParam);






// export const getParams = function (url, { alwaysAsArray, guessType, typeConfig = {} }) {
//   var params = {};
//   let query;
//   if (typeof document !== 'undefined') {
//     var parser = document.createElement('a');
//     parser.href = url;
//     query = parser.search.substring(1);
//   } else if (url.indexOf('?') > -1) {
//     query = url.substr(url.indexOf('?') + 1);
//   } else {
//     query = '';
//   }
//   var vars = query.split('&');
//   for (var i = 0; i < vars.length; i++) {
//     var pair = vars[i].split('=');
//     var key = pair[0];
//     if (typeof key === 'undefined' || key === '' || typeof pair[1] === 'undefined') continue;
//     var value = decodeURIComponent(pair[1]);
//     var type = typeConfig[key];
//     if (type) {
//       switch (type) {
//         case 'number':
//           value = Number(value);
//         default:
//           value = value;
//       }
//     } else if (guessType) {
//       //try to guess
//       value = convert(value);
//     }
//     if (typeof params[key] === 'undefined') {
//       params[key] = alwaysAsArray ? [value] : value;
//     } else if (Array.isArray(params[key])) {
//       params[key].push(value);
//     } else {
//       params[key] = [params[key], value];
//     }
//   }
//   return params;
// };

// function convert(value) {
//   //try to guess
//   try {
//     let parsedValue = JSON.parse(value);
//     return parsedValue;
//   } catch (err) {
//     return value;
//   }
// }

// console.log(JSON.stringify(getParams('/sdf?test=0&t&r=test=6,7&j=%7B%22a%22%3A5%7D', {guessType: true}), null, 2));
