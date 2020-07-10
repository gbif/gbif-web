import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { IconFeatures } from './IconFeatures';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/IconFeatures',
  component: IconFeatures,
};

export const Example = () => <>
  <IconFeatures style={{fontSize: 12}} typeStatus="HOLOTYPE" basisOfRecord="PRESERVED_SPECIMEN" hasImage eventDate="2020-10-20" isSpecimen isSequenced isTreament formattedCoordinates="12N 13E" countryCode="DK"/>
  {/* <StyledProse source={readme}></StyledProse> */}
</>;

Example.story = {
  name: 'IconFeatures',
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
// {text('Text', 'IconFeatures text')}