# gbif-web

The code behind [gbif.org](https://www.gbif.org) and the GBIF hosted portals. This is a monorepo:
each package has its own README, lockfile and `.nvmrc`, and you install and run each package from
inside its own folder.

## Packages

| Package | Status | What it is |
|---|---|---|
| [gbif-org](./packages/gbif-org/README.md) | Active, where most work happens | The gbif.org frontend, a small Node backend (authentication, redirects, server-side rendering) and the hosted-portal browser library |
| [graphql-api](./packages/graphql-api/README.md) | Active | The GraphQL API that gbif-org loads nearly all its data from. It wraps the GBIF REST APIs and es-api |
| [es-api](./packages/es-api/README.md) | Active | A wrapper around the GBIF Elasticsearch indices, used by graphql-api. Requires the GBIF VPN |
| [react-components](./packages/react-components/README.md) | Legacy | Only the `locales/` folder is still in use, as the source of all translations |

## How it fits together

```
browser → gbif-org (SSR, auth, redirects) → graphql-api → GBIF REST APIs + es-api → Elasticsearch
```

gbif-org produces two builds from the same source code:

- **gbif.org** (`gbif/`), which is rendered on the server and then hydrated in the browser.
- **The hosted-portal library** (`hp/`), which runs only in the browser. Hosted portals are websites
  run by GBIF publishers, countries and networks, typically built with Jekyll. They embed this
  library to show a selection of GBIF data, such as an occurrence search limited to their own
  datasets.

Because the same components serve gbif.org and many differently configured portals, most behaviour
is driven by a shared configuration object (`packages/gbif-org/src/config/config.tsx`). It decides
which pages are enabled, the theme, the available languages, the endpoints, and a base occurrence
filter that scopes all searches. When you change shared code, keep in mind that it must also work
on a portal: there is no server-side rendering there, and settings should come from `useConfig()`
rather than being hardcoded for gbif.org.

## Getting started

- Most changes happen in gbif-org. Start with its [README](./packages/gbif-org/README.md), and look
  in [`packages/gbif-org/docs/how-to/`](./packages/gbif-org/docs/how-to/) for step-by-step guides to
  common tasks: adding a route, a translation, an occurrence filter, a filter type or a chart, and
  lazy loading a page.
- To run the site locally without access to GBIF's private configuration, see
  [Run locally](./packages/gbif-org/docs/how-to/run-locally.md).
- To add or change data in the GraphQL schema, see the
  [graphql-api README](./packages/graphql-api/README.md) and
  [Add a resource](./packages/graphql-api/docs/how-to/add-a-resource.md).
- Adding a new occurrence filter or facet touches all three active packages. The guide
  [Add an occurrence search filter](./packages/gbif-org/docs/how-to/add-an-occurrence-filter.md)
  walks through it.

## Conventions

- Each package declares its Node version in `.nvmrc` (24.x, except react-components which uses 16).
  Run `nvm use` in the package folder.
- Each package has its own `package-lock.json`, so run `npm install` inside the package rather than
  at the repository root.
- Nothing runs automatically on commit. Please run the type check, linter and tests yourself before
  pushing.
- Commit messages use `feat:` and `fix:` prefixes. Reference issues with
  `close https://github.com/gbif/gbif-web/issues/N`.
- Prettier settings differ between packages (line width 100 in gbif-org, 120 in graphql-api), so
  format with the package's own configuration.

## Translations

- English source strings are in `packages/react-components/locales/source/en-developer/`, split into
  `components/` and `enums/`. New text is added there.
- Translations are managed in Crowdin (`crowdin.yml`, `crowdin-en.yml`), which writes
  `locales/translations/`. Crowdin overwrites those files, so don't edit them by hand.
- gbif-org loads the built translation files at runtime from `PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT`.
  A bundled fallback copy lives in `packages/gbif-org/src/config/fallback/`.

## Configuration and network access

- `.env` files are not part of this repository. GBIF staff can find the real ones in the private
  `gbif-configuration/gbif-web` repository. Each package includes a template (`.env.example`, or
  `.env.example.json` for react-components) that runs against the public production endpoints with
  placeholder secrets. Never commit real secrets.
- gbif-org needs a reachable GraphQL endpoint and translations endpoint. graphql-api loads
  enumerations from the live GBIF API when it starts. es-api can only run with access to the GBIF
  VPN.
- Some checks work without any network access: `npm run type-check` and `npm run vitest` in
  gbif-org, and `npm test` in graphql-api (once a `.env` file is in place).

## Development

We use Visual Studio Code with these extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [GraphQL: Syntax Highlighting](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql-syntax)
- [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

## License

[Apache License 2.0](LICENSE).
