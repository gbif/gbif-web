import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { StripeLoader, EllipsisLoader } from './index';
import { CircularLoader } from './CircularLoader';

export default {
  title: 'Components/Loaders',
  component: StripeLoader,
};

export const Example = () => <div style={{ padding: 20, background: 'white' }}>
  <StripeLoader active={boolean("active", true)} error={boolean("error", false)} />
</div>

export const Circular_Loader = () => <div style={{ height: '2rem', width: '2rem' }}>
  <CircularLoader active={boolean("active", true)} />
</div>

Example.story = {
  name: 'Stripe Loader',
};

export const Example2 = () => <div style={{padding: 20, background: 'white'}}>
  <EllipsisLoader active={boolean("active", true)} error={boolean("error", false)}/>
</div>

Example2.story = {
  name: 'EllipsisLoader',
};
