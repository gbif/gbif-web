import { text, boolean, select } from '@storybook/addon-knobs';
import React from 'react';
import { Button, ButtonGroup } from './index';
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

export const Test = () => <div style={{maxWidth: 2000, display: 'flex', background: 'tomato'}}>
  <button style={{whiteSpace: 'nowrap', flex: '1 1 auto'}}>a sdlfkjhas ldfkjhals dkjfhal skjdhflaksjdhf laksjdhfl akjshdf</button>
  <button style={{flex: '0 0 auto'}}>TEST</button>
</div>;

Example.story = {
  name: 'Button',
};
