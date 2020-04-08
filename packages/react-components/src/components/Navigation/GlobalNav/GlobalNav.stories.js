import React from 'react';
import { GlobalNav } from './GlobalNav';
import { StyledProse } from '../../../typography/StyledProse';
import readme from './README.md';

import Router from 'react-router-dom/BrowserRouter';

export default {
  title: 'Components/GlobalNav',
  component: GlobalNav,
};

export const Example = () => <div style={{ height: '200vh' }}>
  <Router>
        <GlobalNav breakToLaptop={2000} />
        <GlobalNav breakToLaptop={10} />
  </Router>
  <StyledProse source={readme}></StyledProse>
</div>

Example.story = {
  name: 'GlobalNav',
};
