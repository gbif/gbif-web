import { darkTheme, defaultTheme } from './baseThemes';
import { colourIsLight, shadeBlend, shadeHexColor } from './colorUtils';
import { Theme } from './theme';

/**
 *
 * @param theme Given a partial theme, then compute remaining vales such as primary color gradients, paper background gradients, etc.
 * @returns A full theme object including css variables
 */
const build = (theme: Partial<Theme>): Theme => {
  const fullTheme = { ...defaultTheme, ...theme };
  const {
    isDarkTheme,
    primary,
    color,
    paperBackground,
    paperBackgroundElevated,
    background,
    borderRadius,
    dense,
  } = fullTheme;

  // remove all single and double quotation marks from the font family as this conflicts with serialization on the server
  const fontFamily = fullTheme.fontFamily.replace(/['"]+/g, '');
  const headerFontFamily = (fullTheme.headerFontFamily || fontFamily).replace(/['"]+/g, '');

  const shadeDirection = isDarkTheme ? 1 : -1;

  const brightMapColors = ['#fed976', '#fd8d3c', '#F7642E', '#f03b20', '#bd0026'];
  // const darkMapColors = brightMapColors;//['#ffd300', '#f4b456', '#e9928a', '#d96cc1', '#b93bff'];

  const chartColors = [
    '#003f5c',
    '#2f4b7c',
    '#665191',
    '#a05195',
    '#d45087',
    '#f95d6a',
    '#ff7c43',
    '#ffa600',
    '#cea400',
    '#a19f08',
    '#789523',
    '#558935',
  ];

  const iucnColors = {
    NA: '#B8A896',
    NE: '#E8E8E8',
    DD: '#C4C4B8',
    CD: '#cea400',
    LR: '#cea400',
    LC: '#558935',
    NT: '#a19f08',
    VU: '#ffa600',
    EN: '#f95d6a',
    CR: '#C84248',
    RE: '#a05195',
    EW: '#665191',
    EX: '#231F20',
  };

  const primaryVariants = {
    primary50: shadeHexColor(primary, 0.8),
    primary100: shadeHexColor(primary, 0.6),
    primary200: shadeHexColor(primary, 0.35),
    primary300: shadeHexColor(primary, 0.2),
    primary400: shadeHexColor(primary, 0.1),
    primary500: primary,
    primary600: shadeHexColor(primary, -0.1),
    primary700: shadeHexColor(primary, -0.2),
    primary800: shadeHexColor(primary, -0.5),
    primary900: shadeHexColor(primary, -0.7),
    primary950: shadeHexColor(primary, -0.9),
  };

  const primaryContrastVariants = {
    primaryContrast50: getContrastInk(primaryVariants.primary50),
    primaryContrast100: getContrastInk(primaryVariants.primary100),
    primaryContrast200: getContrastInk(primaryVariants.primary200),
    primaryContrast300: getContrastInk(primaryVariants.primary300),
    primaryContrast400: getContrastInk(primaryVariants.primary400),
    primaryContrast500: getContrastInk(primaryVariants.primary500),
    primaryContrast600: getContrastInk(primaryVariants.primary600),
    primaryContrast700: getContrastInk(primaryVariants.primary700),
    primaryContrast800: getContrastInk(primaryVariants.primary800),
    primaryContrast900: getContrastInk(primaryVariants.primary900),
    primaryContrast950: getContrastInk(primaryVariants.primary950),
  };

  return {
    isDarkTheme,
    primary,
    ...primaryVariants,
    ...primaryContrastVariants,
    color,
    dense,
    paperBackground,
    paperBackgroundElevated,
    background,
    linkColor: fullTheme.linkColor || primary,
    borderRadius,
    borderRadiusPx: `${borderRadius}px`,
    transparentInk10: `${color}10`,
    transparentInk20: `${color}20`,
    transparentInk30: `${color}30`,
    transparentInk40: `${color}40`,
    transparentInk50: `${color}50`,
    transparentInk60: `${color}60`,
    transparentInk70: `${color}70`,
    transparentInk80: `${color}80`,
    fontSize: fullTheme.fontSize,
    paperBorderColor: fullTheme.paperBorderColor || '#e5ebed',
    darkPaperBackground: isDarkTheme ? '#000010' : '#4e4e52',
    drawerZIndex: fullTheme.drawerZIndex,
    stickyOffset: fullTheme.stickyOffset,
    mapDensityColors: fullTheme.mapDensityColors ?? brightMapColors,
    chartColors: fullTheme.chartColors ?? chartColors,
    iucnColors: fullTheme.iucnColors ?? iucnColors,

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

    ...theme,

    // we clean these, so they have to go last
    fontFamily,
    headerFontFamily,
  };
};

const createTheme = ({
  baseTheme,
  extendWith,
}: {
  baseTheme?: string;
  extendWith?: Partial<Theme>;
}) => {
  const theme = baseTheme === 'dark' ? darkTheme : defaultTheme;
  const variables = Object.assign({}, theme, extendWith);
  return build(variables);
};

const getContrastInk = (color: string) => {
  return colourIsLight(color) ? '#0f172a' : '#ffffff';
};

export default createTheme;
