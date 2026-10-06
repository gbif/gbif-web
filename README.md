# GBIF-web

This is a monorepo to group GBIF web components and API wrappers that serve UI specific needs.

<!-- TOC -->

- [Packages](#packages)
- [Adding packages](#adding-packages)
- [Development](#development)
- [License](#license)
  <!-- /TOC -->

## Packages

- [GBIF.org and hosted portal code base](./packages/gbif-org/README.md)
- [GraphQL on top of the public GBIF API and es-api](./packages/graphql-api/README.md)
- [Elasticsearch API wrapper](./packages/es-api/README.md)
- [React Components library - legacy, only the translation sources in `locales/` are still in use](./packages/react-components/README.md)

For an overview of how the packages fit together and the conventions used in each, see [CLAUDE.md](./CLAUDE.md). It is written for coding agents but is a good short orientation for contributors too.

## Adding packages

To add another package create a new directory in the packages folder. Since we are using Lerna all package scripts are available from the root by running lerna run {script_name}

## Development

We use Visual Studio Code. Relevant plugins:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [GraphQL: Syntax Highlighting](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql-syntax)
- [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

## License

This repository is published under the [Apache License 2.0](LICENSE).
