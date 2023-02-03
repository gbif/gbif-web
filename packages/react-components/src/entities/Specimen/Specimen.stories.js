import React from 'react';
import { text } from '@storybook/addon-knobs';
import { Specimen } from './Specimen';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import AddressBar from '../../StorybookAddressBar';
import Standalone from './Standalone';
import { QueryParamProvider } from 'use-query-params';

export default {
  title: 'Entities/ALA/Specimen page',
  component: Specimen,
};

const siteConfig = {
  specimen: {
    rootFilter: {
      type: 'in',
      key: 'datasetKey',
      values: ['dr18527'],
    },
  },
};

export const Example = () => (
  <Router initialEntries={['/']}>
    <QueryParamProvider ReactRouterRoute={Route}>
      <AddressBar />
      <div style={{ flex: '1 1 auto' }}></div>
      <Specimen
        id={text('catalogNumber', 'CANB 866289.4')}
        config={siteConfig?.specimen}
      />
    </QueryParamProvider>
  </Router>
);

Example.story = {
  name: 'Specimen page',
};

export const StandaloneExample = () => (
  <Standalone
    siteConfig={{
      messages: {
        'counts.nOccurrences':
          '{total, plural, one {# specimen} other {# specimens}}',
      },
    }}
    id={text('catalogNumber', 'CANB 866289.4')}
  ></Standalone>
);
