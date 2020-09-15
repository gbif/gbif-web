import React from 'react';
import { number } from '@storybook/addon-knobs';
import { Progress } from './Progress';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Progress',
  component: Progress,
};

export const Example = () => <>
  <Progress style={{margin: 10}}/>
  <Progress percent={number('Percent', 35)} style={{margin: 10}}/>
  <Progress percent={10} style={{margin: 10}}/>
  <Progress percent={100} style={{margin: 10}}/>
  <Progress percent={200} style={{margin: 10}}/>
  {/* <StyledProse source={readme}></StyledProse> */}
</>;

Example.story = {
  name: 'Progress',
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
// {text('Text', 'Progress text')}