import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { IdentifierBadge, Doi } from './IdentifierBadge';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/IdentifierBadge',
  component: IdentifierBadge,
};

export const Example = () => <>
  <IdentifierBadge style={{fontSize: '16px'}}>
    <span>any</span>
    <span>thing</span>
  </IdentifierBadge>
  <br />
  <br />
  <IdentifierBadge as="a" style={{fontSize: '16px'}} href="mailto:somewhere@example.com">
    <span>mail @</span>
    <span>link</span>
  </IdentifierBadge>
  <br />
  <br />
  <Doi id="https://doi.org/10.15468/inygc6" />
  <br /><br />
  <Doi id="10.15468/inygc6" />
  <StyledProse source={readme}></StyledProse>
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