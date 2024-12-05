import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Base64 } from 'js-base64';

// hook to get and set number param from url
const numberParser = (str?: string) => parseFloat(str ?? '0');
export function useNumberParam({
  key,
  defaultValue,
  hideDefault,
}: {
  key: string;
  defaultValue?: string | number;
  hideDefault?: boolean;
  removeOnUnmount?: boolean;
}): [number, (value?: number) => void] {
  const [value, setValue] = useParam({
    key,
    defaultValue: defaultValue ?? 0,
    parse: numberParser,
    hideDefault,
  });
  return [value, setValue];
}

const intParser = (str?: string) => parseInt(str ?? '0');
export function useIntParam({
  key,
  defaultValue,
  hideDefault,
}: {
  key: string;
  defaultValue?: number;
  hideDefault?: boolean;
  removeOnUnmount?: boolean;
}): [number, (value?: number) => void] {
  const [value, setValue] = useParam({
    key,
    defaultValue: defaultValue ?? 0,
    parse: intParser,
    hideDefault,
  });

  return [value, setValue];
}

const stringParser = (str?: string) => str;
export function useStringParam({
  key,
  defaultValue,
  hideDefault,
}: {
  key: string;
  defaultValue?: string;
  hideDefault?: boolean;
  removeOnUnmount?: boolean;
}): [string | undefined, (value?: string) => void] {
  const [value, setValue] = useParam({
    key,
    defaultValue: defaultValue,
    parse: stringParser,
    hideDefault,
  });
  return [value, setValue];
}

const jsonParser = (obj?: string) => {
  if (!obj) return undefined;
  try {
    const value = obj ? Base64.decode(obj) : obj;
    const parsedValue = JSON.parse(value);
    return parsedValue;
  } catch (err) {
    return undefined;
  }
};
const jsonEncoder = (v?: object) => {
  try {
    const encoded = Base64.encode(JSON.stringify(v));
    return encoded;
  } catch (err) {
    return undefined;
  }
};

export function useJsonParam({
  key,
  defaultValue,
  hideDefault,
}: {
  key: string;
  defaultValue?: object;
  hideDefault?: boolean;
  removeOnUnmount?: boolean;
}): [object | undefined, (value?: object) => void] {
  const [value, setValue] = useParam({
    key,
    defaultValue: jsonEncoder(defaultValue),
    parse: jsonParser,
    serialize: jsonEncoder,
    hideDefault,
  });
  return [value, setValue];
}

function useParam<T>({
  key,
  parse,
  serialize,
  defaultValue,
  hideDefault
}: {
  key: string;
  parse: (value?: string) => T;
  serialize?: (value?: T) => string | undefined;
  defaultValue?: string | number;
  hideDefault?: boolean;
}): [T, (value?: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = parse(
    searchParams.get(key) ?? (defaultValue ? defaultValue.toString() : undefined)
  );

  // setSearchParams is not stable
  // https://github.com/remix-run/react-router/issues/9991
  const setSearchParamsRef = useRef(setSearchParams);
  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  const setValue = useCallback((value?: T) => {
    setSearchParams((params) => {
      const clone = new URLSearchParams(params);
      const serializedValue = typeof serialize === 'function' ? serialize(value) : value + '';
      clone.set(key, serializedValue + '');
      if (value === undefined || (value === defaultValue && hideDefault)) {
        clone.delete(key);
      }
      return clone;
    });
  }, [key, serialize, setSearchParams, defaultValue, hideDefault]);

  return [value, setValue];
}
