import { describe, expect, test } from 'vitest';
import { inkFor, makeScale, parseColour, scaleColour } from './colour';

describe('heatmap colours', () => {
  test('reads #rgb and #rrggbb, and nothing else', () => {
    expect(parseColour('#57bb8a')).toEqual([87, 187, 138]);
    expect(parseColour('fff')).toEqual([255, 255, 255]);
    expect(parseColour('green')).toBeUndefined();
    expect(parseColour(undefined)).toBeUndefined();
  });

  test('mixes evenly between neighbouring stops', () => {
    const stops = [parseColour('#000')!, parseColour('#fff')!, parseColour('#f00')!];
    expect(scaleColour(stops, 0)).toEqual([0, 0, 0]);
    expect(scaleColour(stops, 0.25)).toEqual([128, 128, 128]);
    expect(scaleColour(stops, 0.5)).toEqual([255, 255, 255]);
    expect(scaleColour(stops, 1)).toEqual([255, 0, 0]);
    // outside 0 to 1 stays at the ends
    expect(scaleColour(stops, 2)).toEqual([255, 0, 0]);
  });

  test('a theme without two readable colours gets the default scale', () => {
    const fallback = makeScale(undefined);
    expect(makeScale(['nope', '#123456'])(0)).toEqual(fallback(0));
    expect(makeScale(['#000000', '#ffffff'])(1)).toEqual([255, 255, 255]);
  });

  test('the default scale: dark ink on yellow, white on purple', () => {
    const scale = makeScale(undefined);
    expect(inkFor(scale(0))).toBe('dark');
    expect(inkFor(scale(0.25))).toBe('dark');
    expect(inkFor(scale(0.75))).toBe('light');
    expect(inkFor(scale(1))).toBe('light');
  });

  test('ink reads on its colour', () => {
    expect(inkFor([255, 214, 102])).toBe('dark');
    expect(inkFor([20, 40, 90])).toBe('light');
  });
});
