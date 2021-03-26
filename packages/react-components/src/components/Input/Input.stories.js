import React from 'react';
import DocsWrapper from '../DocsWrapper';
import { Input } from './Input';


export default {
  title: 'Components/Form/Input',
  component: Input,
};

export const Example = () => <DocsWrapper>
  <Input placeholder="Search"/>
</DocsWrapper>;

Example.story = {
  name: 'Input',
};