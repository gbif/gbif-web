import React, { useContext } from 'react';
import { ApiContext } from '../../dataManagement/api';
import { Suggest } from '../../widgets/Filter/utils';
import { getCommonSuggests } from './getCommonSuggests';

// for reasons beyond me storybook cannot read context in its main story. you have to nest it in a component
export const Example = () => <ExampleNested />

const ExampleNested = () => {
  const apiContext = useContext(ApiContext);
  const suggestConfigs = getCommonSuggests({ client: apiContext });

  return <>
    <Suggest {...suggestConfigs.dataset} />
    <Suggest {...suggestConfigs.taxon} />
    <Suggest {...suggestConfigs.publisher} />
  </>
}

Example.story = {
  name: 'Suggest config',
};

export default {
  title: 'Utils/SuggestConfig',
};