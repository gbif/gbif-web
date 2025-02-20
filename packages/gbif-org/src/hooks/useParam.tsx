import { Base64 } from 'js-base64';
import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

type Options<T> = {
  key: string;
  defaultValue?: T;
  hideDefault?: boolean;
  preventScrollReset?: boolean;
  replace?: boolean;
};

// hook to get and set number param from url
const numberParser = (str?: string) => parseFloat(str ?? '0');
export function useNumberParam(
  options: Options<string | number>
): [number, (value: number) => void] {
  const [value, setValue] = useParam({
    ...options,
    defaultValue: options.defaultValue ?? 0,
    parse: numberParser,
  });
  return [value, setValue];
}

const intParser = (str?: string) => parseInt(str ?? '0');
export function useIntParam(options: Options<number>): [number, (value: number) => void] {
  const [value, setValue] = useParam({
    ...options,
    defaultValue: options.defaultValue ?? 0,
    parse: intParser,
  });

  return [value, setValue];
}

const stringParser = (str?: string) => str;
export function useStringParam(
  options: Options<string>
): [string | undefined, (value?: string) => void] {
  const [value, setValue] = useParam({
    ...options,
    parse: stringParser,
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

export function useJsonParam(
  options: Options<object>
): [object | undefined, (value: object) => void] {
  const [value, setValue] = useParam({
    ...options,
    defaultValue: jsonEncoder(options.defaultValue),
    parse: jsonParser,
    serialize: jsonEncoder,
  });
  return [value, setValue];
}

export function useParam<T>({
  key,
  parse,
  serialize,
  defaultValue,
  hideDefault,
  replace,
  preventScrollReset = true,
}: {
  key: string;
  parse: (value?: string) => T;
  serialize?: (value?: T) => string | undefined;
  defaultValue?: string | number;
  hideDefault?: boolean;
  replace?: boolean;
  preventScrollReset?: boolean;
}): [T, (value: T) => void] {
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

  const setValue = useCallback(
    (value: T) => {
      setSearchParamsRef.current(
        (params) => {
          const clone = new URLSearchParams(params);
          const serializedValue = typeof serialize === 'function' ? serialize(value) : value + '';
          clone.set(key, serializedValue + '');
          if (value === undefined || (value === defaultValue && hideDefault)) {
            clone.delete(key);
          }
          return clone;
        },
        { replace, preventScrollReset }
      );
    },
    [key, serialize, defaultValue, hideDefault, replace, preventScrollReset]
  );

  return [value, setValue];
}
