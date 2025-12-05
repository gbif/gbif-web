import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Image } from './Image';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Image',
  component: Image,
};

export const Example = () => <>
  <Image src="http://bioimages.vanderbilt.edu/gq/thomas/g0426-01-03.jpg" w={100}/>
  <Image src="http://bioimages.vanderbilt.edu/gq/thomas/g0426-01-03.jpg" w={200}/>
  <Image src="http://bioimages.vanderbilt.edu/gq/thomas/g0426-01-03.jpg" w={100} h={100}/>
  <StyledProse source={readme}></StyledProse>
</>;

Example.story = {
  name: 'Image',
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
// {text('Text', 'Image text')}