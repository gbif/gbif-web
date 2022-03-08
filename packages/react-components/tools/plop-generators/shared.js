const path = require('path');

const stdConfig = `{
        filterHandle: '{{camelCase name}}',
        id2labelHandle: '{{camelCase name}}',
        translations: {
          count: 'filters.{{camelCase name}}.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.{{camelCase name}}.name',// translation path to a title for the popover and the button
          description: 'filters.{{camelCase name}}.description', // translation path for the filter description
        },
      }`;

module.exports = {
  // filters
  filter: {
    suggest: {
      type: 'modify',
      path: path.resolve('./src/utils/filterBuilder/commonFilters.js'),
      pattern: /(\/\/ -- Add filters above this line \(required by plopfile\.js\) --)/gi,
      template: `{{camelCase name}}: {
      type: 'SUGGEST',
      config: {
        std: ${stdConfig},
        specific: {
          suggestHandle: '{{camelCase name}}',
          id2labelHandle: '{{camelCase name}}',
        }
      }
    },\r\n  $1`
    },
    text: {
      type: 'modify',
      path: path.resolve('./src/utils/filterBuilder/commonFilters.js'),
      pattern: /(\/\/ -- Add filters above this line \(required by plopfile\.js\) --)/gi,
      template: `{{camelCase name}}: {
    type: 'SIMPLE_TEXT',
    config: {
      std: ${stdConfig},
      specific: {
        placeholder: 'E.g. DNA sequence reads'
      }
    }
  },\r\n  $1`
    },
  },

  // translations
  translations: {
    nameAndCount: {
      type: 'modify',
      path: path.resolve('./locales/source/en-developer/components/filters.json'),
      pattern: /("taxonKey": {)/gi,
      template: `"{{camelCase name}}": {
  "name": "{{sentenceCase name}}",
  "count": "{num, plural, one { {{sentenceCase name}} } other {# {{sentenceCase name}}s}}",
  "description": "A short description of the component should be placed here"
},\r\n  $1`,
    },
  },

  // labels
  labels: {
    fromRest: {
      type: 'modify',
      path: path.resolve('./src/utils/labelMaker/commonLabels.js'),
      pattern: /(\/\/ -- Add labels above this line \(required by plopfile\.js\) --)/gi,
      template: `{{camelCase name}}: {
    type: 'ENDPOINT',
    template: ({ id, api }) => \`\${api.v1.endpoint}/organization/\${id}\`,
    transform: result => ({ title: "you need to configure endpoint and title" })
  },\r\n  $1`},
    identity: {
      type: 'modify',
      path: path.resolve('./src/utils/labelMaker/commonLabels.js'),
      pattern: /(\/\/ -- Add labels above this line \(required by plopfile\.js\) --)/gi,
      template: `{{camelCase name}}: {
    type: 'TRANSLATION',
    template: id => id
  },\r\n  $1`},
  },

  //suggests
  suggest: {
    suggestKey: {
      type: 'modify',
      path: path.resolve('./src/utils/suggestConfig/getCommonSuggests.js'),
      pattern: /(\/\/ -- Add suggests above this line \(required by plopfile\.js\) --)/gi,
      template: `{{camelCase name}}: {
      //What placeholder to show
      placeholder: 'Search by {{sentenceCase name}}',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => client.v1Get(\`\/organization/suggest?limit=8&q=\${q}\`),
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function {{pascalCase name}}SuggestItem(suggestion) {
        console.warn('You need to configure endpoint and display item for the suggest');
        return <div style=\{ \{ maxWidth: '100%' \} \}>
          <div style={suggestStyle}>
            {suggestion.title}
          </div>
        </div>
      }
    },
    $1`,
    },
    suggest: {
      type: 'modify',
      path: path.resolve('./src/utils/suggestConfig/getCommonSuggests.js'),
      pattern: /(\/\/ -- Add suggests above this line \(required by plopfile\.js\) --)/gi,
      template: `{{camelCase name}}: {
    //What placeholder to show
    placeholder: 'Search by {{lowerCase name}}',
    // how to get the list of suggestion data
    getSuggestions: ({ q }) => {
      const { promise, cancel } = client.v1Get(\`/occurrence/search/{{camelCase name}}?limit=8&q=\${q}\`);
      return {
        promise: promise.then(response => ({
          data: response.data.map(i => ({ key: i, title: i }))
        })),
        cancel
      }
    },
    // how to map the results to a single string value
    getValue: suggestion => suggestion.title,
    // how to display the individual suggestions in the list
    render: function {{pascalCase name}}SuggestItem(suggestion) {
      console.warn('You need to configure endpoint and display item for the suggest');
      return <div style={suggestStyle}>
          {suggestion.title}
        </div>
      
    }
  },
  $1`,
    },
  },
  
};