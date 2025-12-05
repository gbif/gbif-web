import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { AltmetricDonut } from './AltmetricDonut';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';

export default {
  title: 'Components/AltmetricDonut',
  component: AltmetricDonut,
};

export const Example = () => <div>
  <DocsWrapper>
    <AltmetricDonut doi="10.1371/journal.pbio.3001336"/>
  </DocsWrapper>
  <StyledProse source={readme}></StyledProse>
</div>;

Example.story = {
  name: 'AltmetricDonut',
};