import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter as Router, Route } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import DatasetSearch from './DatasetSearch';
import Standalone from './Standalone';
import { QueryParamProvider } from 'use-query-params';

export default {
  title: 'Search/DatasetSearch',
  component: DatasetSearch
};


const labels = {
  elevation: {
    type: 'NUMBER_RANGE',
    path: 'interval.elevation'
  },
}

function getSuggests({ client, suggestStyle }) {
  return {
    // taxonKey: {
    //   //What placeholder to show
    //   placeholder: 'Search by scientific name',
    //   // how to get the list of suggestion data
    //   getSuggestions: ({ q }) => {
    //     const { promise, cancel } = client.v1Get(`/species/suggest?datasetKey=${BACKBONE_KEY}&ranklimit=30&q=${q}`);
    //     return {
    //       cancel,
    //       promise: promise.then(response => {
    //         if (response.status === 200) {
    //           response.data = response.data.filter(x => [4,5,7].indexOf(x.kingdomKey) > -1).slice(0,8);
    //         }
    //         return response;
    //       })
    //     }
    //   },
    //   // how to map the results to a single string value
    //   getValue: suggestion => suggestion.scientificName,
    //   // how to display the individual suggestions in the list
    //   render: function ScientificNameSuggestItem(suggestion) {
    //     return <div style={{ maxWidth: '100%' }}>
    //       <div style={suggestStyle}>
    //         {suggestion.scientificName}
    //       </div>
    //       {/* <div style={{ color: '#aaa', fontSize: '0.85em' }}>
    //         <Classification taxon={suggestion} />
    //       </div> */}
    //     </div>
    //   }
    // }
  };
}

const filters = {
  elevation: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'elevation',
        id2labelHandle: 'elevation',
        translations: {
          count: 'filter.elevation.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.elevation.name',// translation path to a title for the popover and the button
          description: 'filter.elevation.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Elevation range or single value'
      }
    }
  }
}


// const config = { labels, getSuggests, filters, rootFilter: {endorsingNodeKey: '4f829580-180d-46a9-9c87-ed8ec959b545'} };
const config = { labels, getSuggests, filters, availableCatalogues: ['DATASET', 'OCCURRENCE'] };

export const Example = () => <Router initialEntries={[`/dataset/search`]}>
  <QueryParamProvider ReactRouterRoute={Route}>
    <AddressBar />
    <DatasetSearch pageLayout config={config} style={{ margin: 'auto', height: 'calc(100vh - 50px)' }} />
  </QueryParamProvider>
</Router>


Example.story = {
  name: 'Dataset search',
};

export const StandaloneExample = () => <Standalone siteConfig={{
  routes: {
    datasetSearch: {
      route: '/',
      url: ({key}) => `https://www.gbif.org/dataset/${key}`
    }
  },
  dataset: {
    availableCatalogues: ['DATASET', 'OCCURRENCE', 'LITERATURE', 'COLLECTION']
  }
}} style={{ height: 'calc(100vh - 20px)' }}></Standalone>;