import React from 'react';
import { text } from '@storybook/addon-knobs';
import { Dataset } from './Dataset';
import { MemoryRouter as Router, Switch, Route } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import Standalone from './Standalone';
import { QueryParamProvider } from 'use-query-params';

export default {
  title: 'Entities/Dataset page',
  component: Dataset,
};


export const Example = () => <Router initialEntries={[`/`]}>
  <QueryParamProvider ReactRouterRoute={Route}>
    {/* <AddressBar style={{ position: 'sticky', top: 0 }} /> */}
    <div style={{ flex: '1 1 auto' }}></div>
    {/* Crustacea */}
    {/* <Dataset id="1d1393bd-7edd-46fe-a224-ac8ff8e38402" /> */}

    {/* kew */}
    {/* <Dataset id="dceb8d52-094c-4c2c-8960-75e0097c6861" /> */}

    {/* NY botanical garden */}
    {/* <Dataset id="b2190553-4505-4fdd-8fff-065c8ca26f72" /> */}

    {/* Entomology from Harvard University, Museum of Comparative Zoology */}
    {/* <Dataset id="42844cb6-421e-4bcf-bdeb-c56039bee08c" /> */}

    {/* Gull */}
    <Dataset id={text('datasetUUID', '2985efd1-45b1-46de-b6db-0465d2834a5a')} />

    {/* Vascan */}
    {/* <Dataset id={text('datasetUUID', '3f8a1297-3259-4700-91fc-acc4170b27ce')} /> */}

    {/* <Switch>
      <Route
        path='/dataset/:key'
        render={routeProps => <Dataset id={routeProps.match.params.key} {...routeProps}/>}
      />
    </Switch> */}
  </QueryParamProvider>
</Router>;

Example.story = {
  name: 'Dataset page',
};

const siteConfig = {
  locale: 'es',
  messages: {
    'dataset.longType.OCCURRENCE': 'TEsT'
  },
  occurrence: {
    rootPredicate: { type: 'equals', key: 'country', value: 'DE' }
  }
};

export const StandaloneExample = () => <Standalone siteConfig={siteConfig} id="83e20573-f7dd-4852-9159-21566e1e691e"></Standalone>;