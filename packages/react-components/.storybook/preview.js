import React from 'react';
import { addDecorator } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import flatten from 'flat';

import { LocaleProvider } from "../src/dataManagement/LocaleProvider";

import { Root } from '../src/components';
import gbifTheme from './theme';

import ThemeContext, { darkTheme, lightTheme, a11yTheme, vertnetTheme, rtlTheme } from '../src/style/themes';
import ThemeBuilder from '../src/style/themeBuilder';
import { ApiContext, ApiClient } from '../src/dataManagement/api';
import env from '../.env.json';
import RouteContext from '../src/dataManagement/RouteContext';

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

  const gbifOrg = 'https://www.gbif.org';

  const routes = {
    occurrenceSearch: {
      url: ({queryString}) => {
        return `iframe.html?id=search-occurrencesearch--example&viewMode=story`;
      },
      isHref: true,
      route: '/occurrence/search',
    },
    
    collectionKey: {
      route: '/',
      isHref: true,
      url: ({key}) => {
        return `/iframe.html?id=entities-collection-page--example&viewMode=story&knob-collectionUUID=${key}`;
      }
    },
    collectionSearch: {
      // url: () => `/collection/`,
      url: ({queryString, basename}) => {
        return `/iframe.html?id=search-collectionsearch--example&viewMode=story`;
      },
      isHref: true,
      route: '/collection/search',
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
    institutionSearch: {
      // url: () => `/institution/`,
      url: ({queryString}) => {
        return `/iframe.html?id=search-institutionsearch--example&viewMode=story`;
      },
      isHref: true,
      route: '/institution/search',
    },

    datasetKey: {
      isHref: true,
      url: ({key}) => {
        return `/iframe.html?id=entities-dataset-page--example&viewMode=story&knob-datasetUUID=${key}`;
      },
      route: '/'
    },
    datasetSearch: {
      // url: () => `/dataset-search/`,
      url: ({queryString}) => {
        return `/iframe.html?id=search-datasetsearch--example&viewMode=story`;
        // return `/?path=/story/search-datasetsearch--example`;
      },
      isHref: true,
      route: '/dataset/search',
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
      // url: () => `/publisher-search/`,
      url: ({queryString}) => {
        return `/iframe.html?id=search-publishersearch--example&viewMode=story`;
      },
      isHref: true,
      route: '/publisher/search',
    },

    literatureSearch: {
      url: ({queryString}) => {
        return `iframe.html?id=search-literaturesearch--example&viewMode=story`;
      },
      isHref: true,
      route: '/literature/search',
    },
  };

  return (
    <div>
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