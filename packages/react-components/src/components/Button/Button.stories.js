import { text, boolean, select } from '@storybook/addon-knobs';
import React from 'react';
import { Button, ButtonGroup, FilterButton } from './index';
import { MdClose } from 'react-icons/md';

export default {
  title: 'Components/Button',
  component: Button,
};

const options = {
  primary: 'primary',
  primaryOutline: 'primaryOutline',
  outline: 'outline',
  danger: 'danger',
};

export const Example = () => <Button style={{maxWidth: 200}}
  loading={boolean("loading", false)}
  truncate={boolean("truncate", true)}
  block={boolean("block", false)}
  appearance={select('Appearance', options, options.primary)}
>
  {text('Text', 'Very loooong button text to help decide if those should wrap or truncate')}
</Button>;

export const ButtonGroupExample = () => <ButtonGroup style={{maxWidth: 2000}}>
  <Button appearance="primary" truncate>First option sdfjkh sldkjfhls kdjhfl skjdhflkjshdlf kjh</Button>
  <Button appearance="primary">
    <MdClose />
  </Button>
</ButtonGroup>;

export const FilterGroup = () => <FilterButton isActive>
  Location
</FilterButton>;

Example.story = {
  name: 'Button',
};
