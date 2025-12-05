import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Eyebrow } from './Eyebrow';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';

export default {
  title: 'Components/Eyebrow',
  component: Eyebrow,
};

export const Example = () => <DocsWrapper>
  <Eyebrow prefix="Collection code" suffix="SDF"/>
  <Eyebrow prefix={<a href="">Some component</a>} suffix="SDF"/>
  {/* <StyledProse source={readme}></StyledProse> */}
</DocsWrapper>;

Example.story = {
  name: 'Eyebrow',
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
// {text('Text', 'Eyebrow text')}