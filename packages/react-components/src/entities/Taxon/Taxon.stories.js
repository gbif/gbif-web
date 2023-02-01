import React from 'react';
import { text } from '@storybook/addon-knobs';
import { Taxon } from './Taxon';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import AddressBar from '../../StorybookAddressBar';
import Standalone from './Standalone';
import { QueryParamProvider } from 'use-query-params';

export default {
  title: 'Entities/ALA/Taxon page',
  component: Taxon,
};

const siteConfig = {
  messages: {
    'search.tabs.datasets': 'Dataset Information',
    'search.tabs.events': 'Accessions/Trials',
    'filters.eventID.name': 'Event ID',
    'filters.taxonRank.name': 'Rank',
  },
  taxon: {
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
      <Taxon
        id={text(
          'taxonUUID',
          'https://id.biodiversity.org.au/taxon/apni/51286863'
        )}
        config={siteConfig?.taxon}
      />
    </QueryParamProvider>
  </Router>
);

Example.story = {
  name: 'Taxon page',
};

export const StandaloneExample = () => (
  <Standalone
    siteConfig={{
      messages: {
        'counts.nOccurrences':
          '{total, plural, one {# specimen} other {# specimens}}',
      },
    }}
    id={text('taxonUUID', 'https://id.biodiversity.org.au/taxon/apni/51286863')}
  ></Standalone>
);
