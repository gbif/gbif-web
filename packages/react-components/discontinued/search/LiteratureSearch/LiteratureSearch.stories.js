import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter as Router, Route } from "react-router-dom";
import { QueryParamProvider } from 'use-query-params';
import LiteratureSearch from './LiteratureSearch';
import AddressBar from '../../StorybookAddressBar';
import Standalone from './Standalone';

export default {
  title: 'Search/LiteratureSearch',
  component: LiteratureSearch
};


const labels = {
  elevation: {
    type: 'NUMBER_RANGE',
    path: 'interval.elevation'
  },
}

// create a custom suggest
function getSuggests({ client, suggestStyle }) {
  return {
    vceDatasetSuggest: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => client.v1Get(`/dataset/suggest?publishingOrg=b6d09100-919d-4026-b35b-22be3dae7156&limit=8&q=${q}`),
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function DatasetSuggestItem(suggestion) {
        return suggestion.title;
      }
    },
  };
}

// overwrite the default dataset filter to use the custom suggest
const filters = {
  vceDatasetFilter: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'datasetKey',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'datasetKey',
        translations: {
          count: 'filters.datasetKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.datasetKey.name',// translation path to a title for the popover and the button
          description: 'filters.datasetKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'vceDatasetSuggest',
        allowEmptyQueries: true
      }
    }
  }
}


const config = {
  labels,
  getSuggests,
  filters,
  // includedFilters: ['vceDatasetFilter'],
  // highlightedFilters: ['vceDatasetFilter'],
  // rootFilter: {predicate: {type: 'or', predicates: [
  //   {
  //     type: 'in', 
  //     key: 'countriesOfResearcher',
  //     values: ['US', 'UM', 'AS', 'FM', 'GU', 'MH', 'MP', 'PR', 'PW', 'VI']
  //   },
  //   {
  //     type: 'in', 
  //     key: 'countriesOfCoverage',
  //     values: ['US', 'UM', 'AS', 'FM', 'GU', 'MH', 'MP', 'PR', 'PW', 'VI']
  //   }
  // ]}},
  // rootFilter: {countriesOfResearcher: ['MX']},
  availableCatalogues: ['OCCURRENCE', 'LITERATURE'],
};

export const Example = () => <Router initialEntries={[`/literature/search`]}>
  <QueryParamProvider ReactRouterRoute={Route}>
    <AddressBar />
    <LiteratureSearch pageLayout config={config} style={{ margin: 'auto', height: 'calc(100vh - 60px)' }} />
  </QueryParamProvider>
</Router>


Example.story = {
  name: 'Literature search',
};

export const StandaloneExample = () => <Standalone siteConfig={{
  routes: {
    literatureSearch: {
      route: '/',
    }
  },
}} style={{ height: 'calc(100vh - 50px)' }}></Standalone>;