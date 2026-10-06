# How to add a translated string

All text goes through react-intl (`<FormattedMessage id>` or `useIntl().formatMessage`). Source
strings live in `packages/react-components/locales/`, the only live part of that package.

## Checklist

1. Pick the file in `locales/source/en-developer/components/` (`dataset.json`, `search.json`,
   `filters.json`, `phrases.json` for generic words, ...) or `enums/` for vocabulary values. Grep
   first; reuse an existing key when the phrase exists.
2. Add the camelCase key with the English value, keeping the file's order.
3. Derive the id. `locales/scripts/stitchFile.js` mounts each file under a namespace, usually the
   file name: `foo` in `dataset.json` is `dataset.foo`. Exceptions exist (`downloads.json` splits
   into `downloadKey.*`, `occurrenceDownloadFlow.*`, `customSqlDownload.*`; `filterAliases.json` is
   unwrapped). Check `stitchFile.js` when unsure.
4. Use it: `<FormattedMessage id="dataset.foo" values={{ count }} />` or
   `intl.formatMessage({ id: 'dataset.foo' })`. ICU syntax for plurals.
5. Locally, new keys render as their id until the translation bundle is rebuilt. To see them: in
   react-components run `npm run watch` and `npm run serve` (needs the untracked `.env.json` with
   `LOCALES`) and point gbif-org's `.env` at it.
6. Commit only the source file.

## Caveats

- **Never edit `locales/translations/<locale>/`.** Crowdin owns it (`crowdin.yml`, `crowdin-en.yml`).
- **A new JSON file needs a `stitchFile.js` entry**; files are listed explicitly. Prefer a key in an
  existing file.
- **No inline English**, including placeholders and aria labels. Portals run in many languages.
- **`src/config/fallback/` is a generated snapshot** for when the endpoint is down. Refresh with
  `npm run update-fallbacks`; do not add keys there.
- **Renaming or removing a key** drops it for every locale. Grep gbif-org for the id first.
