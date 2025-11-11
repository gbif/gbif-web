export { default as filter2v1 } from './filter2v1';
export { default as filter2predicate } from './filter2predicate';
export { default as v12filter } from './v12filter';

/*
configuration examples
defaultKey: what should be used as a key in the predicate or as GET param name
  defaults to the object key
transformValue: a function to transform the value or values
  defaults to the identity function
defaultType: a predicate type. 
  defaults to 'equals'

the filters have to have this structure:
{
  must: {
    filterName: [values]
  },
  must_not: {
    filterName: [values]
  }
}

and the values can be either: 
string

number

predicate object (key and type use defaults if nothing else provided)
e.g. {values: [1,2,3]} or {type: 'nested', key: 'author', predicates: [predicates]}
*/

const configExample = {
  // year: termOrRangeFilter('year'),
  taxonKey: {
    defaultKey: 'gbifClassification.taxonKey'
  },
  year: {
    defaultType: 'equals'
  },
  basisOfRecord: {
    transformValue: x => x.toUpperCase()
  },
  geometry: {
    defaultType: 'within'
  }
}