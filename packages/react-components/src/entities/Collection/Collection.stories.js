import React from 'react';
import { text } from '@storybook/addon-knobs';
import { Collection } from './Collection';
import { MemoryRouter as Router } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import Standalone from './Standalone';

export default {
  title: 'Entities/Collection page',
  component: Collection,
};

export const Example = () => <Router initialEntries={[`/`]}>
  <AddressBar />
  <div style={{ flex: '1 1 auto' }}></div>
  {/* Crustacea */}
  {/* <Collection id="1d1393bd-7edd-46fe-a224-ac8ff8e38402" /> */}
  
  {/* kew */}
  {/* <Collection id="dceb8d52-094c-4c2c-8960-75e0097c6861" /> */}
  
  {/* NY botanical garden */}
  {/* <Collection id="b2190553-4505-4fdd-8fff-065c8ca26f72" /> */}

  {/* Entomology from Harvard University, Museum of Comparative Zoology */}
  {/* <Collection id="42844cb6-421e-4bcf-bdeb-c56039bee08c" /> */}
  <Collection id={text('collectionUUID', '42844cb6-421e-4bcf-bdeb-c56039bee08c')} />
    {/* <Switch>
      <Route
        path='/collection/:key'
        render={routeProps => <Collection id={routeProps.match.params.key} {...routeProps}/>}
      />
    </Switch> */}
</Router>;

Example.story = {
  name: 'Collection page',
};

export const StandaloneExample = () => <Standalone id="dceb8d52-094c-4c2c-8960-75e0097c6861"></Standalone>;