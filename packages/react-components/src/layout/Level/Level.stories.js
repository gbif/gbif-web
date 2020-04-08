import { action } from '@storybook/addon-actions';
import { text, boolean } from '@storybook/addon-knobs';
import React from 'react';
import Level from './Level';
import { Button } from '../../components';
import { MdApps } from "react-icons/md";

export default {
  title: 'Layout/Level',
  component: Level,
};

export const Example = () => <Level style={{ padding: 20 }}>
  <Level.Item>{text('Text', 'Level text')}</Level.Item>
  <Level.Item>{text('Text2', 'Level text2')}</Level.Item>
</Level>;

Example.story = {
  name: 'Centered',
};

export const Example2 = () => <Level style={{ padding: 20 }} as="section">
  <Level.Left>
    <Level.Item>
        <MdApps style={{fontSize: 30}}/>
    </Level.Item>
    <Level.Item>
      {text('Text', 'Observations')}
    </Level.Item>
  </Level.Left>
  <Level.Right>
    <Level.Item as="p"><strong>All</strong></Level.Item>
    <Level.Item><a>Published</a></Level.Item>
    <Level.Item><a>Drafts</a></Level.Item>
    <Level.Item><a>Deleted</a></Level.Item>
    <Level.Item><Button>Sign in</Button></Level.Item>
  </Level.Right>
</Level>;

Example2.story = {
  name: 'Left and right',
};
