import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Skeleton } from './Skeleton';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
};

export const Example = () => <>
  <Skeleton />
  <StyledProse source={readme}></StyledProse>
</>;

Example.story = {
  name: 'Skeleton',
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
// {text('Text', 'Skeleton text')}