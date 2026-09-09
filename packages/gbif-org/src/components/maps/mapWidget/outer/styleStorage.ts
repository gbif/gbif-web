import { mapWidgetOptions, RasterStyles } from '../options';

// Pure helpers for persisting/restoring the selected map style.
// Kept free of `window`/localStorage access so the resolution logic is unit-testable.

const defaultRasterStyles = mapWidgetOptions.predefined.find((x) => x.name === 'GREEN')!;

function findPredefined(name?: string): RasterStyles | undefined {
  if (!name) return undefined;
  return mapWidgetOptions.predefined.find((x) => x.name === name);
}

function isRasterStyles(value: unknown): value is RasterStyles {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.name === 'string' && typeof v.baseMapStyle === 'string' && Array.isArray(v.params)
  );
}

export function serializeStyle(style: RasterStyles): string {
  return JSON.stringify(style);
}

// Parse a persisted style string. Predefined styles are re-resolved from the current
// option definitions by name (so a stored predefined picks up any updated definition);
// a custom style is returned as-is. Returns null when the value is missing or malformed.
export function parseStoredStyle(raw: string | null | undefined): RasterStyles | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRasterStyles(parsed)) return null;
  if (parsed.name === 'CUSTOM') return parsed;
  return findPredefined(parsed.name) ?? null;
}

type ResolveInitialStyleArgs = {
  mapStyle?: string;
  persistStyleSelection: boolean;
  defaultStyleName: string;
  stored: RasterStyles | null;
};

// Resolve which style the widget should start with.
// Precedence: forced `mapStyle` prop > persisted selection (predefined or custom) > page default > GREEN.
export function resolveInitialStyle({
  mapStyle,
  persistStyleSelection,
  defaultStyleName,
  stored,
}: ResolveInitialStyleArgs): RasterStyles {
  // A forced style prop overrides everything and is intentionally not persisted.
  if (mapStyle) {
    return findPredefined(mapStyle) ?? defaultRasterStyles;
  }

  if (persistStyleSelection && stored) {
    return stored;
  }

  return findPredefined(defaultStyleName) ?? defaultRasterStyles;
}
