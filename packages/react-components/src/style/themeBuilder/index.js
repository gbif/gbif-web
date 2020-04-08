import { shadeHexColor } from './utils';

const defaultTheme = {};

const themeBuilder =  theme => {
  const fullTheme = Object.assign({}, defaultTheme, theme);
  fullTheme.colors.primary500 = theme.colors.primary;
  fullTheme.colors.primary600 = shadeHexColor(fullTheme.colors.primary500, -0.05);
  fullTheme.colors.primary700 = shadeHexColor(fullTheme.colors.primary500, -0.1);
  fullTheme.transparentInk40 = `${fullTheme.color}40`;
  fullTheme.transparentInk60 = `${fullTheme.color}60`;
  fullTheme.transparentInk20 = `${fullTheme.color}20`;
  fullTheme.transparentInk80 = `${fullTheme.color}80`;
  fullTheme.transparentInk50 = `${fullTheme.color}50`;

  return fullTheme;
}

export default themeBuilder;