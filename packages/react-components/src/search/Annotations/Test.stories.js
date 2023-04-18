import React from 'react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import AddressBar from '../../StorybookAddressBar';
import Test from './Test';

export default {
  title: 'Tools/Test',
  component: Test
};

export const Example = () => <Test />;

Example.story = {
  name: 'WIP - Test',
};