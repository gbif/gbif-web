import React from 'react';
import FilterSuggest from './FilterSuggest';

export default {
  title: 'Widgets/FilterSuggest',
  component: Suggest,
};

export const Suggest = () => <FilterSuggest />

Suggest.story = {
  name: 'Filter suggest',
};
