// The heatmap fills cells with the site's primary colour at an opacity. Whether a number on it reads
// better in white or in dark ink depends on that colour, which each portal sets, so it is worked out
// from the colour itself.

export type Rgb = [number, number, number];

/** GBIF green: the fallback when the theme's variable can't be read (server rendering, tests). */
export const FALLBACK_PRIMARY: Rgb = [75, 161, 81];

const DARK_INK: Rgb = [15, 23, 42]; // tailwind slate-900

/** The theme's `--primary500` ("75 161 81"), as numbers. */
export function parseRgb(value: string | undefined | null): Rgb | undefined {
  const parts = String(value ?? '')
    .trim()
    .split(/[\s,/]+/)
    .map(Number);
  if (parts.length < 3 || parts.slice(0, 3).some((n) => !Number.isFinite(n))) return undefined;
  return [parts[0], parts[1], parts[2]];
}

export function readPrimary(): Rgb {
  if (typeof document === 'undefined') return FALLBACK_PRIMARY;
  const value = getComputedStyle(document.documentElement).getPropertyValue('--primary500');
  return parseRgb(value) ?? FALLBACK_PRIMARY;
}

const channel = (v: number) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: Rgb) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const contrast = (a: Rgb, b: Rgb) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** What the colour looks like at this opacity over a white card. */
export const over = (colour: Rgb, alpha: number): Rgb =>
  colour.map((c) => Math.round(c * alpha + 255 * (1 - alpha))) as Rgb;

/** White or dark ink, whichever reads better on the colour at this opacity. */
export function inkFor(colour: Rgb, alpha: number): 'light' | 'dark' {
  const fill = over(colour, alpha);
  return contrast(fill, [255, 255, 255]) > contrast(fill, DARK_INK) ? 'light' : 'dark';
}

/** The CSS fill for a cell at this opacity. Uses the theme's variable, so a portal's colour applies. */
export const fillCss = (alpha: number) => `rgb(var(--primary500) / ${alpha})`;
