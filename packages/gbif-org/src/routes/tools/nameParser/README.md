# Name Parser

A client-side tool that splits scientific names into their structured components — genus, species, infra-specific epithet, authorship, rank marker, etc. — using the [GBIF name parser API](https://api.gbif.org/v1/parser/name). Users either paste a list of names directly into a textarea or upload a plain-text file (one name per line, or pipe-delimited). Results are shown in a sortable, paginated table and can be downloaded as CSV.

Up to 6 000 names are supported.

## Files

| File | Purpose |
|---|---|
| `index.tsx` | Route definition (`/tools/name-parser`). Lazy-loads `NameParserPage`. |
| `NameParserPage.tsx` | Root page component. Owns all state and orchestrates the two phases (upload → results) and the download modal. |
| `types.ts` | Shared TypeScript types (`ParsedName`, `Phase`, `SortDirection`) and constants (`SAMPLE_NAMES`, `RESULT_COLUMNS`, `CSV_EXPORT_FIELDS`, page size). |
| `utils.ts` | Pure functions: `parseNameInput` (splits raw text on pipe or newline — whichever yields more), `buildCsv`, `sortNames`. |
| `uploadPhase.tsx` | Phase 1 — textarea for pasting names plus a drag-and-drop / file picker card and a "load test names" button. |
| `resultsPhase.tsx` | Phase 2 — sortable, paginated results table with an exclude-unparsed toggle and a generate-CSV button. |
| `help.tsx` | Inline API help content shown in the data header. |

The shared CSV download modal lives at `../_shared/csvDownloadModal.tsx` and is reused by both the species-lookup and name-parser tools.
