import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOnUnmount } from './useOnUnmount';

// hook to get and set number param from url
const numberParser = (str?: string) => parseFloat(str ?? '0');
export function useNumberParam({
  key,
  defaultValue,
  hideDefault,
  removeOnUnmount,
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
    removeOnUnmount,
  });
  return [value, setValue];
}

const intParser = (str?: string) => parseInt(str ?? '0');
export function useIntParam({
  key,
  defaultValue,
  hideDefault,
  removeOnUnmount,
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
    removeOnUnmount,
  });

  return [value, setValue];
}

const stringParser = (str?: string) => str;
export function useStringParam({
  key,
  defaultValue,
  hideDefault,
  removeOnUnmount,
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
    removeOnUnmount,
  });
  return [value, setValue];
}

function useParam<T>({
  key,
  parse,
  defaultValue,
  hideDefault,
  removeOnUnmount,
}: {
  key: string;
  parse: (value?: string) => T;
  defaultValue?: string | number;
  hideDefault?: boolean;
  removeOnUnmount?: boolean;
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

  const setValue = useCallback(
    (value?: T) => {
      // I use document location because the searchParams can't be updated multiple times in the same render in a predictable way like using useState
      // For example, removing the from param and adding view=map in the same render will result in none of the params being added
      const clone = new URLSearchParams(document.location.search);
      clone.set(key, parse(value + '') + '');
      if (value === undefined || (value === defaultValue && hideDefault)) {
        clone.delete(key);
      }
      setSearchParamsRef.current(clone);
    },
    [key, parse, defaultValue, hideDefault]
  );

  useOnUnmount(() => {
    if (removeOnUnmount) {
      // I use document location because the searchParams can't be updated multiple times in the same render in a predictable way like using useState
      // For example, removing the from param and adding view=map in the same render will result in none of the params being added
      const clone = new URLSearchParams(document.location.search);
      clone.delete(key);
      setSearchParamsRef.current(clone);
    }
  });

  return [value, setValue];
}
