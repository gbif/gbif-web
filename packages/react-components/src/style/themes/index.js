import darkVariables from './dark';
import lightVariables from './light';
import a11yVariables from './a11y';
import vertnetVariables from './vertnet';
import rtlVariables from './rtl';
import themeBuilder from '../themeBuilder/index';

export { default } from './ThemeContext';

export const darkTheme = themeBuilder.build(darkVariables);
export const lightTheme = themeBuilder.build(lightVariables);
export const a11yTheme = themeBuilder.build(a11yVariables);
export const vertnetTheme = themeBuilder.build(vertnetVariables);
export const rtlTheme = themeBuilder.build(rtlVariables);

