import { getHtml, excerpt } from '#/helpers/utils';
import { getContributors } from './helpers/contributors';
/**
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query a map the result
 * @param {String} facetKey
 */
const getDatasetFacet =
  (facetKey) =>
    (parent, { limit = 10, offset = 0 }, { dataSources }) => {
      // generate the species search query, by inherting from the parent query, and map limit/offset to facet equivalents
      const query = {
        ...parent._query,
        limit: 0,
        facet: facetKey,
        facetLimit: limit,
        facetOffset: offset,
      };
      // query the API, and throw away anything but the facet counts
      return dataSources.datasetAPI.searchDatasets({ query }).then((data) => [
        ...data.facets[0].counts.map((facet) => ({
          ...facet,
          // attach the query, but add the facet as a filter
          _query: {
            ...parent._query,
            [facetKey]: facet.name,
          },
        })),
      ]);
    };

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export const Query = {
  datasetSearch: (parent, args, { dataSources }) =>
    dataSources.datasetAPI.searchDatasets({ query: args }),
  dataset: (parent, { key }, { dataSources }) =>
    dataSources.datasetAPI.getDatasetByKey({ key }),
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
      }).then((documents) => documents.total);
  },
  literatureCount: ({ key }, args, { dataSources }) => {
    if (typeof key === 'undefined') return null;
    return dataSources.literatureAPI
      .searchLiterature({ query: { gbifDatasetKey: key, size: 0 } })
      .then((response) => response.documents.total);
  },
  excerpt: src => excerpt({ body: src.description }),
  mapCapabilities: ({ key }, args, { dataSources }) => {
    if (typeof key === 'undefined') return null;
    return dataSources.occurrenceAPI.getMapCapabilities({ datasetKey: key });
  }
};

export const Dataset = {
  logInterfaceUrl: ({ key }) => {
    return `https://logs.gbif.org/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-7d,mode:quick,to:now))&_a=(columns:!(_source),index:AWyLao3iHCKcR6PFXuPR,interval:auto,query:(query_string:(analyze_wildcard:!t,query:'datasetKey:%22${key}%22')),sort:!('@timestamp',desc))`;
  },
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
    return dataSources.datasetAPI.getGridded({ key })
      .then(response => response.slice(0, limit));
  },
  description: ({ description }) => getHtml(description),
  purpose: ({ purpose }) => getHtml(purpose),
  checklistBankDataset: ({ key }, args, { dataSources }) => {
    return dataSources.datasetAPI.getFromChecklistBank({ key });
  },
  mapCapabilities: ({ key }, args, { dataSources }) => {
    if (typeof key === 'undefined') return null;
    return dataSources.occurrenceAPI.getMapCapabilities({ datasetKey: key });
  }
};

export const ChecklistBankDataset = {
  import: ({ key }, args, { dataSources }) => {
    const query = Object.keys(args).length > 0 ? args : undefined;
    return dataSources.datasetAPI.getChecklistBankImport({ key, query })
      .then(response => response?.[0]);
  }
};

export const DatasetSearchResults = {
  // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
  facet: (parent) => ({
    _query: { ...parent._query, limit: undefined, offset: undefined },
  }),
};
export const DatasetFacet = {
  type: getDatasetFacet('type'),
  keyword: getDatasetFacet('keyword'),
  publishingOrg: getDatasetFacet('publishingOrg'),
  hostingOrg: getDatasetFacet('hostingOrg'),
  decade: getDatasetFacet('decade'),
  publishingCountry: getDatasetFacet('publishingCountry'),
  projectId: getDatasetFacet('projectId'),
  license: getDatasetFacet('license'),
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
