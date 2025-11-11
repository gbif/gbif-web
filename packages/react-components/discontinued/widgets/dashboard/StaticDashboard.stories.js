import React from 'react';
import { Standalone as Dashboard } from './StaticDashboard';

export default {
  title: 'Widgets/Dashboard',
  component: Dashboard
};

const predicate = {
  "type": "equals",
  "key": "country",
  "value": "AU"
};

export const Example = () => <Dashboard predicate={predicate} charts={['iucn', 'synonyms', 'month']} />

Example.story = {
  name: 'Dashboard',
};