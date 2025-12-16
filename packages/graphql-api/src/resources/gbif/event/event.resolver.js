/* eslint-disable no-param-reassign */
import { formattedCoordinates, simplifyUrlObjectKeys } from '@/helpers/utils';

// there are many fields that support facets. This function creates the resolvers for all of them

const getEventFacet =
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
    return dataSources.eventAPI.searchEvents({ query }).then((data) => [
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
export default {
  Query: {
    eventSearch: (parent, { query = {}, ...args } = {}, { dataSources }) =>
      dataSources.eventAPI.searchEvents({ query: { ...args, ...query } }),
    event: (parent, { eventId, datasetKey }, { dataSources }) =>
      dataSources.eventAPI.getEventByKey({ eventId, datasetKey }),
  },

  Event: {
    extensions: (event) => {
      const extensions = {
        audubon: event?.extensions?.['http://rs.tdwg.org/ac/terms/Multimedia'],
        image: event?.extensions?.['http://rs.gbif.org/terms/1.0/Image'],
        humboldtEcologicalInventory:
          event?.extensions?.['http://rs.tdwg.org/eco/terms/Event'],
        measurementOrFact:
          event?.extensions?.['http://rs.tdwg.org/dwc/terms/MeasurementOrFact'],
        multimedia:
          event?.extensions?.['http://rs.gbif.org/terms/1.0/Multimedia'],
        extendedMeasurementOrFact:
          event?.extensions?.[
            'http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact'
          ],
      };
      Object.keys(extensions).forEach((key) => {
        const extension = extensions[key];
        // remove empty and half empty values
        if (Array.isArray(extension) && extension.length > 0) {
          extensions[key] = extension
            .filter((x) => Object.keys(x).length > 0)
            .map(simplifyUrlObjectKeys);
          if (extensions[key].length === 0) delete extensions[key];
        } else {
          delete extensions[key];
        }
      });
      return extensions;
    },
    formattedCoordinates: ({ decimalLatitude, decimalLongitude }) => {
      return formattedCoordinates({
        lat: decimalLatitude,
        lon: decimalLongitude,
      });
    },
    parentEvent: (
      { datasetKey, parentEventId: key },
      query,
      { dataSources },
    ) => {
      if (typeof key === 'undefined' || key === null) return null;
      return dataSources.eventAPI.getEventByKey({ eventId: key, datasetKey });
    },
    /* dataset: ({ datasetKey }, query, { dataSources }) => {
      if (typeof datasetKey === 'undefined' || datasetKey === null) return null;
      return dataSources.eventAPI.getDatasetEML({ datasetKey });
    }, */
  },
  EventSearchResult: {
    facet: (parent) => ({
      _query: { ...parent._query, limit: undefined, offset: undefined },
    }), // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
  },
  EventFacet: {
    country: getEventFacet('country'),
    continent: getEventFacet('continent'),
    locality: getEventFacet('locality'),
    sampleSizeUnit: getEventFacet('sampleSizeUnit'),
    sampleSizeValue: getEventFacet('sampleSizeValue'),
    humboldtProtocolNames: getEventFacet('humboldtProtocolNames'),
    humboldtInventoryTypes: getEventFacet('humboldtInventoryTypes'),
    month: getEventFacet('month'),
    year: getEventFacet('year'),
    eventId: getEventFacet('eventId'),
    dwcaExtension: getEventFacet('dwcaExtension'),
    samplingProtocol: getEventFacet('samplingProtocol'),
    eventType: getEventFacet('eventType'),
    gadmGid: getEventFacet('gadmGid'),
    humboldtSamplingPerformedBy: getEventFacet('humboldtSamplingPerformedBy'),
    humboldtSamplingEffortUnit: getEventFacet('humboldtSamplingEffortUnit'),
    humboldtSamplingEffortValue: getEventFacet('humboldtSamplingEffortValue'),

    humboldtTargetDegreeOfEstablishmentScope: getEventFacet(
      'humboldtTargetDegreeOfEstablishmentScope',
    ),
    humboldtTargetGrowthFormScope: getEventFacet(
      'humboldtTargetGrowthFormScope',
    ),
    humboldtTargetHabitatScope: getEventFacet('humboldtTargetHabitatScope'),
    humboldtTargetLifeStageScope: getEventFacet('humboldtTargetLifeStageScope'),
    humboldtTotalAreaSampledUnit: getEventFacet('humboldtTotalAreaSampledUnit'),
    humboldtTotalAreaSampledValue: getEventFacet(
      'humboldtTotalAreaSampledValue',
    ),
    humboldtEventDurationUnit: getEventFacet('humboldtTargetHabitatScope'),
    humboldtEventDurationValue: getEventFacet('humboldtTargetHabitatScope'),
    humboldtTargetTaxonomicScopeUsageName: getEventFacet(
      'humboldtTargetTaxonomicScopeUsageName',
    ),
    humboldtAbundanceCap: getEventFacet('humboldtAbundanceCap'),
    humboldtMaterialSampleTypes: getEventFacet('humboldtMaterialSampleTypes'),
  },
  EventFacetResult: {
    eventSearch: (parent, query, { dataSources }) =>
      dataSources.eventAPI.searchEvents({
        query: { ...parent._query, ...query },
      }),
  },
};
