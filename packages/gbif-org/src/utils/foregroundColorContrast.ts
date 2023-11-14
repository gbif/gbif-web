import fontColorContrast from 'font-color-contrast';

// The font-color-contrast package is messing with the build.
// I think it's because it's using the commonjs module system.
// This is a workaround to make it work.
export const foregroundColorContrast: typeof fontColorContrast =
  (fontColorContrast as any).default ?? fontColorContrast;
