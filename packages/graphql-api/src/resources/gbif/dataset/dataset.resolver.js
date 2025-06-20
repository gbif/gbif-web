import config from '#/config';
import { excerpt, getHtml } from '#/helpers/utils';
import { getFacet } from '../getQueryMetrics';
import { getDatasetEventCount, getDatasetEvents } from './event';
import { getContributors } from './helpers/contributors';

const getSourceSearch = (dataSources) => (args) =>
  dataSources.datasetAPI.searchDatasets.call(dataSources.datasetAPI, args);

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export const Query = {
  datasetSearch: (parent, { query = {}, ...args } = {}, { dataSources }) =>
    dataSources.datasetAPI.searchDatasets({ query: { ...args, ...query } }),
  datasetList: (parent, args, { dataSources }) =>
    dataSources.datasetAPI.listDatasets({ query: args }),
  dataset: (parent, { key }, { dataSources }) =>
    dataSources.datasetAPI.getDatasetByKey({ key }),
  clbNameUsageSuggest: (
    parent,
    { checklistKey = config.defaultChecklist, q, limit = 20 },
    { dataSources },
  ) => {
    return dataSources.taxonAPI
      .getChecklistMetadata({
        checklistKey,
      })
      .then((response) => {
        const datasetKey = response?.mainIndex.datasetKey;
        return dataSources.datasetAPI.getClbNameUsageSuggestions({
          checklistKey: datasetKey,
          q,
          limit,
        });
      });
  },
};

export const DatasetSearchStub = {
  dataset: ({ key }, args, { dataSources }) =>
    dataSources.datasetAPI.getDatasetByKey({ key }),
  publishingOrganization: (
    { publishingOrganizationKey: key },
    args,
    { dataSources },
  ) => {
    if (typeof key === 'undefined') return null;
    return dataSources.organizationAPI.getOrganizationByKey({ key });
  },
  hostingOrganization: (
    { hostingOrganizationKey: key },
    args,
    { dataSources },
  ) => {
    if (typeof key === 'undefined') return null;
    return dataSources.organizationAPI.getOrganizationByKey({ key });
  },
  occurrenceCount: ({ key }, args, { dataSources }) => {
    if (typeof key === 'undefined') return null;

    return dataSources.occurrenceAPI
      .searchOccurrenceDocuments({
        query: {
          size: 0,
          predicate: { type: 'equals', key: 'datasetKey', value: key },
        },
      })
      .then((documents) => documents.total);
  },
  literatureCount: ({ key }, args, { dataSources }) => {
    if (typeof key === 'undefined') return null;
    return dataSources.literatureAPI
      .searchLiterature({ query: { gbifDatasetKey: key, size: 0 } })
      .then((response) => response.documents.total);
  },
  excerpt: (src) => excerpt({ body: src.description }),
  mapCapabilities: ({ key }, args, { dataSources }) => {
    if (typeof key === 'undefined') return null;
    return dataSources.occurrenceAPI.getMapCapabilities({ datasetKey: key });
  },
};

