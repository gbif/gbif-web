import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { OccurrenceMap } from './OccurrenceMap';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';

export default {
  title: 'Components/OccurrenceMap',
  component: OccurrenceMap,
};

export const Example = () => <DocsWrapper>
  <OccurrenceMap rootPredicate={
    {
      // type: 'equals',
      // key: 'datasetKey',
      // value: '50c9509d-22c7-4a22-a47d-8c48425ef4a7'
      type: 'and',
      predicates: [
        {
          type: 'equals',
          key: 'country',
          value: 'US'
        },
        {
          type: 'equals',
          key: 'hasGeospatialIssue',
          value: false
        }
      ]
    }
  }/>
  {/* <StyledProse source={readme}></StyledProse> */}
</DocsWrapper>;

Example.story = {
  name: 'OccurrenceMap',
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
// {text('Text', 'OccurrenceMap text')}