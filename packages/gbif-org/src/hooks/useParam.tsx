import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

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
}): [string | undefined, (value?: string) => void] {
  const [value, setValue] = useParam({
    key,
    defaultValue: defaultValue,
    parse: stringParser,
    hideDefault,
  });
  return [value, setValue];
}

function useParam<T>({
  key,
  parse,
  defaultValue,
  hideDefault,
}: {
  key: string;
  parse: (value?: string) => T;
  defaultValue?: string | number;
  hideDefault?: boolean;
}): [T, (value?: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = parse(
    searchParams.get(key) ?? (defaultValue ? defaultValue.toString() : undefined)
  );
  const setValue = useCallback(
    (value?: T) => {
      setSearchParams((params) => {
        const clone = new URLSearchParams(params);
        clone.set(key, parse(value + '') + '');
        if (value === undefined || (value === defaultValue && hideDefault)) {
          clone.delete(key);
        }
        return clone;
      });
    },
    [key, parse, setSearchParams, defaultValue, hideDefault]
  );
  return [value, setValue];
}
