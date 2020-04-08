import darkVariables from './dark';
import lightVariables from './light';
import a11yVariables from './a11y';
import themeBuilder from '../themeBuilder/index';

export { default } from './ThemeContext';

export const darkTheme = themeBuilder(darkVariables);
export const lightTheme = themeBuilder(lightVariables);
export const a11yTheme = themeBuilder(a11yVariables);

