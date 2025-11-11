import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { ThumbnailMap } from './ThumbnailMap';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';

export default {
  title: 'Components/ThumbnailMap',
  component: ThumbnailMap,
};

export const Example = () => <DocsWrapper>
  <ThumbnailMap style={{width: 400}} filter={{institutionKey: '1d808a7c-1f9e-4379-9616-edb749ecf10e'}}/>
  <StyledProse source={readme}></StyledProse>
</DocsWrapper>;

Example.story = {
  name: 'ThumbnailMap',
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
// {text('Text', 'ThumbnailMap text')}