import React from 'react';
import { addDecorator } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import flatten from 'flat';

import { IntlProvider } from "react-intl";

import Root from '../src/Root';
import gbifTheme from './theme';
import { en as enNested } from '../src/locales/en';
const en = flatten(enNested);

import ThemeContext, { darkTheme, lightTheme, a11yTheme } from '../src/style/themes';
import { ApiContext, ApiClient } from '../src/dataManagement/api';
import env from './.env.json';

const client = new ApiClient({
  gql: {
    endpoint: env.GRAPH_API,
    headers: {
      authorization: `ApiKey-v1 ${env.GRAPHQL_APIKEY}`
    }
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
      <ApiContext.Provider value={client}>
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
              {storyFn()}
            </Root>
          </ThemeContext.Provider>
        </IntlProvider>
      </ApiContext.Provider>
    </div>
  )
})