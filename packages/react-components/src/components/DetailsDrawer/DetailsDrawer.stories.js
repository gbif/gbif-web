import React, { useState } from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { DetailsDrawer } from './DetailsDrawer';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import { useDialogState } from "reakit/Dialog";
import { OccurrenceSidebar } from '../../entities';
import { MemoryRouter as Router } from "react-router-dom";

export default {
  title: 'Components/DetailsDrawer',
  component: DetailsDrawer,
};

export const Example = () => {
  const dialog = useDialogState({ animated: true, visible: true, modal: false });
  return <Router initialEntries={[`/`]}>
    <button onClick={e => dialog.show()}>toggle {JSON.stringify(dialog.visible)}</button>
    <DetailsDrawer dialog={dialog} href={'https://www.gbif.org/occurrence/930742715'} nextItem={e => alert('next')} previousItem={e => alert('previous')}>
      <OccurrenceSidebar id={930742715} style={{ width: 700, height: '100%' }} />
    </DetailsDrawer>
    {/* <StyledProse source={readme}></StyledProse> */}
  </Router>
};

Example.story = {
  name: 'DetailsDrawer',
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
// {text('Text', 'DetailsDrawer text')}