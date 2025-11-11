import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Root } from './Root';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Root',
  component: Root,
};

export const Example = () => <>
  <Root>
    Root
  </Root>
  <StyledProse source={readme}></StyledProse>
</>;

Example.story = {
  name: 'Root',
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
// {text('Text', 'Root text')}