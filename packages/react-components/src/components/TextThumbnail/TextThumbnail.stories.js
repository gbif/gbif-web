import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { TextThumbnail } from './TextThumbnail';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';

export default {
  title: 'Components/TextThumbnail',
  component: TextThumbnail,
};

export const Example = () => <DocsWrapper>
  <TextThumbnail text="TWIN" id="different" style={{margin: 20}}/>
  <TextThumbnail text="TWIN" id="ids" style={{margin: 20}}/>
  <TextThumbnail text="A" style={{margin: 20}}/>
  <TextThumbnail text="AB" style={{margin: 20}}/>
  <TextThumbnail text="ABC" style={{margin: 20}}/>
  <TextThumbnail text="ABCD" style={{margin: 20}}/>
  <TextThumbnail text="ABCEFGHIJ" style={{margin: 20}}/>
  <StyledProse source={readme}></StyledProse>
</DocsWrapper>;

Example.story = {
  name: 'TextThumbnail',
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
// {text('Text', 'TextThumbnail text')}