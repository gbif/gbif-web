# How to add a translated string

All user-facing text is rendered with react-intl (`<FormattedMessage id="..." />` or
`useIntl().formatMessage`). English source strings do not live in this package. They live in
`packages/react-components/locales/`, which is still the live translation pipeline even though the
rest of that package is retired.

## Checklist

1. **Find the right file** in `packages/react-components/locales/source/en-developer/components/`
   (or `enums/` for vocabulary values). Files are grouped by area: `dataset.json`, `search.json`,
   `filters.json`, `phrases.json` for generic words, and so on. Reuse an existing key if the exact
   phrase already exists; grep the folder first.
2. **Add the key** to that JSON file with the English text as the value. Keep the file sorted the
   way it already is and keep keys camelCase.
3. **Work out the message id.** The build (`locales/scripts/stitchFile.js`) merges each file under a
   namespace, normally the file name: a key `foo` in `dataset.json` becomes `dataset.foo`. Some
   files are mounted differently (for example `downloads.json` is split into `downloadKey.*`,
   `occurrenceDownloadFlow.*`, and `customSqlDownload.*`, and `filterAliases.json` is unwrapped).
   Check `stitchFile.js` when in doubt.
4. **Use it** in the component: `<FormattedMessage id="dataset.foo" />`. For attributes and plain
   strings use `const intl = useIntl(); intl.formatMessage({ id: 'dataset.foo' })`. Pass values
   with `values={{ count }}` and ICU syntax in the source string for plurals.
5. **See it locally.** gbif-org fetches translations at runtime from
   `PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT`. Until the deployed translations are rebuilt, a new key
   shows as its id. To test locally, run the build in react-components (`npm run watch` and
   `npm run serve`, which need the untracked `.env.json` with a `LOCALES` list) and point your
   gbif-org `.env` at that server, or accept the raw id while developing.
6. **Commit only the source file.** Do not touch `locales/translations/`.

## Caveats

- **Never edit `locales/translations/<locale>/`.** Those files are written by Crowdin, driven by
  the root `crowdin.yml` and `crowdin-en.yml`. Hand edits are overwritten and confuse translators.
- **Adding a new JSON file needs a build change.** `stitchFile.js` lists the files explicitly, so a
  new file is ignored until it is added there. Prefer a new key in an existing file.
- **Do not inline English text** in components, even for placeholders or aria labels. Portals run
  in many languages and the string will never be translated.
- **Bundled fallbacks** in `src/config/fallback/` are generated snapshots used only when the
  translations endpoint is down. Do not edit them to add a key; refresh them with
  `npm run update-fallbacks` once in a while (see `src/config/fallback/README.md`).
- **Removing or renaming a key** removes it for every locale. Grep gbif-org for the id first.
