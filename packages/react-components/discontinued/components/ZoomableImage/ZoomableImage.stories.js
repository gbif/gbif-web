import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { ZoomableImage } from './ZoomableImage';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/ZoomableImage',
  component: ZoomableImage,
};

export const Example = () => <>
  <ZoomableImage>
    ZoomableImage - not implemented yet. But we need one. We miss it on the current portal
  </ZoomableImage>
  {/* <StyledProse source={readme}></StyledProse> */}
</>;

Example.story = {
  name: 'ZoomableImage',
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
// {text('Text', 'ZoomableImage text')}