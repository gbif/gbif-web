import { text, boolean, select } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import React from 'react';
import { Button, ButtonGroup, FilterButton, DropdownButton } from './index';
import DocsWrapper from '../DocsWrapper';

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
  isFullWidth={boolean("isFullWidth", false)}
  appearance={select('Appearance', options, options.primary)}
>
  {text('Text', 'Basis of record')}
</Button>;

Default.story = {
  name: 'Button',
};

export const Link = () => <Button
  href="/test"
  as="a"
>
  As link by setting href and 'as="a"'
</Button>;

export const Long = () => <Button style={{ maxWidth: 200 }}
  loading={boolean("loading", false)}
  truncate={boolean("truncate", true)}
  isFullWidth={boolean("isFullWidth", false)}
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
</ButtonGroup>;

Group.story = {
  name: 'Button group',
};

export const Filter = () => <div style={{ width: 250 }}>
  <FilterButton isActive={boolean("isActive", true)} isNegated={boolean("isNegated", true)}>
    Basis of record will be truncated
  </FilterButton>
</div>;

Filter.story = {
  name: 'Filter button',
};

export const Dropdown = () => <DocsWrapper>
  <DropdownButton
    look="primary"
    style={{ margin: 24 }}
    menuItems={menuState => [
      <DropdownButton.MenuAction onClick={e => { console.log('button action clicked', menuState); menuState.hide() }}>About this filter</DropdownButton.MenuAction>,
      <DropdownButton.MenuAction onClick={e => { console.log('button action clicked', menuState); menuState.hide() }}>About this filter</DropdownButton.MenuAction>,
    ]}>
    Basis of record will be truncated
  </DropdownButton>

  <DropdownButton
    look="primaryOutline"
    style={{ margin: 24 }}
    menuItems={menuState => [
      <DropdownButton.MenuAction onClick={e => { console.log('button action clicked', menuState); menuState.hide() }}>About this filter</DropdownButton.MenuAction>,
      <DropdownButton.MenuAction onClick={e => { console.log('button action clicked', menuState); menuState.hide() }}>About this filter</DropdownButton.MenuAction>,
    ]}>
    Basis of record will be truncated
  </DropdownButton>

  <DropdownButton look="primaryOutline" 
    label={<span>Label</span>}
    style={{ margin: 24 }}
    menuItems={menuState => [
      <DropdownButton.MenuAction onClick={e => { console.log('button action clicked', menuState); menuState.hide() }}>About this filter</DropdownButton.MenuAction>,
      <DropdownButton.MenuAction onClick={e => { console.log('button action clicked', menuState); menuState.hide() }}>About this filter</DropdownButton.MenuAction>,
    ]}
    >
  </DropdownButton>

  <DropdownButton look="primaryOutline" 
    menuItems={menuState => [
      <DropdownButton.MenuAction onClick={e => { console.log('button action clicked', menuState); menuState.hide() }}>About this filter</DropdownButton.MenuAction>,
      <DropdownButton.MenuAction onClick={e => { console.log('button action clicked', menuState); menuState.hide() }}>About this filter</DropdownButton.MenuAction>,
    ]}
    >
  </DropdownButton>
</DocsWrapper>;

Filter.story = {
  name: 'Filter button',
};

