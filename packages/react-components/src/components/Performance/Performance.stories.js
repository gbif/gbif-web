import React, { useState } from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Performance } from './Performance';
import readme from './README.md';
import { StyledProse } from '../../typography/StyledProse';

export default {
  title: 'Components/Performance',
  component: Performance,
};

export const Example = () => {
  const [visible, setVisible] = useState(false);
  return <>
    <button onClick={() => setVisible(!visible)}>Toggle visiblity</button>
    {visible && <Performance>
      Performance
    </Performance>}
    {/* <StyledProse source={readme}></StyledProse> */}
  </>
};

Example.story = {
  name: 'Performance',
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
// {text('Text', 'Performance text')}