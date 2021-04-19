import React from 'react';
import { text } from '@storybook/addon-knobs';
import { Institution } from './Institution';
import { MemoryRouter as Router } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import Standalone from './Standalone';

export default {
  title: 'Entities/Institution page',
  component: Institution,
};

export const Example = () => <Router initialEntries={['/']}>
  <AddressBar />
  <div style={{ flex: '1 1 auto' }}></div>
  <Institution id={text('institutionUUID', '07558d80-dea0-41f8-a1b7-b147e9515605')} />
</Router>;

Example.story = {
  name: 'Institution page',
};

export const StandaloneExample = () => <Standalone id="07558d80-dea0-41f8-a1b7-b147e9515605"></Standalone>;