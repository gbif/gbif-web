import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Classification } from './Classification';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Classification',
  component: Classification,
};

export const Example = () => <>
  <Classification>
    <span>higher</span>
    <span>middle</span>
    <span>lower</span>
  </Classification>
  {/* <StyledProse source={readme}></StyledProse> */}
</>;

Example.story = {
  name: 'Classification',
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
// {text('Text', 'Classification text')}