export const Dataset = {
  logInterfaceUrl: ({ key }) => {
    return `https://logs.gbif.org/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-7d,mode:quick,to:now))&_a=(columns:!(_source),index:AWyLao3iHCKcR6PFXuPR,interval:auto,query:(query_string:(analyze_wildcard:!t,query:'datasetKey:%22${key}%22')),sort:!('@timestamp',desc))`;
  },
  machineTags: ({ machineTags }, { namespace, name, value }) => {
    // allow filtering of machine tags
    if (namespace || name || value) {
      return machineTags.filter(
        (mt) =>
          (!namespace || mt.namespace === namespace) &&
          (!name || mt.name === name) &&
          (!value || mt.value === value),
      );
    }
    return machineTags;
  },
  excerpt: (src) => excerpt({ body: src.description }),
  installation: ({ installationKey: key }, args, { dataSources }) =>
    dataSources.installationAPI.getInstallationByKey({ key }),
  duplicateOfDataset: (
    { duplicateOfDatasetKey: key },
    args,
    { dataSources },
  ) => {
    // no need to throw an error, the user have no way of knowing if the key is present
    if (typeof key === 'undefined') return null;
    return dataSources.datasetAPI.getDatasetByKey({ key });
  },
  publishingOrganizationTitle: (
    { publishingOrganizationTitle, publishingOrganizationKey: key },
    args,
    { dataSources },
  ) => {
    if (typeof key === 'undefined') return null;
    if (publishingOrganizationTitle) return publishingOrganizationTitle; // in the search API this field is already added
    return dataSources.organizationAPI
      .getOrganizationByKey({ key })
      .then((org) => org.title);
  },
  publishingOrganization: (
    { publishingOrganizationKey: key },
    args,
    { dataSources },
  ) => {
    if (typeof key === 'undefined') return null;
    return dataSources.organizationAPI.getOrganizationByKey({ key });
  },
  identifiers: ({ identifiers }, { limit }) => {
    // cap the number of identifiers returned
    return identifiers.slice(0, limit);
  },
  parentDataset: ({ parentDatasetKey: key }, args, { dataSources }) => {
    if (typeof key === 'undefined') return null;
    return dataSources.datasetAPI.getDatasetByKey({ key });
  },
  constituents: ({ key }, args, { dataSources }) => {
    return dataSources.datasetAPI.getConstituents({ key, query: args });
  },
  volatileContributors: ({ contacts }) => getContributors(contacts),
  networks: ({ key }, args, { dataSources }) => {
    return dataSources.datasetAPI.getNetworks({ key });
  },
  metrics: ({ type, key }, args, { dataSources }) => {
    if (type !== 'CHECKLIST') return null;
    return dataSources.datasetAPI.getMetrics({ key });
  },
  gridded: ({ key }, { limit = 1000 }, { dataSources }) => {
    return dataSources.datasetAPI
      .getGridded({ key })
      .then((response) => response.slice(0, limit));
  },
  description: ({ description }) => getHtml(description),
  purpose: ({ purpose }) => getHtml(purpose),
  checklistBankDataset: ({ key }, args, { dataSources }) => {
    return dataSources.datasetAPI.getFromChecklistBank({ key });
  },
  mapCapabilities: ({ key }, args, { dataSources }) => {
    if (typeof key === 'undefined') return null;
    return dataSources.occurrenceAPI.getMapCapabilities({ datasetKey: key });
  },
  occurrenceCount: ({ key }, args, { dataSources }) => {
    if (typeof key === 'undefined') return null;

    return dataSources.occurrenceAPI
      .searchOccurrenceDocuments({
        query: {
          size: 0,
          predicate: { type: 'equals', key: 'datasetKey', value: key },
        },
      })
      .then((documents) => documents.total);
  },
  literatureCount: ({ key }, args, { dataSources }) => {
    if (typeof key === 'undefined') return null;
    return dataSources.literatureAPI
      .searchLiterature({ query: { gbifDatasetKey: key, size: 0 } })
      .then((response) => response.documents.total);
  },
  events: getDatasetEvents,
  eventCount: getDatasetEventCount,
};

export const ClbDataset = {
  import: ({ key }, args, { dataSources }) => {
    const query = Object.keys(args).length > 0 ? args : undefined;
    return dataSources.datasetAPI
      .getChecklistBankImport({ key, query })
      .then((response) => response?.[0]);
  },
};

export const ClbNameUsageSuggestion = {
  taxGroup: ({ group }, args, { dataSources }) => {
    if (typeof group === 'undefined') return null;
    return dataSources.datasetAPI.getTaxGroupByName({ name: group });
  },
};

export const ClbVernacularName = {
  reference: ({ datasetKey, referenceId }, args, { dataSources }) => {
    if (typeof referenceId === 'undefined') return null;
    return dataSources.datasetAPI.getClbReferenceByKey({
      datasetKey,
      referenceId,
    });
  },
};

export const DatasetSearchResults = {
  // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
  facet: (parent) => ({
    _query: { ...parent._query, limit: undefined, offset: undefined },
  }),
};
export const DatasetFacet = {
  type: getFacet('type', getSourceSearch),
  keyword: getFacet('keyword', getSourceSearch),
  publishingOrg: getFacet('publishingOrg', getSourceSearch),
  hostingOrg: getFacet('hostingOrg', getSourceSearch),
  decade: getFacet('decade', getSourceSearch),
  publishingCountry: getFacet('publishingCountry', getSourceSearch),
  projectId: getFacet('projectId', getSourceSearch),
  license: getFacet('license', getSourceSearch),
  dwcaExtension: getFacet('dwcaExtension', getSourceSearch),
  networkKey: getFacet('networkKey', getSourceSearch),
};
export const DatasetOrganizationFacet = {
  organization: ({ name: key }, args, { dataSources }) => {
    if (typeof key === 'undefined') return null;
    return dataSources.organizationAPI.getOrganizationByKey({ key });
  },
};
export const GeographicCoverage = {
  description: ({ description }) => getHtml(description),
};
export const TaxonomicCoverage = {
  description: ({ description }) => getHtml(description),
};
export const SamplingDescription = {
  studyExtent: ({ studyExtent }) => getHtml(studyExtent),
  sampling: ({ sampling }) => getHtml(sampling),
  qualityControl: ({ qualityControl }) => getHtml(qualityControl),
  methodSteps: ({ methodSteps }) => {
    if (!Array.isArray(methodSteps) || methodSteps.length === 0)
      return methodSteps;
    return methodSteps.map(getHtml);
  },
};
