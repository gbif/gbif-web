import { Global, css } from '@emotion/react'
import React from 'react';
import themeVariables from './light';
import themeBuilder from '../themeBuilder';

const theme = themeBuilder.build(themeVariables);

// A context to share state for the full app/component
const ThemeContext = React.createContext(theme);
export default ThemeContext;

export function ThemeProvider({ children, theme }) {
  return (
    <ThemeContext.Provider value={theme}>
      <Global
        styles={css`
          :root {
            ${theme.cssVariables}
          }
        `}
      />
      {children}
    </ThemeContext.Provider>
  );
}