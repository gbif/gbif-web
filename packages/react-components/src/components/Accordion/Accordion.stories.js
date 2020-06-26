import React, { useState } from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Accordion } from './Accordion';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Accordion',
  component: Accordion,
};

export const Example = () => {
  const [open, setOpen] = useState(false);
  return <>
    <Accordion style={{fontSize: '14px'}} summary={<span>Controlled</span>} open={open} onToggle={setOpen}>
      Content goes here
    </Accordion>
    <Accordion style={{fontSize: '14px'}} summary={<span>Uncontrolled</span>}>
      Content goes here
    </Accordion>
    <Accordion style={{fontSize: '14px'}} summary={<span>Uncontrolled</span>} defaultOpen={true}>
      But initital state specified as open
    </Accordion>
    {/* <StyledProse source={readme}></StyledProse> */}
  </>
};

Example.story = {
  name: 'Accordion',
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
// {text('Text', 'Accordion text')}