import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { StyledProse } from '../src/components/typography/StyledProse';
import { Button } from '../src/components';
import readme from './README.md';

export const Welcome = () => <div style={{padding: '20px 50px'}}>
  <StyledProse source={readme}></StyledProse>
  <Button onClick={linkTo('Search/OccurrenceSearch')}>Explore &apos;Occurrence search&apos;</Button>
</div>
{/* <Welcome showApp={linkTo('Button')} />; */}

export default {
  title: 'Welcome',
  component: Welcome,
};

Welcome.story = {
  name: 'Welcome',
};
