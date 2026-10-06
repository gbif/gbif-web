# react-components (legacy)

Retired component library (`discontinued/`). Do not add or change components; new UI goes in
`packages/gbif-org`.

Live part: `locales/`, the translation source for the whole repo.

- `locales/source/en-developer/` (`components/`, `enums/`): English source strings. Add keys here.
- `locales/translations/`: written by Crowdin. Never edit.
- `npm run build` runs `locales/build.js` to produce the bundles gbif-org fetches at runtime;
  `npm run watch` / `npm run serve` for local development. Needs the untracked `.env.json`.
- Node 16 (`.nvmrc`); other packages are on 24.
