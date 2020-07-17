import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { OccurrenceSidebar } from './OccurrenceSidebar';
import readme from './README.md';
import { StyledProse } from '../../components/typography/StyledProse';

export default {
  title: 'Entities/Occurrence sidebar',
  component: OccurrenceSidebar,
};

export const Example = () => <div style={{background: '#eee', display: 'flex'}}>
  <div style={{flex: '1 1 auto'}}></div>
  {/* <OccurrenceSidebar id={930742715} style={{width: 700, height: 600, flex: '0 0 auto'}} /> */}
  <OccurrenceSidebar id={2251295497} style={{width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto'}} />
  {/* <StyledProse source={readme}></StyledProse> */}
</div>;

Example.story = {
  name: 'Occurrence sidebar',
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
// {text('Text', 'OccurrenceDrawer text')}