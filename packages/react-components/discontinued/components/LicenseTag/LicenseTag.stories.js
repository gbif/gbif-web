import React from 'react';
import { LicenseTag } from './LicenseTag';
import DocsWrapper from '../DocsWrapper';

export default {
  title: 'Components/LicenseTag',
  component: LicenseTag,
};

export const Example = () => <DocsWrapper>
  <LicenseTag value="https://creativecommons.org/licenses/by/4.0/legalcode" />
</DocsWrapper>;

Example.story = {
  name: 'LicenseTag',
};
