import React from 'react';
import { addDecorator } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import { ToastContainer } from 'react-toast'

import { LocaleProvider } from "../src/dataManagement/LocaleProvider";

import { Root } from '../src/components';

import { darkTheme, lightTheme, a11yTheme, vertnetTheme, rtlTheme, alaTheme, gbifTheme, ThemeProvider } from '../src/style/themes';
import ThemeBuilder from '../src/style/themeBuilder';
import { ApiContext, ApiClient } from '../src/dataManagement/api';
import env from '../.env.json';
import RouteContext from '../src/dataManagement/RouteContext';
import SiteContext from '../src/dataManagement/SiteContext';
import { siteConfig } from './siteConfig';
import {GraphQLContextProvider} from "../src/dataManagement/api/GraphQLContext";

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
  esApi: {
    endpoint: env.ES_WEB_API
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
    ala: alaTheme,
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
          <GraphQLContextProvider value={{}}>
            <LocaleProvider
              locale={chooseLocale(
                select(
                  'Choose locale',
                  locales,
                  env.STORYBOOK_LOCALE || locales[0],
                ),
              )}>
              <ThemeProvider
                theme={chooseTheme(
                  select(
                    'Choose Theme',
                    ['Dark', 'Light', 'A11y', 'Vertnet', 'RTL', 'GBIF', 'ALA', 'Custom'],
                    'Light',
                  ),
                )}
              >
                <Root id="application" appRoot style={{ padding: 0 }} dir={chooseRtl(
                  select(
                    'Choose Direction',
                    ['ltr', 'rtl'],
                    'ltr',
                  ),
                )}>
                  <RouteContext.Provider value={siteConfig.routes}>
                    {storyFn()}
                  </RouteContext.Provider>
                  <div style={{zIndex: 10000, position: 'fixed'}}>
                    <ToastContainer position="bottom-center" delay={3000} />
                  </div>
                </Root>
              </ThemeProvider>
            </LocaleProvider>
          </GraphQLContextProvider>
        </ApiContext.Provider>
      </SiteContext.Provider>
    </div>
  )
})