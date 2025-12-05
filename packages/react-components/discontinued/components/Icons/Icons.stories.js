import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { ClusterIcon, GbifLogoIcon } from './Icons';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Icons',
};

export const Example = () => <div style={{margin: 24}}>
  <StyledProse source={readme}></StyledProse>
  <ClusterIcon style={{margin: 24}}/>
  <GbifLogoIcon style={{margin: 24}}/>
</div>;

Example.story = {
  name: 'Icons',
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
// {text('Text', 'Icons text')}