import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter as Router, Route } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import { QueryParamProvider } from 'use-query-params';

import EventSearch from './EventSearch';
import Standalone from './Standalone';

export default {
  title: 'Search/Event search',
  component: EventSearch
};

const config = { };

export const Example = () => <Router initialEntries={[`/event/search`]}>
  <QueryParamProvider ReactRouterRoute={Route}>
    <AddressBar />
    <EventSearch pageLayout config={config} style={{ margin: 'auto', height: 'calc(100vh - 40px)' }} />
  </QueryParamProvider>
</Router>

Example.story = {
  name: 'Event search',
};

export const StandaloneExample = () => <Standalone style={{height: 'calc(100vh - 40px)'}}></Standalone>;