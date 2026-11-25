// The heatmap colours a cell by where it ranks among the table's cells, along a scale of colour stops
// from the lowest to the highest. A site sets the stops in its theme (`heatmapColors`); the default
// runs from yellow to deep purple. Whether a number on a cell reads better in white or in dark
// ink is worked out from the cell's colour.

// Relative, so the colour tests can load it (vitest here does not resolve the @/ alias).
import { DEFAULT_HEATMAP_COLORS } from '../../../../config/theme/heatmapColors';

export type Rgb = [number, number, number];

/**
 * Below this relative luminance a cell gets white text, above it black. Picking whichever has the
 * higher WCAG contrast would put black on saturated mid tones such as rose (rgb 204 118 128), where
 * white reads better; that measure is known to overrate dark text on such colours.
 */
const WHITE_INK_BELOW = 0.31;

/** A colour written "#rgb" or "#rrggbb", as numbers. */
export function parseColour(value: string | undefined | null): Rgb | undefined {
  const hex = String(value ?? '')
    .trim()
    .replace(/^#/, '');
  const full = /^[0-9a-f]{3}$/i.test(hex)
    ? hex
        .split('')
        .map((c) => c + c)
        .join('')
    : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) return undefined;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb;
}

/** The colour at `t` (0 to 1) along the stops, mixed evenly between neighbouring stops. */
export function scaleColour(stops: Rgb[], t: number): Rgb {
  if (stops.length === 1) return stops[0];
  const at = Math.min(1, Math.max(0, t)) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(at));
  const f = at - i;
  return stops[i].map((c, k) => Math.round(c + (stops[i + 1][k] - c) * f)) as Rgb;
}

/**
 * The scale from a theme's colours. Colours that can't be read are left out; with fewer than two left,
 * the default is used.
 */
export function makeScale(colours: string[] | undefined): (t: number) => Rgb {
  const stops = (colours ?? []).map(parseColour).filter((c): c is Rgb => !!c);
  const use = stops.length >= 2 ? stops : DEFAULT_HEATMAP_COLORS.map((c) => parseColour(c)!);
  return (t) => scaleColour(use, t);
}

const channel = (v: number) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: Rgb) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** White or black ink, whichever reads better on the colour. */
export function inkFor(fill: Rgb): 'light' | 'dark' {
  return luminance(fill) < WHITE_INK_BELOW ? 'light' : 'dark';
}

export const cssColour = ([r, g, b]: Rgb) => `rgb(${r} ${g} ${b})`;
