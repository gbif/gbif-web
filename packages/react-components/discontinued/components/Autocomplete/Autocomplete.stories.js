import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Autocomplete } from './Autocomplete';
import { Example } from './Example';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Autocomplete',
  component: Autocomplete,
};

export const Suggest = () => <>
  <Example style={{ width: 350 }}/>
  {/* <StyledProse source={readme}></StyledProse> */}
</>;

Suggest.story = {
  name: 'Autocomplete',
};


// // OPTIONS
// const options = {
//   primary: 'primary',
//   primaryOutline: 'primaryOutline',
//   outline: 'outline',
//   danger: 'danger',
// };
// type={select('Type', options, options.primary)}

// // BOOLEAN
// boolean("loading", false)

// // TEXT
// {text('Text', 'Autocomplete text')}