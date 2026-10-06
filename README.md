# gbif-web

The code behind [gbif.org](https://www.gbif.org) and the GBIF hosted portals, as a monorepo. Each
package has its own README, lockfile, and `.nvmrc`; install and run inside the package.

## Packages

- [gbif-org](./packages/gbif-org/README.md): gbif.org frontend and backend, and the hosted-portal browser library
- [graphql-api](./packages/graphql-api/README.md): GraphQL layer over the public GBIF API and es-api
- [es-api](./packages/es-api/README.md): Elasticsearch API wrapper
- [react-components](./packages/react-components/README.md): legacy; only the translation sources in `locales/` are still in use

How the packages fit together and the conventions in each: [AGENTS.md](./AGENTS.md). Written for
coding agents, but a good short orientation for contributors.

## Development

We use Visual Studio Code with these extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [GraphQL: Syntax Highlighting](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql-syntax)
- [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

## License

[Apache License 2.0](LICENSE).
