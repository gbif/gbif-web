import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter as Router, Route } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import { QueryParamProvider } from 'use-query-params';

import PublisherSearch from './PublisherSearch';
import Standalone from './Standalone';

export default {
  title: 'Search/PublisherSearch',
  component: PublisherSearch
};


// const labels = {
//   q: {
//     type: 'TRANSFORM',
//     transform: ({ id, locale }) => `"text: ${id}"`
//   },
// }

// function getSuggests({ client, suggestStyle }) {
//   return {
//     taxonKey: {
//       //What placeholder to show
//       placeholder: 'Search by scientific name',
//       // how to get the list of suggestion data
//       getSuggestions: ({ q }) => {
//         const { promise, cancel } = client.v1Get(`/species/suggest?datasetKey=${BACKBONE_KEY}&ranklimit=30&q=${q}`);
//         return {
//           cancel,
//           promise: promise.then(response => {
//             if (response.status === 200) {
//               response.data = response.data.filter(x => [4,5,7].indexOf(x.kingdomKey) > -1).slice(0,8);
//             }
//             return response;
//           })
//         }
//       },
//       // how to map the results to a single string value
//       getValue: suggestion => suggestion.scientificName,
//       // how to display the individual suggestions in the list
//       render: function ScientificNameSuggestItem(suggestion) {
//         return <div style={{ maxWidth: '100%' }}>
//           <div style={suggestStyle}>
//             {suggestion.scientificName}
//           </div>
//           {/* <div style={{ color: '#aaa', fontSize: '0.85em' }}>
//             <Classification taxon={suggestion} />
//           </div> */}
//         </div>
//       }
//     }
//   };
// }

const filters = {
  elevation: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'elevation',
        id2labelHandle: 'elevation',
        translations: {
          count: 'filter.elevation.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.elevation.name',// translation path to a title for the popover and the button
          description: 'filter.elevation.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Custom elevation range or single value'
      }
    }
  }
}


const config = { filters };
// const config = { filters, rootFilter: {networkKey: '99d66b6c-9087-452f-a9d4-f15f2c2d0e7e'} };
// const config = { labels, filters, rootFilter: {networkKey: '99d66b6c-9087-452f-a9d4-f15f2c2d0e7e'} };

export const Example = () => <Router initialEntries={[`/publisher/search`]}>
  <QueryParamProvider ReactRouterRoute={Route}>
    <AddressBar />
    <PublisherSearch pageLayout config={config} style={{ margin: 'auto', height: 'calc(100vh - 40px)' }} />
  </QueryParamProvider>
</Router>

Example.story = {
  name: 'Publisher search',
};

export const StandaloneExample = () => <Standalone siteConfig={{
  routes: {
    publisherSearch: {
      route: '/',
    }
  }
}} style={{height: 'calc(100vh - 40px)'}}></Standalone>;