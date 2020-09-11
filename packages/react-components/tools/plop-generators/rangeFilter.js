const path = require('path');

module.exports = {
  description: 'Add a new number range filter',
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
      {
        type: 'modify',
        path: path.resolve('./src/utils/filterBuilder/commonFilters.js'),
        pattern: /(\/\/ -- Add filters above this line \(required by plopfile\.js\) --)/gi,
        template: `{{camelCase name}}: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: '{{camelCase name}}',
        id2labelHandle: '{{camelCase name}}',
        translations: {
          count: 'filter.{{camelCase name}}.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.{{camelCase name}}.name',// translation path to a title for the popover and the button
          description: 'filter.{{camelCase name}}.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
      }
    }
  },\r\n  $1`,
      },
      {
        type: 'modify',
        path: path.resolve('./src/locales/en.js'),
        pattern: /(\/\/ -- Add interval above this line \(required by plopfile\.js\) --)/gi,
        template: `{{camelCase name}}: {
      between: '{{sentenceCase name}} {from} to {to}',
      lt: '{{sentenceCase name}} below {to}',
      gt: '{{sentenceCase name}} above {from}',
      e: '{{sentenceCase name}} is {from}',
    },\r\n    $1`,
      },
      {
        type: 'modify',
        path: path.resolve('./src/locales/en.js'),
        pattern: /(\/\/ -- Add filter above this line \(required by plopfile\.js\) --)/gi,
        template: `{{camelCase name}}: {
      name: '{{sentenceCase name}}',
      count: '{num, plural, one { {{sentenceCase name}} } other {# {{sentenceCase name}}s}}',
      description: 'A short description of the component should be placed here'
    },\r\n    $1`,
      },
      {
        type: 'modify',
        path: path.resolve('./src/utils/labelMaker/commonLabels.js'),
        pattern: /(\/\/ -- Add labels above this line \(required by plopfile\.js\) --)/gi,
        template: `{{camelCase name}}: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('interval.{{camelCase name}}')
  },\r\n  $1`,
      },
    ];

    return actions;
  }
}