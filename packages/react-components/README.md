# gbif-react-components (legacy)

A retired component library (`discontinued/`). Do not add or change components; new UI goes in
[`packages/gbif-org`](../gbif-org/README.md).

The live part is `locales/`, the translation source for the whole repo:

- `locales/source/en-developer/` (`components/`, `enums/`): English source strings. Add keys here.
- `locales/translations/`: written by Crowdin. Never edit by hand.
- `npm run build` runs `locales/build.js` to produce the bundles gbif-org fetches at runtime.

## Quick start

The `.env.json` file should be placed in the package root and can be found in `gbif-configuration/gbif-web`. [`.env.example.json`](./.env.example.json) is the template.

This package uses Node 16, unlike the other packages (24). We manage node versions with [nvm](https://github.com/nvm-sh/nvm). Type `nvm use` to install the required version. You can also do so manually, see `.nvmrc` for the required version.

```
npm install
```

During development, rebuild the translation files on change with `npm run watch` and serve them with `npm run serve`.

## Attribution

**Icons**
<a href="https://www.flaticon.com/free-icons/empty-state" title="empty state icons">Empty state icons created by Freepik - Flaticon</a>
