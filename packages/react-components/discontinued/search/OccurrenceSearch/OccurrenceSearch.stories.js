import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter as Router, Route } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import { QueryParamProvider } from 'use-query-params';
import env from '../../../.env.json';
import OccurrenceSearch from './OccurrenceSearch';
import Standalone from './Standalone';
// const BACKBONE_KEY = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';

export default {
  title: 'Search/OccurrenceSearch',
  component: OccurrenceSearch
};


const labels = {
  // elevation: {
  //   type: 'NUMBER_RANGE',
  //   path: 'interval.compact'
  // },
}

function getSuggests({ client, suggestStyle }) {
  return {
    // gadmGid: {
    //   getSuggestions: ({ q }) => {
    //     const { promise, cancel } = client.v1Get(`/geocode/gadm/search?gadmGid=DEU&limit=100&q=${q}`); // this gadmGid=DEU is the new part, that means that the suggester will now only suggest things in Germany
    //     return {
    //       promise: promise.then(response => {
    //         return {
    //           data: response.data.results.map(x => ({ title: x.name, key: x.id, ...x }))
    //         }
    //       }),
    //       cancel
    //     }
    //   }
    // },
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
    // taxonKey: {
    //   //What placeholder to show
    //   // placeholder: 'Search by scientific name',
    //   placeholder: 'search.placeholders.default',
    //   // how to get the list of suggestion data
    //   getSuggestions: ({ q }) => {
    //     // const { promise, cancel } = client.v1Get(`/species/suggest?datasetKey=${BACKBONE_KEY}&limit=30&q=${q}`);
    //     const { promise, cancel } = client.v1Get(`/species/suggest?datasetKey=0b1735ff-6a66-454b-8686-cae1cbc732a2&limit=30&q=${q}`);
    //     return {
    //       cancel,
    //       promise,
    //       // promise: promise.then(response => {
    //       //   if (response.status === 200) {
    //       //     response.data = response.data.filter(x => [4,5,7].indexOf(x.kingdomKey) > -1).slice(0,8);
    //       //   }
    //       //   return response;
    //       // })
    //     }
    //   },
    //   // how to map the results to a single string value
    //   getValue: suggestion => suggestion.scientificName,
    //   // how to display the individual suggestions in the list
    //   render: function ScientificNameSuggestItem(suggestion) {
    //     const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].map((rank, i) => {
    //       return suggestion[rank] && rank !== suggestion.rank.toLowerCase() ? <span key={rank}>{suggestion[rank]}</span> : null;
    //     });

    //     return <div style={{ maxWidth: '100%' }}>
    //       <div style={suggestStyle}>
    //         {suggestion.scientificName}
    //       </div>
    //       <div style={{ color: '#aaa', fontSize: '0.85em' }}>
    //       </div>
    //     </div>
    //   }
    // },
  };
}

const filters = {
    datasetKey: {
      merge: true,
      config: {
        specific: {
          supportsNegation: false
        }
      }
    },
    taxonKey: {
      merge: true,
      config: {
        specific: {
          supportsNegation: true
        }
      }
    }

  // elevation: {
  //   type: 'NUMBER_RANGE',
  //   config: {
  //     std: {
  //       filterHandle: 'elevation',
  //       id2labelHandle: 'elevation',
  //       translations: {
  //         count: 'filter.elevation.count', // translation path to display names with counts. e.g. "3 scientific names"
  //         name: 'filter.elevation.name',// translation path to a title for the popover and the button
  //         description: 'filter.elevation.description', // translation path for the filter description
  //       }
  //     },
  //     specific: {
  //       placeholder: 'Elevation range or single value'
  //     }
  //   }
  // },
  // basisOfRecord: {
  //   type: 'ENUM',
  //   config: {
  //     std: {
  //       filterHandle: 'basisOfRecord',
  //       id2labelHandle: 'basisOfRecord',
  //       translations: {
  //         count: 'filter.basisOfRecord.count', // translation path to display names with counts. e.g. "3 scientific names"
  //         name: 'My custom subset of bor',// translation path to a title for the popover and the button
  //       }
  //     },
  //     specific: {
  //       supportsExist: false,
  //       options: ['MATERIAL_SAMPLE', 'LIVING_SPECIMEN'],
  //       description: 'filter.basisOfRecord.description', // translation path for the filter description
  //     }
  //   }
  // },
}

const rootPredicate = {
  "type": "equals",
  "key": "country",
  "value": "VE"
};
const config = { 
  // rootPredicate, 
  // rootPredicate: {
  //   type: 'equals',
  //   key: 'datasetKey',
  //   value: '7e380070-f762-11e1-a439-00145eb45e9a'
  // }, 
  labels, 
  getSuggests, 
  filters, 
  occurrenceSearchTabs: ['TABLE', 'MAP', 'DASHBOARD', 'CLUSTERS', 'DATASETS', 'GALLERY'],
  // highlightedFilters: ['establishmentMeans'],
  // excludedFilters: ['locality'],
  availableCatalogues: ['OCCURRENCE', 'LITERATURE', 'COLLECTION'],
  // defaultTableColumns: ['recordedBy', 'collectionKey', 'locality', 'year', 'country'],
  // mapSettings: {
  //   zoom: 10.290782035199692,
  //   lng: 4.378666162934309,
  //   lat: 50.83439252440547
  // },
  // excludedFilters: ['occurrenceStatus', 'networkKey', 'hostingOrganizationKey', 'protocol', 'publishingCountryCode', 'institutionCode', 'collectionCode'],
  highlightedFilters: ['datasetKey', 'taxonKey', 'institutionKey', 'collectionKey', 'catalogNumber', 'recordedBy', 'identifiedBy'],
  defaultTableColumns: ['features', 'institutionKey', 'collectionKey', 'catalogNumber', 'country', 'year', 'recordedBy', 'identifiedBy'],
};
// const config = { labels, getSuggests, filters, rootPredicate: {type: 'equals', key: 'publishingOrganizationKey', value: '1cd669d0-80ea-11de-a9d0-f1765f95f18b'}};
// const config = { labels, getSuggests, filters, rootPredicate: {type: 'in', key: 'datasetKey', values: inboDatasets}};

export const Example = () => <Router initialEntries={[`/occurrence/search`]}>
{/* export const Example = () => <Router initialEntries={[`/?filter=eyJtdXN0Ijp7Im9jY3VycmVuY2VJZCI6WyJlIl19LCJtdXN0X25vdCI6eyJvY2N1cnJlbmNlSXNzdWUiOlsiWkVST19DT09SRElOQVRFIl0sIm9jY3VycmVuY2VJZCI6WyIxIiwiMiJdfX0%3D`]}> */}
  <QueryParamProvider ReactRouterRoute={Route} stringifyOptions={{strict: false}}>
    <AddressBar />
    <OccurrenceSearch pageLayout config={config} style={{ margin: 'auto', minHeight: 'calc(100vh - 50px)' }}></OccurrenceSearch>
  </QueryParamProvider>
</Router>;

Example.story = {
  name: 'OccurrenceSearch',
};

export const StandaloneExample = () => <Standalone siteConfig={{
  routes: {
    occurrenceSearch: {
      route: '/',
    }
  },
  occurrence: {
    occurrenceSearchTabs: ['DASHBOARD', 'TABLE', 'MAP', 'DATASETS', 'GALLERY'],
    mapSettings: {
      userLocationEnabled: true,
    },
    rootPredicate
  },
  availableCatalogues: ['INSTITUTION', 'COLLECTION', 'OCCURRENCE', 'DATASET'],
}} style={{ minHeight: 'calc(100vh - 40px)' }}></Standalone>;