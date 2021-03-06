const path = require('path');
const shared = require('./shared');

module.exports = {
  description: 'Add a new suggest filter',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of your filter?',
      validate(value) {
        if (typeof value === 'string' && value.length > 0) return true;
        return 'name is required';
      },
    },
  ],
  actions: function (data) {
    var actions = [
      shared.filter.suggest,
      shared.translations.nameAndCount,
      shared.labels.identity,
      shared.suggest.suggest
    ];

    return actions;
  }
}