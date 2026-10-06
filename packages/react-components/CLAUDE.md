# react-components (legacy)

The old component library. The components themselves are retired and live under `discontinued/`.
Do not add or modify components here; new UI belongs in `packages/gbif-org`.

What is still live is `locales/`: the translation source for the whole repo.

- `locales/source/en-developer/` holds the English source strings (JSON under `components/` and
  `enums/`). Add new keys here.
- `locales/translations/` is written by Crowdin. Never edit by hand.
- `npm run build` runs `locales/build.js` to produce the translation bundles that gbif-org fetches at
  runtime. `npm run watch` and `npm run serve` do the same continuously for local development.
- Node 16 per `.nvmrc`; the other packages are on 24.
