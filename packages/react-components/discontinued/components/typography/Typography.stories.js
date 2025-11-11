import React from 'react';
import { Markdown } from './Markdown';
import { Prose } from './Prose';
import Readme from './README.md';

export default {
  title: 'Components/Typography'
};

export const Example = () => <Prose style={{background: 'white', padding: 100}}><Markdown source={Readme} /></Prose>;

Example.story = {
  name: 'Typography',
};
