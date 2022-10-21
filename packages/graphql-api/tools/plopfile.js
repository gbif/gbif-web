import path from 'path';

// Plop documentation https://plopjs.com/documentation/#getting-started
export default (plop) => {
  // create generators here
  plop.setGenerator('resource', {
    description: 'Add a new resource',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your resource?',
        validate(value) {
          if (typeof value === 'string' && value.length > 0) return true;
          return 'name is required';
        },
      },
    ],
    actions: () => {
      const actions = [
        {
          type: 'add',
          path: path.resolve(
            './src/resources/{{camelCase name}}/{{camelCase name}}.type.js',
          ),
          templateFile: 'plop-templates/resources/type.hbs',
        },
        {
          type: 'add',
          path: path.resolve(
            './src/resources/{{camelCase name}}/{{camelCase name}}.source.js',
          ),
          templateFile: 'plop-templates/resources/dataSource.hbs',
        },
        {
          type: 'add',
          path: path.resolve(
            './src/resources/{{camelCase name}}/{{camelCase name}}.resolver.js',
          ),
          templateFile: 'plop-templates/resources/resolver.hbs',
        },
        {
          type: 'add',
          path: path.resolve('./src/resources/{{camelCase name}}/index.js'),
          templateFile: 'plop-templates/resources/index.hbs',
        },
        {
          type: 'modify',
          path: path.resolve('./src/typeDefs.js'),
          pattern:
            /(\/\/ -- Add imports above this line \(required by plopfile\.js\) --)/gi,
          template: `    require('./resources/{{camelCase name}}').typeDef,\r\n$1`,
        },
        {
          type: 'modify',
          path: path.resolve('./src/resolvers.js'),
          pattern:
            /(\/\/ -- Add imports above this line \(required by plopfile\.js\) --)/gi,
          template: `  require('./resources/{{camelCase name}}').resolver,\r\n$1`,
        },
        {
          type: 'modify',
          path: path.resolve('./src/dataSources.js'),
          pattern:
            /(\/\/ -- Add imports above this line \(required by plopfile\.js\) --)/gi,
          template: `  require('./resources/{{camelCase name}}').dataSource,\r\n$1`,
        },
      ];

      return actions;
    },
  });
};
