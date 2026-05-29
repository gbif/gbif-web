/**
 * Used server side to prepopulate the cache.
 * See packages/gbif-org/gbif/routes/proxy/proxy.mjs
 *
 * Keep the selection set in sync with `OCCURRENCE_SNAPSHOTS_QUERY` in
 * ./index.tsx + the `DownloadResult` fragment in
 * ../../user/downloads/downloadResult.tsx so the same upstream call gets
 * warmed.
 */
export const OCCURRENCE_SNAPSHOTS_QUERY = /* GraphQL */ `
  query OccurrenceSnapshots_cache($limit: Int!, $offset: Int!) {
    occurrenceSnapshots(limit: $limit, offset: $offset) {
      limit
      offset
      count
      endOfRecords
      results {
        key
        created
        modified
        doi
        downloadLink
        status
        totalRecords
        numberDatasets
        size
        license
        request {
          predicate
          sql: sqlFormatted
          format
          type
          description
          gbifMachineDescription
          checklistKey
        }
      }
    }
  }
`;

export const OCCURRENCE_SNAPSHOTS_VARIABLES = { limit: 500, offset: 0 };
