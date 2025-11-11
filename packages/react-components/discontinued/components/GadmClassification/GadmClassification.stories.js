import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { GadmClassification } from './GadmClassification';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Classification/GadmClassification',
  component: GadmClassification,
};

export const Example = () => {
  const gadm = {
    "level0": {
      "gid": "NOR",
      "name": "Norway"
    },
    "level1": {
      "gid": "NOR.3_1",
      "name": "Aust-Agder"
    },
    "level2": {
      "gid": "NOR.3.13_1",
      "name": "Tvedestrand"
    }
  };
  return <>
    <GadmClassification gadm={gadm} />
    {/* <StyledProse source={readme}></StyledProse> */}
  </>
};

Example.story = {
  name: 'GadmClassification',
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
// {text('Text', 'GadmClassification text')}