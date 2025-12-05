import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { HelpText, useHelp } from './HelpText';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';

export default {
  title: 'Components/HelpText',
  component: HelpText,
};

export const Example = () => {
  const {loading, body} = useHelp('cluster-explorer');
  return <DocsWrapper>
    <StyledProse source={readme}></StyledProse>
    
    <HelpText identifier="cluster-explorer" includeTitle>
      HelpText
    </HelpText>

    Or you could use the hook directly:
    {!loading && <pre>{body}</pre>}
  </DocsWrapper>;
}

Example.story = {
  name: 'HelpText',
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
// {text('Text', 'HelpText text')}