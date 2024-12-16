# GBIF-web

This is a monorepo to group GBIF web components and API wrappers that serve UI specific needs.

<!-- TOC -->

- [Packages](#packages)
  - [React Components library - soon to be deprecated](./packages/react-components/README.md)
  - [Elastic search API wrapper](./packages/es-api/README.md)
  - [Vector tile server](./packages/es2vt/README.md)
  - [GBIF.org and hosted portal code base](./packages/gbif-org/README.md)
  - [GraphQL on top of public GBIF API](./packages/graphql/README.md)
  - [Monitoring scripts for Statuspage.io](./packages/statuspage/README.md)
- [Adding packages](#adding-packages)
- [License](#license)
  <!-- /TOC -->

## Adding packages

To add another package create a new directory in the packages folder. Since we are using Lerna all package scripts are available from the root by running lerna run {script_name}

## Development

We use Visual Studio Code. Relevant plugins:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [GraphQL: Syntax Highlighting](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql-syntax)
- [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

## License

This repository is published under the [Apache License 2.0](LICENSE.md).
