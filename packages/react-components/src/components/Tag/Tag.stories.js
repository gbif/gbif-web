import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Tag, Tags } from './Tag';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Tag',
  component: Tag,
};

export const Example = () => <>
  <Tags>
    <Tag type="error">Error</Tag>
    <Tag type="warning">Warning</Tag>
    <Tag type="info">info</Tag>
    <Tag type="success">Success</Tag>
    <Tag type="white">White</Tag>
    <Tag type="light">Light</Tag>
    <Tag type="dark">Dark</Tag>
  </Tags>
  <Tags style={{fontSize: '20px'}}>
    <Tag type="error">Error</Tag>
    <Tag type="warning">Warning</Tag>
    <Tag type="info">info</Tag>
    <Tag type="success">Success</Tag>
    <Tag type="white">White</Tag>
    <Tag type="light">Light</Tag>
    <Tag type="dark">Dark</Tag>
  </Tags>
  <p>Inline <Tag type="error">Tag</Tag></p>
  {/* <StyledProse source={readme}></StyledProse> */}
</>;

Example.story = {
  name: 'Tag',
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
// {text('Text', 'Tag text')}