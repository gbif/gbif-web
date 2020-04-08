import React from 'react';
import TaxonSuggest from './TaxonSuggest';
import FilterSuggest from './FilterSuggest';

export default {
  title: 'Widgets/TaxonSuggest',
  component: TaxonSuggest,
};

export const Example = () => <TaxonSuggest />
export const suggest = () => <FilterSuggest />

Example.story = {
  name: 'Taxon suggest',
};
