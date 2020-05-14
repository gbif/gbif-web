import { text, boolean, select } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import React from 'react';
import { Button, ButtonGroup, FilterButton } from './index';
import { MdClose } from 'react-icons/md';

export default {
  title: 'Components/Button',
  component: Button,
  decorators: [withA11y]
};

const options = {
  primary: 'primary',
  primaryOutline: 'primaryOutline',
  outline: 'outline',
  danger: 'danger',
};

export const Default = () => <Button
  loading={boolean("loading", false)}
  truncate={boolean("truncate", true)}
  block={boolean("block", false)}
  appearance={select('Appearance', options, options.primary)}
>
  {text('Text', 'Basis of record')}
</Button>;

Default.story = {
  name: 'Button',
};

export const Long = () => <Button style={{ maxWidth: 200 }}
  loading={boolean("loading", false)}
  truncate={boolean("truncate", true)}
  block={boolean("block", false)}
  appearance={select('Appearance', options, options.primary)}
>
  {text('Text', 'Width set to 200px but have a very loooong button text. We have to either truncate or wrap.')}
</Button>;

Long.story = {
  name: 'Button with long text',
};

export const Group = () => <ButtonGroup>
  <Button appearance="primary" truncate>First option</Button>
  <Button appearance="primaryOutline">Second option</Button>
  <Button appearance="primaryOutline">
    <MdClose />
  </Button>
</ButtonGroup>;

Group.story = {
  name: 'Button group',
};

export const Filter = () => <FilterButton isActive={boolean("isActive", true)}>
  Basis of record
</FilterButton>;

Filter.story = {
  name: 'Filter button',
};

