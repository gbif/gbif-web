import React from 'react';
import { text } from '@storybook/addon-knobs';
import { OccurrenceSidebar } from './OccurrenceSidebar';
import { MemoryRouter as Router } from "react-router-dom";
import readme from './README.md';
import { StyledProse } from '../../components/typography/StyledProse';

export default {
  title: 'Entities/Occurrence sidebar',
  component: OccurrenceSidebar,
};

export const Example = () => <Router initialEntries={[`/`]}>
  <div style={{background: '#eee', display: 'flex'}}>
    <div style={{flex: '1 1 auto'}}></div>
    {/* <OccurrenceSidebar id={930742715} style={{width: 700, height: 600, flex: '0 0 auto'}} /> */}
    {/* <OccurrenceSidebar id={1830738777} style={{maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto'}} /> */}
    {/* <OccurrenceSidebar id={2304128798} style={{maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto'}} /> */}
    {/* <OccurrenceSidebar id={1989361400} style={{maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto'}} /> */}
    {/* <OccurrenceSidebar id={text('id', '1702253346')} style={{maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto'}} /> */}
    {/* <OccurrenceSidebar id={text('id', '3032729981')} style={{maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto'}} /> */}

    {/* fossil 1316970267*/}
    {/* new fields 3005208301*/}
    <OccurrenceSidebar id={text('id', '1212082198')} style={{maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto'}} />
    {/* <StyledProse source={readme}></StyledProse> */}
  </div>
</Router>;

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