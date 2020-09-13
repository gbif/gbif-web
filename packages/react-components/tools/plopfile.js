const component = require('./plop-generators/component');
const rangeFilter = require('./plop-generators/rangeFilter');
const enumFilter = require('./plop-generators/enumFilter');
const suggestKeyFilter = require('./plop-generators/suggestKeyFilter');
const suggestFilter = require('./plop-generators/suggestFilter');
const textFilter = require('./plop-generators/textFilter');

// Plop documentation https://plopjs.com/documentation/#getting-started
module.exports = function (plop) {
  // create generators here
  plop.setGenerator('component', component);
  plop.setGenerator('rangeFilter', rangeFilter);
  plop.setGenerator('enumFilter', enumFilter);
  plop.setGenerator('suggestKeyFilter', suggestKeyFilter);
  plop.setGenerator('suggestFilter', suggestFilter);
  plop.setGenerator('textFilter', textFilter);
};