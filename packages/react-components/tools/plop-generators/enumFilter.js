const path = require('path');

module.exports = {
  description: 'Add a new enum filter',
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
      type: 'ENUM',
      config: {
        std: {
          filterHandle: '{{camelCase name}}',
          id2labelHandle: '{{camelCase name}}',
          translations: {
            count: 'filters.{{camelCase name}}.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'filters.{{camelCase name}}.name',// translation path to a title for the popover and the button
            description: 'filters.{{camelCase name}}.description', // translation path for the filter description
          }
        },
        specific: {
          options: {{camelCase name}}
        }
      }
    },\r\n  $1`,
      },
      {
        type: 'modify',
        path: path.resolve('./src/utils/filterBuilder/commonFilters.js'),
        pattern: /(\/\/ -- Add imports above this line \(required by plopfile\.js\) --)/gi,
        template: `import {{camelCase name}} from '../../enums/basic/{{camelCase name}}.json';\r\n$1`,
      },
      {
        type: 'add',
        path: path.resolve(
          './src/enums/basic/{{camelCase name}}.json',
        ),
        templateFile: 'plop-templates/filters/enums.hbs',
      },
      {
        type: 'modify',
        path: path.resolve('./locales/source/en-developer/components/filters.json'),
        pattern: /("taxonKey": {)/gi,
        template: `"{{camelCase name}}": {
    "name": "{{sentenceCase name}}",
    "count": "{num, plural, one { {{sentenceCase name}} } other {# {{sentenceCase name}}s}}",
    "description": "A short description of the component should be placed here"
  },\r\n  $1`,
      },
      {
        type: 'add',
        path: path.resolve('./locales/source/en-developer/enums/{{camelCase name}}.json'),
        templateFile: 'plop-templates/filters/enumTranslation.hbs',
      },
      {
        type: 'modify',
        path: path.resolve('./locales/scripts/stitchFile.js'),
        pattern: /(\/\/ -- Add enums above this line \(required by plopfile\.js\) --)/gi,
        template: '{{camelCase name}}: getFile(locale, `../${folder}/${locale}/enums/{{camelCase name}}`),\r\n  $1'
      },
      {
        type: 'modify',
        path: path.resolve('./src/utils/labelMaker/commonLabels.js'),
        pattern: /(\/\/ -- Add labels above this line \(required by plopfile\.js\) --)/gi,
        template: `{{camelCase name}}: {
    type: 'TRANSLATION',
    template: id => \`enums.{{camelCase name}}.\${id}\`
  },\r\n  $1`,
      },
    ];

    return actions;
  }
}