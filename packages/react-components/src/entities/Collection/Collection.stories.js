import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Collection } from './Collection';

export default {
  title: 'Entities/Collection page',
  component: Collection,
};

export const Example = () => <div>
  <div style={{ flex: '1 1 auto' }}></div>
  {/* Crustacea */}
  {/* <Collection id="1d1393bd-7edd-46fe-a224-ac8ff8e38402" /> */}
  
  {/* kew */}
  {/* <Collection id="dceb8d52-094c-4c2c-8960-75e0097c6861" /> */}
  
  {/* NY botanical garden */}
  <Collection id="b2190553-4505-4fdd-8fff-065c8ca26f72" />
</div>;

Example.story = {
  name: 'Collection page',
};