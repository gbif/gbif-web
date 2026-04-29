# Species Lookup

A client-side tool that normalises species names from a CSV file against the [GBIF backbone taxonomy](https://www.gbif.org/dataset/d7dddbf4-2cf0-4f39-9b2a-bb099caae36c). Users upload a file, optionally select a default kingdom to resolve ambiguous names, and the tool matches each row against the GBIF species match API in parallel batches. Results are shown in a paginated table and can be downloaded as a new CSV.

The input CSV must contain a `scientificName` column; `kingdom` and `id` columns are optional. Up to 6 000 rows are supported.

## Files

| File | Purpose |
|---|---|
| `index.tsx` | Route definition (`/tools/species-lookup`). Lazy-loads `SpeciesLookupPage`. |
| `SpeciesLookupPage.tsx` | Root page component. Owns all state and orchestrates the three phases (upload → kingdom selection → results) and the two modals. |
| `types.ts` | Shared TypeScript types (`SpeciesRow`, `SuggestResult`, `Phase`) and constants (`KINGDOMS`, `CSV_EXPORT_FIELDS`, batch/page sizes). |
| `utils.ts` | Pure functions: CSV parsing (auto-detects delimiter, handles quoted fields), `applyMatchData`, `toCandidate`, `processInBatches`, `buildCsv`. |
| `components.tsx` | Small shared UI components: `MatchTypeBadge`, `TaxonLink`, `SuggestionRow`. |
| `uploadPhase.tsx` | Phase 1 — drag-and-drop / file picker card. |
| `selectKingdomPhase.tsx` | Phase 2 — kingdom selector and preview table; triggers the backbone matching. |
| `resultsPhase.tsx` | Phase 3 — paginated results table with editable match column, exclude-unmatched toggle, and generate-CSV button. |
| `editModal.tsx` | Modal for correcting a single row's match: shows API candidates and a typeahead search against the backbone. |
| `help.tsx` | Inline help/description content shown on the upload phase. |

The shared CSV download modal lives at `../_shared/csvDownloadModal.tsx` and is reused by both the species-lookup and name-parser tools.
