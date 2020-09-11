const path = require('path');

module.exports = {
  description: 'Add a new component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of your component?',
      validate(value) {
        if (typeof value === 'string' && value.length > 0) return true;
        return 'name is required';
      },
    },
    {
      type: 'confirm',
      name: 'refComponent',
      message: 'Do you need to forward a reference?'
    }
  ],
  actions: function (data) {
    var actions = [
      {
        type: 'add',
        path: path.resolve(
          './src/components/{{pascalCase name}}/styles.js',
        ),
        templateFile: 'plop-templates/components/styles.hbs',
      },
      {
        type: 'add',
        path: path.resolve(
          './src/components/{{pascalCase name}}/{{pascalCase name}}.stories.js',
        ),
        templateFile: 'plop-templates/components/story.hbs',
      },
      {
        type: 'add',
        path: path.resolve(
          './src/components/{{pascalCase name}}/README.md',
        ),
        templateFile: 'plop-templates/components/readme.hbs',
      },
      {
        type: 'modify',
        path: path.resolve('./src/components/index.js'),
        pattern: /(\/\/ -- Add imports above this line \(required by plopfile\.js\) --)/gi,
        template: `export { {{pascalCase name}} } from './{{pascalCase name}}/{{pascalCase name}}';\r\n$1`,
      }
    ];

    if (data.refComponent) {
      actions.push({
        type: 'add',
        path: path.resolve(
          './src/components/{{pascalCase name}}/{{pascalCase name}}.js',
        ),
        templateFile: 'plop-templates/components/leafComponent.hbs',
      });
    } else {
      actions.push({
        type: 'add',
        path: path.resolve(
          './src/components/{{pascalCase name}}/{{pascalCase name}}.js',
        ),
        templateFile: 'plop-templates/components/component.hbs',
      });
    }

    return actions;
  }
}