import keyBy from 'lodash/keyBy';
import merge from 'lodash/merge';
import id2title from './id2title';

let stdFilters = [
  {
    key: 'basisOfRecord', // how is this filter identified in filter. E.g. {taxonKey: [...]}
    trName: 'filter.basisOfRecord.name', // what is the path in the translation file that hold the name of the filter. E.g. "Scientific name"
    trCount: 'filter.basisOfRecord.count', // translation path for formatting filter counts. e.g. "5 scientific names"
    displayName: id2title('basisOfRecord'), // function and component that transform a value into a pretty title. E.g. taxonKey: 5 => "Fungi" or "HUMAN_OBSERVATION" => "Human observation"
    // how to transform this filter into a query. 
    // Strings are intepreted as terms
    // If not provided, it is interpreted as a term query with the same field as the key.
    // If a string, then it is interpreted as a term query with that field name
    // If it is an object, then it is a configuration of a standard type
    // If a function, then it should have the form ({values, filter}) => {return predicate}
    queryMapping: {
      key: 'basisOfRecord',
      values: x => x.upperCase()
    }
  },
  // {
  //   key: 'year',
  //   txName: 'tx.filters.year',
  //   txDescription: 'tx.filters.yearDescription',
  //   mapping: 'year',
  //   displayName: id2title('year').component,
  //   type: 'range'
  // },
  // {
  //   key: 'taxonKey',
  //   txName: 'tx.filters.taxon',
  //   txDescription: 'tx.filters.taxonDescription',
  //   mapping: 'backbone.taxonKey',
  //   displayName: id2title('taxon').component
  // }
];

stdFilters = keyBy(stdFilters, 'key');

export default (customFilters) => {
  customFilters = keyBy(customFilters, 'key');
  return merge({}, stdFilters, customFilters);
}