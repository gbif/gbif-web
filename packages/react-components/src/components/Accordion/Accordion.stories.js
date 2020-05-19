import React, { useState } from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Accordion, AccordionControlled } from './Accordion';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Accordion',
  component: Accordion,
};

export const Example = () => {
  const [open, setOpen] = useState(false);
  return <>
    <AccordionControlled style={{fontSize: '14px'}} summary={<span>test</span>} open={open} onToggle={setOpen}>
      Accordion content goes here
    </AccordionControlled>
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