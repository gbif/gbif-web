import React from 'react';
import { text } from '@storybook/addon-knobs';
import { Specimen } from './Specimen';
import { MemoryRouter as Router, Route } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import Standalone from './Standalone';
import { QueryParamProvider } from 'use-query-params';

export default {
  title: 'Entities/WIP/Specimen page',
  component: Specimen,
};

export const Example = () => <Router initialEntries={[`/`]}>
  <QueryParamProvider ReactRouterRoute={Route}>
    <AddressBar />
    <div style={{ flex: '1 1 auto' }}></div>
    {/* Crustacea */}
    {/* <Specimen id="1d1393bd-7edd-46fe-a224-ac8ff8e38402" /> */}

    {/* kew */}
    {/* <Specimen id="dceb8d52-094c-4c2c-8960-75e0097c6861" /> */}

    {/* NY botanical garden */}
    {/* <Specimen id="b2190553-4505-4fdd-8fff-065c8ca26f72" /> */}

    {/* Entomology from Harvard University, Museum of Comparative Zoology */}
    {/* <Specimen id="42844cb6-421e-4bcf-bdeb-c56039bee08c" /> */}
    {/* <Specimen id={text('specimenUUID', '5c488c08-8cab-444a-9598-806dd0abec85')} /> */}
    <Specimen id={text('specimenUUID', 'B 10 0059081')} />
    {/* <Specimen id={text('specimenUUID', 'B 10 0059081')} /> */}
    {/* <Switch>
      <Route
        path='/specimen/:key'
        render={routeProps => <Specimen id={routeProps.match.params.key} {...routeProps}/>}
      />
    </Switch> */}
  </QueryParamProvider>
</Router>;

Example.story = {
  name: 'Specimen page',
};

export const StandaloneExample = () => <Standalone id="dceb8d52-094c-4c2c-8960-75e0097c6861"></Standalone>;