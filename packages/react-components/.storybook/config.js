import React from 'react'
import { configure, addParameters, addDecorator } from '@storybook/react';
// Storybook Addon Dependencies
import { withKnobs, select } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { IntlProvider } from "react-intl";

import gbifTheme from './theme';
import { en } from '../src/locales/en';
import Root from '../src/Root';
import ThemeContext, { darkTheme, lightTheme, a11yTheme } from '../src/style/themes';

// Setup Addons
//custom for changing emotion theme
addDecorator(story => {
  const themeObjects = {
    dark: darkTheme,
    light: lightTheme,
    a11y: a11yTheme,
  }

  const chooseTheme = choice => {
    const _theme = themeObjects[choice.toLowerCase()]
    return _theme
  }

  const chooseRtl = choice => {
    return choice
  }

  return (
    <div>
      <IntlProvider locale="en" messages={en}>
        <ThemeContext.Provider
          value={chooseTheme(
            select(
              'Choose Theme',
              ['Dark', 'Light', 'A11y'],
              'Light',
            ),
          )}
        >
          <Root id="application" style={{ padding: 0 }} dir={chooseRtl(
            select(
              'Choose Direction',
              ['ltr', 'rtl'],
              'ltr',
            ),
          )}>
            {story()}
          </Root>
        </ThemeContext.Provider>
      </IntlProvider>
    </div>
  )
})

addDecorator(withKnobs);
addDecorator(withA11y);

// // Setup Storybook options
addParameters({ options: { theme: gbifTheme } });
addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

configure([
  require.context('../intro', true, /\.stories\.js$/),
  require.context('../src', true, /\.stories\.js$/),
], module);
