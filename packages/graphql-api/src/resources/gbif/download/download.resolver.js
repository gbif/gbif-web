import { highlight } from 'sql-highlight';
import { getGbifMachineDescription } from '@/helpers/generateSql';
import config from '@/config';

const BACKBONE_CHECKLIST_KEY =
  config.defaultChecklist ?? 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';

// Predicate fields that are resolved against a checklist. When one of these
// is used and the predicate node has no explicit checklistKey, the GBIF
// backbone is implied (which is how downloads behaved before multi-taxonomy).
const CHECKLIST_AWARE_PREDICATE_FIELDS = new Set(
  [
    'taxonKey',
    'acceptedTaxonKey',
    'speciesKey',
    'genusKey',
    'familyKey',
    'orderKey',
    'classKey',
    'phylumKey',
    'kingdomKey',
    'subgenusKey',
    'iucnRedListCategory',
    'issues',
    'taxonomicIssues',
  ].map((f) => f.toLowerCase()),
);

function collectPredicateChecklists(predicate, explicit, usesImplicit) {
  if (!predicate || typeof predicate !== 'object') return;

  if (Array.isArray(predicate.predicates)) {
    predicate.predicates.forEach((child) =>
      collectPredicateChecklists(child, explicit, usesImplicit),
    );
  }
  if (predicate.predicate) {
    collectPredicateChecklists(predicate.predicate, explicit, usesImplicit);
  }

  const fieldName = predicate.key ?? predicate.parameter;
  if (typeof fieldName === 'string') {
    const isChecklistAware = CHECKLIST_AWARE_PREDICATE_FIELDS.has(
      fieldName.toLowerCase(),
    );
    if (isChecklistAware) {
      if (predicate.checklistKey) {
        explicit.add(predicate.checklistKey);
      } else {
        usesImplicit.value = true;
      }
    }
  }
}

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    datasetDownloads: (parent, args, { dataSources }) =>
      dataSources.downloadAPI.datasetDownloads({ query: args }),
    userDownloads: (
      parent,
      { username, limit = 10, offset = 0 },
      { dataSources },
      info,
    ) => {
      info.cacheControl.setCacheHint({
        maxAge: 0,
        scope: 'PRIVATE',
      });
      return dataSources.downloadAPI.getUsersDownloads({
        username,
        query: { limit, offset },
      });
    },
    userEventDownloads: (
      parent,
      { username, limit = 10, offset = 0 },
      { dataSources },
      info,
    ) => {
      info.cacheControl.setCacheHint({
        maxAge: 0,
        scope: 'PRIVATE',
      });
      return dataSources.downloadAPI.getUsersEventDownloads({
        username,
        query: { limit, offset },
      });
    },
    occurrenceSnapshots: (
      parent,
      { limit = 10, offset = 0 },
      { dataSources },
    ) => {
      return dataSources.occurrenceSnapshotsAPI.getOccurrenceSnapshots({
        query: { limit, offset },
      });
    },
    datasetsByDownload: (
      parent,
      { key, limit = 10, offset = 0 },
      { dataSources },
    ) =>
      dataSources.downloadAPI.getContributingDatasetsByDownloadKey({
        key,
        query: { limit, offset },
      }),
    datasetsByEventDownload: (
      parent,
      { key, limit = 10, offset = 0 },
      { dataSources },
    ) =>
      dataSources.downloadAPI.getContributingDatasetsByEventDownloadKey({
        key,
        query: { limit, offset },
      }),
    download: (parent, { key }, { dataSources }, info) => {
      return dataSources.downloadAPI
        .getDownloadByKey({ key })
        .then((download) => {
          if (['PREPARING', 'RUNNING'].indexOf(download?.status) > -1) {
            info.cacheControl.setCacheHint({
              maxAge: 5, // seconds
            });
          }
          return download;
        });
    },
    eventDownload: (parent, { key }, { dataSources }, info) => {
      return dataSources.downloadAPI
        .getEventDownloadByKey({ key })
        .then((download) => {
          if (['PREPARING', 'RUNNING'].indexOf(download?.status) > -1) {
            info.cacheControl.setCacheHint({
              maxAge: 5, // seconds
            });
          }
          return download;
        });
    },
  },
  Download: {
    willBeDeletedSoon: ({ eraseAfter }) => {
      if (!eraseAfter) return null;
      try {
        const eraseDate = new Date(eraseAfter);
        const sevenMonthsFromNow = new Date();
        sevenMonthsFromNow.setMonth(sevenMonthsFromNow.getMonth() + 7);
        return eraseDate < sevenMonthsFromNow;
      } catch (err) {
        return null;
      }
    },
    readyForDeletion: ({ eraseAfter }) => {
      if (!eraseAfter) return null;
      try {
        const eraseDate = new Date(eraseAfter);
        const oneDayFromNow = new Date();
        oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
        return eraseDate < oneDayFromNow;
      } catch (err) {
        return null;
      }
    },
  },
  DownloadRequest: {
    gbifMachineDescription: ({ sql, machineDescription }) => {
      try {
        const gbifMachineDescription = getGbifMachineDescription(
          machineDescription,
          sql,
        );
        return gbifMachineDescription;
      } catch (err) {
        return null;
      }
    },
    sqlFormatted: ({ sql }) => {
      try {
        const highlighted = highlight(sql, {
          html: true,
        });
        return highlighted;
      } catch (err) {
        return sql;
      }
    },
    predicateChecklists: ({ predicate }) => {
      if (!predicate) return null;
      const explicit = new Set();
      const usesImplicit = { value: false };
      try {
        collectPredicateChecklists(predicate, explicit, usesImplicit);
      } catch (err) {
        return null;
      }
      if (usesImplicit.value) explicit.add(BACKBONE_CHECKLIST_KEY);
      return Array.from(explicit);
    },
  },
};
