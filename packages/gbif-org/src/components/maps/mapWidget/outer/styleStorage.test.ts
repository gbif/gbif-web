import { expect, test } from 'vitest';
import { RasterStyles } from '../options';
import { parseStoredStyle, resolveInitialStyle, serializeStyle } from './styleStorage';

const CLASSIC_HEX: RasterStyles = {
  name: 'CLASSIC_HEX',
  baseMapStyle: 'gbif-classic',
  params: [{ style: 'classic.poly', bin: 'hex', hexPerTile: 70 }],
};

const customStyle: RasterStyles = {
  name: 'CUSTOM',
  baseMapStyle: 'gbif-light',
  params: [{ style: 'green.point', bin: 'hex', hexPerTile: 30 }],
};

test('resolveInitialStyle: mapStyle prop wins over persisted and default', () => {
  const result = resolveInitialStyle({
    mapStyle: 'CLASSIC_HEX',
    persistStyleSelection: true,
    defaultStyleName: 'GREEN',
    stored: customStyle,
  });
  expect(result).toEqual(CLASSIC_HEX);
});

test('resolveInitialStyle: restores a persisted predefined style when persistence is enabled', () => {
  const stored = parseStoredStyle(serializeStyle({ ...CLASSIC_HEX, name: 'CLASSIC', params: [] }));
  const result = resolveInitialStyle({
    persistStyleSelection: true,
    defaultStyleName: 'GREEN',
    stored,
  });
  // Predefined styles are re-resolved from the current option definitions by name
  expect(result?.name).toBe('CLASSIC');
  expect(result?.baseMapStyle).toBe('gbif-classic');
});

test('custom style round-trips through serialize -> parse -> resolve', () => {
  const stored = parseStoredStyle(serializeStyle(customStyle));
  expect(stored).toEqual(customStyle);

  const result = resolveInitialStyle({
    persistStyleSelection: true,
    defaultStyleName: 'CLASSIC_HEX',
    stored,
  });
  expect(result).toEqual(customStyle);
});

test('resolveInitialStyle: falls back to defaultStyleName when nothing is stored', () => {
  const result = resolveInitialStyle({
    persistStyleSelection: true,
    defaultStyleName: 'CLASSIC_HEX',
    stored: null,
  });
  expect(result).toEqual(CLASSIC_HEX);
});

test('resolveInitialStyle: ignores stored style when persistence is disabled', () => {
  const result = resolveInitialStyle({
    persistStyleSelection: false,
    defaultStyleName: 'CLASSIC_HEX',
    stored: customStyle,
  });
  expect(result).toEqual(CLASSIC_HEX);
});

test('parseStoredStyle: returns null for invalid or malformed input', () => {
  expect(parseStoredStyle(null)).toBeNull();
  expect(parseStoredStyle('')).toBeNull();
  expect(parseStoredStyle('not json')).toBeNull();
  expect(parseStoredStyle(JSON.stringify({ name: 'CUSTOM' }))).toBeNull(); // missing fields
  // A predefined name that no longer exists resolves to null
  expect(
    parseStoredStyle(JSON.stringify({ name: 'GONE', baseMapStyle: 'x', params: [] }))
  ).toBeNull();
});
