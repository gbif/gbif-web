import React from 'react';
import { number } from '@storybook/addon-knobs';
import { Progress, ProgressItem } from './Progress';
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
  <Progress percent={50} style={{height: 20, margin: 10}}/>
  <div style={{padding: 12, background: 'white', width: 250}}>
    <ProgressItem fraction={.52394876} title="How many of something" color="tomato" subtleText style={{marginBottom: 20}}/>
    <ProgressItem fraction={.000001} title="How many of something, but with a longer description" color="tomato" subtleText style={{marginBottom: 20}}/>
    <ProgressItem fraction={.25} title="Hide text percent" hidePercentage color="tomato" subtleText style={{marginBottom: 20}}/>
  </div>
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