import React from 'react';
import { addDecorator } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import flatten from 'flat';

import { IntlProvider } from "react-intl";

import { Root } from '../src/components';
import gbifTheme from './theme';
import { en as enNested } from '../src/locales/en';
const en = flatten(enNested);

import ThemeContext, { darkTheme, lightTheme, a11yTheme, vertnetTheme, rtlTheme } from '../src/style/themes';
import ThemeBuilder from '../src/style/themeBuilder';
import { ApiContext, ApiClient } from '../src/dataManagement/api';
import env from '../.env.json';
import RouteContext from '../src/dataManagement/RouteContext';

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
  }
});

addDecorator(storyFn => {
  const themeObjects = {
    dark: darkTheme,
    light: lightTheme,
    a11y: a11yTheme,
    vertnet: vertnetTheme,
    rtl: rtlTheme,
    custom: customTheme
  }

  const chooseTheme = choice => {
    const _theme = themeObjects[choice.toLowerCase()]
    return _theme
  }

  const chooseRtl = choice => {
    return choice
  }

  const routes = {
    collectionKey: {
      route: '/',
      url: ({key}) => {
        return `/iframe.html?id=entities-collection-page--example&viewMode=story`;
      }
    },
    collectionSearch: {
      url: () => `/collection/`
    },
    collectionSpecimens: {
      url: ({key}) => `/collection/${key}/specimens`
    },
  
    institutionKey: {
      url: ({key}) => `/institution/${key}`
    },
    collectionSearch: {
      url: () => `/institution/`
    },
  };

  return (
    <div>
      <ApiContext.Provider value={client}>
        <IntlProvider locale="en" messages={en}>
          <ThemeContext.Provider
            value={chooseTheme(
              select(
                'Choose Theme',
                ['Dark', 'Light', 'A11y', 'Vertnet', 'RTL', 'Custom'],
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
              <RouteContext.Provider value={routes}>
                {storyFn()}
              </RouteContext.Provider>
            </Root>
          </ThemeContext.Provider>
        </IntlProvider>
      </ApiContext.Provider>
    </div>
  )
})