import React from 'react';
import { text } from '@storybook/addon-knobs';
import { Dataset } from './Dataset';
import { MemoryRouter as Router, Switch, Route } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import Standalone from './Standalone';

export default {
  title: 'Entities/Dataset page',
  component: Dataset,
};

export const Example = () => <Router initialEntries={[`/`]}>
  <AddressBar />
  <div style={{ flex: '1 1 auto' }}></div>
  {/* Crustacea */}
  {/* <Dataset id="1d1393bd-7edd-46fe-a224-ac8ff8e38402" /> */}
  
  {/* kew */}
  {/* <Dataset id="dceb8d52-094c-4c2c-8960-75e0097c6861" /> */}
  
  {/* NY botanical garden */}
  {/* <Dataset id="b2190553-4505-4fdd-8fff-065c8ca26f72" /> */}

  {/* Entomology from Harvard University, Museum of Comparative Zoology */}
  {/* <Dataset id="42844cb6-421e-4bcf-bdeb-c56039bee08c" /> */}
  <Dataset id={text('datasetUUID', '83e20573-f7dd-4852-9159-21566e1e691e')} />
    {/* <Switch>
      <Route
        path='/dataset/:key'
        render={routeProps => <Dataset id={routeProps.match.params.key} {...routeProps}/>}
      />
    </Switch> */}
</Router>;

Example.story = {
  name: 'Dataset page',
};

export const StandaloneExample = () => <Standalone id="dceb8d52-094c-4c2c-8960-75e0097c6861"></Standalone>;