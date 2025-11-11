import React from 'react';
import { Checkbox } from './Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
};

export const Example = () => <Checkbox style={{margin: 100}}/>

Example.story = {
  name: 'Checkbox',
};
