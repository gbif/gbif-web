import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { EventDatasetSidebar } from './EventDatasetSidebar';
import readme from './README.md';
import { StyledProse } from '../../components/typography/StyledProse';

export default {
  title: 'Entities/Event dataset sidebar',
  component: EventDatasetSidebar,
};

export const Example = () => <div style={{ background: '#eee', display: 'flex' }}>
  <div style={{ flex: '1 1 auto' }}></div>
  <EventDatasetSidebar id="dr18539" style={{ maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto' }} />
  {/* <EventDatasetSidebar id="dr18391" style={{ maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto' }} /> */}
  {/* <EventDatasetSidebar id="dr18527" style={{ maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto' }} /> */}
</div>;

Example.story = {
  name: 'Dataset sidebar',
};