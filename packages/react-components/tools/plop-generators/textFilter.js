const path = require('path');
const shared = require('./shared');

module.exports = {
  description: 'Add a new text filter',
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
      shared.filter.text,
      shared.translations.nameAndCount
    ];

    return actions;
  }
}