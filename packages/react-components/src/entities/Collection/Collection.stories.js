import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { CollectionPresentation as Collection } from './CollectionPresentation';

export default {
  title: 'Entities/Collection page',
  component: Collection,
};

export const Example = () => <div>
  <div style={{ flex: '1 1 auto' }}></div>
  <Collection id="1d1393bd-7edd-46fe-a224-ac8ff8e38402" />
</div>;

Example.story = {
  name: 'Collection page',
};