import React from 'react';
import { Tooltip } from './Tooltip';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
};

const Content = props => <span>React component</span>;
export const Example = () => <>
  <Tooltip title="Tooltip" placement="auto">
    <button>Hover to see tooltip</button>
  </Tooltip>
  <Tooltip title={<h1>Headline</h1>} placement="auto">
    <button>Hover to see html in tooltip</button>
  </Tooltip>
  <Tooltip title={<Content />} placement="auto">
    <button>Hover to see react in tooltip</button>
  </Tooltip>
  <StyledProse source={readme}></StyledProse>
</>;

Example.story = {
  name: 'Tooltip',
};

export const TooltipAsHook = () => {
  const tooltip = Tooltip.useTooltipState();
  return (
    <>
      <p>
        A piece of text with a <Tooltip.Reference style={{ background: 'pink' }}  {...tooltip} as='span'>tooltip</Tooltip.Reference> in it.
      </p>
      <Tooltip.Content {...tooltip}>Tooltip</Tooltip.Content>
    </>
  );
}


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
// {text('Text', 'Tooltip text')}