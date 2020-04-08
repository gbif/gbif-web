import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { StripeLoader } from './StripeLoader';

export default {
  title: 'Components/StripeLoader',
  component: StripeLoader,
};

export const Example = () => <div style={{padding: 20, background: 'white'}}>
  <StripeLoader active={boolean("active", true)} error={boolean("error", false)}/>
</div>

Example.story = {
  name: 'StripeLoader',
};
