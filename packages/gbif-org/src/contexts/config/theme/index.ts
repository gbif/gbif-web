import { shadeHexColor, shadeBlend } from './colorUtils';
import { defaultTheme, darkTheme } from './baseThemes';
import { Theme } from './theme.d';

/**
 * 
 * @param theme Given a partial theme, then compute remaining vales such as primary color gradients, paper background gradients, etc.
 * @returns A full theme object including css variables
 */
const build = (theme: Partial<Theme>): Theme => {
  let fullTheme = { ...defaultTheme, ...theme };
  const isDarkTheme = fullTheme.isDarkTheme ?? false;
  const primary = fullTheme.primary ?? '#1393D8';
  const color = fullTheme.color ?? '#162d3d';
  const paperBackground = fullTheme.paperBackground ?? '#ffffff';
  const paperBackgroundElevated = fullTheme.paperBackgroundElevated ?? '#ffffff';
  const background = fullTheme.background ?? '#f1f5f8';
  const borderRadius = fullTheme.borderRadius ?? 0;
  const dense = fullTheme.dense ?? false;
  const fontFamily = fullTheme.fontFamily || '"Helvetica Neue", BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica", "Arial", sans-serif';

  const shadeDirection = isDarkTheme ? 1 : -1;

  const brightMapColors = [
    "#fed976",
    "#fd8d3c",
    "#F7642E",
    "#f03b20",
    "#bd0026"
  ];
  // const darkMapColors = brightMapColors;//['#ffd300', '#f4b456', '#e9928a', '#d96cc1', '#b93bff'];

  return {
    isDarkTheme,
    primary,
    color,
    dense,
    paperBackground,
    paperBackgroundElevated,
    background,
    linkColor: fullTheme.linkColor || primary,
    borderRadius,
    borderRadiusPx: `${borderRadius}px`,
    primary500: primary,
    primary600: shadeHexColor(primary, -0.05),
    primary700: shadeHexColor(primary, -0.1),
    primary800: shadeHexColor(primary, -0.2),
    primary900: shadeHexColor(primary, -0.3),
    primary400: shadeHexColor(primary, 0.05),
    primary300: shadeHexColor(primary, 0.1),
    primary200: shadeHexColor(primary, 0.35),
    primary100: shadeHexColor(primary, 0.6),
    transparentInk10: `${color}10`,
    transparentInk20: `${color}20`,
    transparentInk30: `${color}30`,
    transparentInk40: `${color}40`,
    transparentInk50: `${color}50`,
    transparentInk60: `${color}60`,
    transparentInk70: `${color}70`,
    transparentInk80: `${color}80`,
    fontSize: fullTheme.fontSize || '15px',
    paperBorderColor: fullTheme.paperBorderColor || '#e5ebed',
    darkPaperBackground: isDarkTheme ? '#000010' : '#4e4e52',
    drawerZIndex: fullTheme.drawerZIndex || 1000,
    stickyOffset: fullTheme.stickyOffset || '0px',
    fontFamily,
    headerFontFamily: fullTheme.headerFontFamily || fontFamily,
    mapDensityColors: fullTheme.mapDensityColors ?? brightMapColors,

    color900: shadeBlend(shadeDirection * 1 * 0.075, color, paperBackground),
    color800: shadeBlend(shadeDirection * 2 * 0.075, color, paperBackground),
    color700: shadeBlend(shadeDirection * 3 * 0.075, color, paperBackground),
    color600: shadeBlend(shadeDirection * 4 * 0.075, color, paperBackground),
    color500: shadeBlend(shadeDirection * 5 * 0.075, color, paperBackground),
    color400: shadeBlend(shadeDirection * 6 * 0.075, color, paperBackground),
    color300: shadeBlend(shadeDirection * 7 * 0.075, color, paperBackground),
    color200: shadeBlend(shadeDirection * 8 * 0.075, color, paperBackground),
    color100: shadeBlend(shadeDirection * 9 * 0.075, color, paperBackground),

    paperBackground600: shadeBlend(-1 * 0.25, paperBackground, background),
    paperBackground700: shadeBlend(-2 * 0.25, paperBackground, background),
    paperBackground800: shadeBlend(-3 * 0.25, paperBackground, background),
    paperBackground900: shadeBlend(-4 * 0.25, paperBackground, background),
    paperBackground500: paperBackground,
    paperBackground400: shadeBlend(1 * 0.25, paperBackground, paperBackgroundElevated),
    paperBackground300: shadeBlend(2 * 0.25, paperBackground, paperBackgroundElevated),
    paperBackground200: shadeBlend(3 * 0.25, paperBackground, paperBackgroundElevated),
    paperBackground100: shadeBlend(4 * 0.25, paperBackground, paperBackgroundElevated),
    
    ...theme
  };
}

const createTheme = ({ baseTheme, extendWith }: { baseTheme?: String, extendWith?: Partial<Theme> }) => {
  let theme = defaultTheme;
  if (baseTheme === 'dark') {
    theme = darkTheme;
  }
  const variables = Object.assign({}, theme, extendWith);
  return build(variables);
}

export default createTheme;