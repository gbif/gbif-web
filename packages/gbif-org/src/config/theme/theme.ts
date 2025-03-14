export interface Theme {
  dense: boolean;
  primary: string;
  fontSize: string;
  background: string;
  paperBackground: string;
  paperBorderColor: string;
  color: string;
  isDarkTheme: boolean;
  fontFamily?: string;
  headerFontFamily?: string;
  drawerZIndex: number;
  stickyOffset: string;
  borderRadius: number;
  // computed properties, but you can overwrite them
  borderRadiusPx: string;
  primary50: string;
  primary100: string;
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;
  primary600: string;
  primary700: string;
  primary800: string;
  primary900: string;
  primary950: string;
  primaryContrast50: string;
  primaryContrast100: string;
  primaryContrast200: string;
  primaryContrast300: string;
  primaryContrast400: string;
  primaryContrast500: string;
  primaryContrast600: string;
  primaryContrast700: string;
  primaryContrast800: string;
  primaryContrast900: string;
  primaryContrast950: string;
  transparentInk10: string;
  transparentInk20: string;
  transparentInk30: string;
  transparentInk40: string;
  transparentInk50: string;
  transparentInk60: string;
  transparentInk70: string;
  transparentInk80: string;
  color900: string;
  color800: string;
  color700: string;
  color600: string;
  color500: string;
  color400: string;
  color300: string;
  color200: string;
  color100: string;
  linkColor: string;
  paperBackground500: string;
  paperBackground400: string;
  paperBackground300: string;
  paperBackground200: string;
  paperBackground100: string;
  paperBackground600: string;
  paperBackground700: string;
  paperBackground800: string;
  paperBackground900: string;
  darkPaperBackground: string;
  paperBackgroundElevated: string;
  mapDensityColors: string[];
  // _cssVariables: { [key: string]: any };
}
