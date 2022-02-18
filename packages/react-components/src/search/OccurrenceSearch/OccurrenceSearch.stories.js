import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter as Router, Route } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import { QueryParamProvider } from 'use-query-params';

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
  "value": "DK"
};
const config = { 
  // rootPredicate, 
  labels, 
  getSuggests, 
  filters, 
  occurrenceSearchTabs: ['MAP', 'GALLERY', 'TABLE', 'DATASETS'],
  // highlightedFilters: ['establishmentMeans'],
  availableCatalogues: ['OCCURRENCE', 'LITERATURE', 'COLLECTION'],
  // defaultTableColumns: ['year', 'country']
  // mapSettings: {
  //   zoom: 10.290782035199692,
  //   lng: 4.378666162934309,
  //   lat: 50.83439252440547
  // }
};
// const config = { labels, getSuggests, filters, rootPredicate: {type: 'equals', key: 'publishingOrganizationKey', value: '1cd669d0-80ea-11de-a9d0-f1765f95f18b'}};

// const inboDatasets = ["e7cbb0ed-04c6-44ce-ac86-ebe49f4efb28","83e20573-f7dd-4852-9159-21566e1e691e","271c444f-f8d8-4986-b748-e7367755c0c1","bfc6fe18-77c7-4ede-a555-9207d60d1d86","1f968e89-ca96-4065-91a5-4858e736b5aa","39f36f10-559b-427f-8c86-2d28afff68ca","7888f666-f59e-4534-8478-3a10a3bfee45","7f9eb622-c036-44c6-8be9-5793eaa1fa1e","9a0b66df-7535-4f28-9f4e-5bc11b8b096c","3f5e930b-52a5-461d-87ec-26ecd66f14a3","823dc56e-f987-495c-98bf-43318719e30f","81c5a091-6e94-40db-a2a4-48f4de42d410","7f5e4129-0717-428e-876a-464fbd5d9a47","2fc1d8b5-9c99-4e03-8c3c-11a6e51a298f","5ca32e22-1f1b-4478-ba7f-1916c4e88d67","71cfd412-6327-4ec7-8035-d8b2d0509ac5","6d9e952f-948c-4483-9807-575348147c7e","fc18b0b1-8777-4c8a-8cb8-f9f15870d6a9","8ae09016-b819-450e-b8f6-c1f249110502","2fc23906-38f3-4bb6-a4a4-4dad908602a2","958b1d2f-2d11-4e94-a828-c8e2d2c013ca","b7ee2a4d-8e10-410f-a951-a7f032678ffe","37e094f3-dcf2-469f-93a2-c4b9b5fa7275","42319b8f-9b9d-448d-969f-656792a69176","b2906713-07c4-41b1-887f-adfc0a24b3ab","274a36be-0626-41c1-a757-3064e05811a4","76cc7230-76b6-4763-9caf-22626b29c0a6","1f3505cd-5d98-4e23-bd3b-ffe59d05d7c2","702973cf-6935-45bf-ba31-cecee3571cf9","f9af6ffd-febc-4626-b2e8-809b1c60fa01","27e9e069-2862-4183-bcec-1e1a7f74d3e7","2b2bf993-fc91-4d29-ae0b-9940b97e3232","e1c3be64-2799-4342-8312-49d076993132","63938753-1fec-4c08-ae39-e9f8a6576521","1738f272-6b5d-4f43-9a92-453a8c5ea50a","e082b10e-476f-43c1-aa61-f8d92f33029a","8124cd73-ac84-43d2-ab39-1d80dc346525","5d637678-cb64-4863-a12b-78b4e1a56628","b2d0f29e-4614-4001-93c8-f651878a86d2","ea95fd9b-58dc-4e48-b51f-9380e9804607","3d1231e8-2554-45e6-b354-e590c56ce9a8","289244ee-e1c1-49aa-b2d7-d379391ce265","258c9ce5-1bda-4001-a192-347c9e7fb186","66178162-01dc-4133-9b3c-83265481c383","f4230399-51b8-4862-8991-93d6ba11406f","0ac24b3c-feb9-48d5-bf02-da4a103f024e","72aa797d-42a4-4176-9e19-5b3ddd551b79","f8de3f7e-0325-4a15-aab4-3412f428676e","bcbfd319-8813-4b6d-b529-07dc5a6ccf56","53b55f0b-eace-46da-b414-351f092e1223","45157d5f-7eb9-42b8-8d70-66482fdd912f","3c428404-893c-44da-bb4a-6c19d8fb676a","10b6b3f2-ce6e-47d8-bad1-a948349b7bef","53762f29-61a9-40a8-9f3c-06238cc59dd4","ab0b5afd-bef2-4313-ade5-2df7b7844271","d4bf0455-39d9-47a1-b0b7-becfc82e7f13","40e9743f-8db3-4732-8c85-c4ca96596409","3e2a280e-33ab-449d-a543-dc97e96a664b","9100f482-848c-42e7-bf7c-19947885ce48","98940a79-2bf1-46e6-afd6-ba2e85a26f9f","67fa6403-d5c3-401b-b35d-ec70538ea41d","64d7725a-4743-461a-ac17-956bffef577b","08a4ed1f-8586-4437-b3c9-95989eb40fd4","3dfbaea0-f5df-4978-b3a1-fb22edcde0de","fca6d6a7-c13d-4f6e-96e1-0513e30b816c","8854d25e-05f9-48f0-88da-7c413b24f535","7522721f-4d97-4984-8231-c9e061ef46df","e0bbc7b4-c22e-42b7-8c0c-2deb26495948","3c7768dd-8101-4318-8de3-f848878eeea0","5d06d34c-f74d-461e-8d8b-c3351beb0db8"];
// const config = { labels, getSuggests, filters, rootPredicate: {type: 'in', key: 'datasetKey', values: inboDatasets}};

export const Example = () => <Router initialEntries={[`/occurrence/search`]}>
{/* export const Example = () => <Router initialEntries={[`/?filter=eyJtdXN0Ijp7Im9jY3VycmVuY2VJZCI6WyJlIl19LCJtdXN0X25vdCI6eyJvY2N1cnJlbmNlSXNzdWUiOlsiWkVST19DT09SRElOQVRFIl0sIm9jY3VycmVuY2VJZCI6WyIxIiwiMiJdfX0%3D`]}> */}
  <QueryParamProvider ReactRouterRoute={Route} stringifyOptions={{strict: false}}>
    <AddressBar />
    <OccurrenceSearch pageLayout config={config} style={{ margin: 'auto', height: 'calc(100vh - 50px)' }}></OccurrenceSearch>
  </QueryParamProvider>
</Router>;

Example.story = {
  name: 'OccurrenceSearch',
};


export const StandaloneExample = () => <Standalone routerContext={{basename: 'la'}} locale="en" style={{height: 'calc(100vh - 20px)'}}></Standalone>;