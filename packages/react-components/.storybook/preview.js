import React from 'react';
import { addDecorator } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import flatten from 'flat';

import { LocaleProvider } from "../src/dataManagement/LocaleProvider";

import { Root } from '../src/components';

import ThemeContext, { darkTheme, lightTheme, a11yTheme, vertnetTheme, rtlTheme, gbifTheme } from '../src/style/themes';
import ThemeBuilder from '../src/style/themeBuilder';
import { ApiContext, ApiClient } from '../src/dataManagement/api';
import env from '../.env.json';
import RouteContext from '../src/dataManagement/RouteContext';
import SiteContext from '../src/dataManagement/SiteContext';
import { siteConfig } from './siteConfig';

const availableLocales = env.LOCALES || ['en-developer'];
const locales = availableLocales.map(x => {
  if (x === 'en-developer') return 'en-DK';
  if (x === 'en-pseudo') return 'en-ZZ';
  return x;
});

const customTheme = ThemeBuilder.extend({
  extendWith: {
    fontSize: '14px',
    primary: '#2a7db1'
  }
});

const client = new ApiClient({
  gql: {
    endpoint: env.GRAPH_API
  },
  v1: {
    endpoint: env.API_V1
  },
  translations: {
    endpoint: env.TRANSLATIONS
  }
});

addDecorator(storyFn => {
  const themeObjects = {
    dark: darkTheme,
    light: lightTheme,
    a11y: a11yTheme,
    vertnet: vertnetTheme,
    rtl: rtlTheme,
    gbif: gbifTheme,
    custom: customTheme
  }

  const chooseTheme = choice => {
    const _theme = themeObjects[choice.toLowerCase()]
    return _theme
  }

  const chooseRtl = choice => {
    return choice
  }

  const chooseLocale = choice => {
    return choice
  }

  return (
    <div>
      <SiteContext.Provider value={siteConfig}>
        <ApiContext.Provider value={client}>
          <LocaleProvider locale={chooseLocale(
            select(
              'Choose locale',
              locales,
              env.STORYBOOK_LOCALE || locales[0],
            ),
          )} >
            <ThemeContext.Provider
              value={chooseTheme(
                select(
                  'Choose Theme',
                  ['Dark', 'Light', 'A11y', 'Vertnet', 'RTL', 'GBIF', 'Custom'],
                  'Light',
                ),
              )}
            >
              <Root id="application" appRoot style={{padding: 0}} dir={chooseRtl(
                select(
                  'Choose Direction',
                  ['ltr', 'rtl'],
                  'ltr',
                ),
              )}>
                <RouteContext.Provider value={siteConfig.routeConfig}>
                  {storyFn()}
                </RouteContext.Provider>
              </Root>
            </ThemeContext.Provider>
          </LocaleProvider>
        </ApiContext.Provider>
      </SiteContext.Provider>
    </div>
  )
})