import React from 'react';
import { addDecorator } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import flatten from 'flat';

import { LocaleProvider } from "../src/dataManagement/LocaleProvider";

import { Root } from '../src/components';
import gbifTheme from './theme';
import en from '../locales/_build/en.json';

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
    custom: customTheme
  }

  const chooseTheme = choice => {
    const _theme = themeObjects[choice.toLowerCase()]
    return _theme
  }

  const chooseRtl = choice => {
    return choice
  }

  const gbifOrg = 'https://www.gbif.org';

  const routes = {
    occurrenceSearch: {
      url: ({queryString}) => `/occurrence/search${queryString ? `?${queryString}` : ''}`,
      route: '/',
    },
    collectionKey: {
      route: '/',
      isHref: true,
      url: ({key}) => {
        return `/iframe.html?id=entities-collection-page--example&viewMode=story&knob-collectionUUID=${key}`;
      }
    },
    collectionSearch: {
      url: () => `/collection/`
    },
    collectionSpecimens: {
      url: ({key}) => `/collection/${key}/specimens`
    },
  
    institutionKey: {
      isHref: true,
      url: ({key}) => {
        return `/iframe.html?id=entities-institution-page--example&viewMode=story&knob-institutionUUID=${key}`;
      }
    },
    collectionSearch: {
      url: () => `/institution/`
    },

    datasetKey: {
      isHref: true,
      url: ({key}) => {
        return `/iframe.html?id=entities-dataset-page--example&viewMode=story&knob-datasetUUID=${key}`;
      },
      route: '/'
    },
    datasetSearch: {
      url: () => `/dataset-search/`
    },

    publisherKey: {
      isHref: true,
      url: ({key}) => {
        // return `/iframe.html?id=entities-publisher-page--example&viewMode=story&knob-publisherUUID=${key}`;
        return `https://www.gbif.org/publisher/${key}`;
      },
      route: '/publisher/:key'
    },
    publisherSearch: {
      url: () => `/publisher-search/`
    },
  };

  return (
    <div>
      <ApiContext.Provider value={client}>
        <LocaleProvider locale="en" >
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
        </LocaleProvider>
      </ApiContext.Provider>
    </div>
  )
})