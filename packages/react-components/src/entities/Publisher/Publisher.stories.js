import React from 'react';
import { text } from '@storybook/addon-knobs';
import { Publisher } from './Publisher';
import { MemoryRouter as Router, Switch, Route } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import Standalone from './Standalone';
import { QueryParamProvider } from 'use-query-params';

export default {
  title: 'Entities/Publisher page',
  component: Publisher,
};


export const Example = () => <Router initialEntries={[`/`]}>
  <QueryParamProvider ReactRouterRoute={Route}>
    <AddressBar style={{ position: 'sticky', top: 0, zIndex: 1000 }} />
    <div style={{ flex: '1 1 auto' }}></div>
    {/* Crustacea */}
    {/* <Publisher id="1d1393bd-7edd-46fe-a224-ac8ff8e38402" /> */}

    {/* kew */}
    {/* <Publisher id="dceb8d52-094c-4c2c-8960-75e0097c6861" /> */}

    {/* NY botanical garden */}
    {/* <Publisher id="b2190553-4505-4fdd-8fff-065c8ca26f72" /> */}

    {/* Entomology from Harvard University, Museum of Comparative Zoology */}
    {/* <Publisher id="42844cb6-421e-4bcf-bdeb-c56039bee08c" /> */}

    {/* Gull */}
    <Publisher id={text('publisherUUID', 'a7b59f8e-ab56-4cc3-9f70-0f7fd89dd6f2')} />

    {/* Vascan */}
    {/* <Publisher id={text('publisherUUID', '3f8a1297-3259-4700-91fc-acc4170b27ce')} /> */}

    {/* <Switch>
      <Route
        path='/publisher/:key'
        render={routeProps => <Publisher id={routeProps.match.params.key} {...routeProps}/>}
      />
    </Switch> */}
  </QueryParamProvider>
</Router>;

Example.story = {
  name: 'Publisher page',
};

const siteConfig = {
  // locale: 'es',
  // messages: {
  //   'publisher.longType.OCCURRENCE': 'TEsT'
  // },
  occurrence: {
    rootPredicate: { type: 'equals', key: 'country', value: 'DE' }
  },
  routes: {},
  availableCatalogues: ['OCCURRENCE', 'DATASET', 'PUBLISHER', 'LITERATURE', 'COLLECTION', 'INSTITUTION'],
};

export const StandaloneExample = () => <Standalone siteConfig={siteConfig} id={text('publisherUUID', 'a7b59f8e-ab56-4cc3-9f70-0f7fd89dd6f2')}></Standalone>;