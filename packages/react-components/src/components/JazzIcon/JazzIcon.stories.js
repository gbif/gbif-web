import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { JazzIcon } from './JazzIcon';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';

export default {
  title: 'Components/JazzIcon',
  component: JazzIcon,
};

export const Example = () => <DocsWrapper>
  <JazzIcon>
    JazzIcon
  </JazzIcon>
  {/* <StyledProse source={readme}></StyledProse> */}
</DocsWrapper>;

Example.story = {
  name: 'JazzIcon',
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
// {text('Text', 'JazzIcon text')}