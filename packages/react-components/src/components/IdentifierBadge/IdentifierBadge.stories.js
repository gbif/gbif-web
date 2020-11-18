import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { IdentifierBadge } from './IdentifierBadge';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/IdentifierBadge',
  component: IdentifierBadge,
};

export const Example = () => <>
  This component is only a stub
  <IdentifierBadge style={{fontSize: '12px'}} />
  {/* <StyledProse source={readme}></StyledProse> */}
</>;

Example.story = {
  name: 'IdentifierBadge',
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
// {text('Text', 'IdentifierBadge text')}