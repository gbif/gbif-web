import React from 'react';
import DocsWrapper from '../DocsWrapper';
import { Select } from './Select';


export default {
  title: 'Components/Form/Select',
  component: Select,
};

export const Example = () => <DocsWrapper>
  <Select placeholder="Search">
    <option>aaa</option>
    <option>bbb</option>
    <option>ccc</option>
    <option>ddd</option>
  </Select>
</DocsWrapper>;

Example.story = {
  name: 'Select',
};