import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { DatasetSidebar } from './DatasetSidebar';
import readme from './README.md';
import { StyledProse } from '../../components/typography/StyledProse';

export default {
  title: 'Entities/Dataset sidebar',
  component: DatasetSidebar,
};

export const Example = () => <div style={{ background: '#eee', display: 'flex' }}>
  <div style={{ flex: '1 1 auto' }}></div>
  <DatasetSidebar id="3f8a1297-3259-4700-91fc-acc4170b27ce" style={{ maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto' }} />
</div>;

Example.story = {
  name: 'Dataset sidebar',
};