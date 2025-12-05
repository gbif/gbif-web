import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter as Router, Route } from "react-router-dom";
import { QueryParamProvider } from 'use-query-params';
import EventSearch from './EventSearch';
import AddressBar from '../../StorybookAddressBar';
import Standalone from './Standalone';

export default {
  title: 'Search/ALA/EventSearch',
  component: EventSearch
};


const labels = {
  taxonKey: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `//namematching-ws-test.ala.org.au/api/getByTaxonID?taxonID=${encodeURIComponent(id)}`,
    transform: result => ({ title: result.scientificName })
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
          count: 'filters.elevation.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.elevation.name',// translation path to a title for the popover and the button
          description: 'filters.elevation.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Elevation range or single value'
      }
    }
  }
}


const config = {
  labels,
  getSuggests,
  filters,
  // rootFilter: {
  //   "type": "join",
  //   "key": "occurrence",
  //   "predicate": {
  //     "type": "and",
  //     "predicates": [
  //       {
  //         "type": "equals",
  //         "key": "family",
  //         "value": "Dinolestidae"
  //       }
  //     ]
  //   }
  // }
  // rootFilter: {
  //   type: 'equals', 
  //   key: 'family',
  //   value: 'Dinolestidae'
  // },
  // rootFilter: {countriesOfResearcher: ['MX']},
  // availableCatalogues: ['OCCURRENCE', 'LITERATURE'],
};

export const Example = () => <Router initialEntries={[`/event/search`]}>
  <QueryParamProvider ReactRouterRoute={Route}>
    <AddressBar />
    <EventSearch pageLayout config={config} style={{ margin: 'auto', height: 'calc(100vh - 60px)' }} />
  </QueryParamProvider>
</Router>


Example.story = {
  name: 'Event search',
};

export const StandaloneExample = () => <Standalone 
  siteConfig={{
    overwrites: {
      fn: {
        filteredEventDatasetDownload: context => {
          alert(`Dave you could do the download here perhaps? ${JSON.stringify(context, null, 2)}`)
        }
      }
    },
    routes: {
      eventSearch: {
        route: '/'
      }
    },
    event: {
      labels
    }
  }} 
  style={{ height: 'calc(100vh - 50px)' }}></Standalone>;