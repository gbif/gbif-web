import config from '#/config';
import axios from 'axios';
import { GraphQLError } from 'graphql';

const DEFAULT_CHECKLIST_KEY =
  config.defaultChecklist ?? 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c'; // Backbone key for classification

const { treatmentPublishers } = config;
/**
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query a map the result
 * @param {String} facetKey
 */
const getTaxonFacet =
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
    return dataSources.taxonAPI.searchTaxa({ query }).then((data) => [
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
const isInvasiveString = (strVerbatim) => {
  const str = `${strVerbatim}`.toLowerCase().trim();
  return str === 'invasive' || str === 'true' || str === 'yes';
};
const getInvasiveSpeciesInfo = async (
  { taxonKey, dataset },
  args,
  { dataSources },
) => {
  // get species from this dataset that is related to this taxonkey

  const related = await dataSources.taxonAPI.getTaxonDetails({
    resource: 'related',
    key: taxonKey,
    query: { datasetKey: dataset.key },
  });
  // if there is any related species, then there is invasive species listed in that dataset (assuming the provided dataset is listing invasive species)
  const species = related.results;
  // extract country from keyword
  const keywords = dataset.keywords || [];
  let invadedCountry = keywords.find((keyword) => {
    return keyword.startsWith('country_');
  });
  // Consider multiple keywords. This allows the publisher to add 2 keywords.
  // One for the country and another for the territory.
  // That means that we can still search for all datasets about a country,
  // while still have the information that it is about a subset
  const subCountry = keywords.find((keyword) => {
    return keyword.startsWith('country_') && keyword.length > 10;
  });
  if (species.length > 0 && invadedCountry) {
    // get verbatim species view
    try {
      const verbatimSpecies = await dataSources.taxonAPI.getTaxonDetails({
        resource: 'verbatim',
        key: species[0].key,
      });
      const profiles =
        verbatimSpecies?.extensions?.[
          'http://rs.gbif.org/terms/1.0/SpeciesProfile'
        ] || [];

      const invasiveInfo = profiles.find(
        (x) => x['http://rs.gbif.org/terms/1.0/isInvasive'],
      );

      let isInvasive = false;
      if (invasiveInfo) {
        isInvasive = isInvasiveString(
          invasiveInfo['http://rs.gbif.org/terms/1.0/isInvasive'],
        );
      }

      const isSubCountry = !!subCountry; // invadedCountry.length > 10;
      invadedCountry = invadedCountry.substring(8, 10).toUpperCase();
      // compose result obj with the properties we need for displaying the list - no need to send full species and dataaset obj.
      return {
        country: invadedCountry,
        isSubCountry,
        datasetKey: dataset.key,
        dataset: dataset.title,
        scientificName: species[0].scientificName,
        nubKey: species[0].nubKey,
        taxonKey: species[0].key,
        isInvasive,
      };
    } catch (err) {
      // log error, but continue, it might be that the other in the list will show. This has happened in the past if the APIs are in a bad state due to broken indexing.
      return null;
    }
  } else {
    return null;
  }
};

const getTreatment = async ({ key }, args, { dataSources }) => {
  const sourceTaxon = await dataSources.taxonAPI.getTaxonByKey({ key });
  const verbatimSpecies = await await dataSources.taxonAPI.getTaxonDetails({
    resource: 'verbatim',
    key,
  });
  /*   const images = await getSpeciesMedia(key);
   */
  const dataset = await dataSources.datasetAPI.getDatasetByKey({
    key: sourceTaxon.datasetKey,
  });
  const publisher = await dataSources.organizationAPI.getOrganizationByKey({
    key: dataset.publishingOrganizationKey,
  });
  const treatmentCandidate =
    verbatimSpecies?.extensions?.['http://eol.org/schema/media/Document']?.[0];

  const reference =
    verbatimSpecies?.extensions?.[
      'http://eol.org/schema/reference/Reference'
    ]?.[0];

  if (
    treatmentCandidate &&
    treatmentCandidate['http://purl.org/dc/terms/description'] &&
    treatmentCandidate['http://purl.org/dc/terms/format'] === 'text/html' &&
    treatmentPublishers.indexOf(dataset.publishingOrganizationKey) > -1
  ) {
    const treatment =
      treatmentCandidate['http://purl.org/dc/terms/description'];
    const treatmentCitation =
      treatmentCandidate['http://purl.org/dc/terms/bibliographicCitation'];
    const treatmentUrl =
      treatmentCandidate[
        'http://rs.tdwg.org/dwc/terms/additionalInformationURL'
      ];
    return {
      description: treatment,
      citation:
        treatmentCitation ||
        reference?.['http://eol.org/schema/reference/full_reference'],
      sourceTaxon,
      /*       images: images.results,
       */ publisherTitle: publisher.title,
      publisherHomepage: publisher?.homepage?.[0],
      publisherKey: publisher.key,
      datasetTitle: dataset.title,
      datasetKey: dataset.key,
      link: treatmentUrl || sourceTaxon?.references,
    };
  }
  return null;
};

// this is an ugly hack because we do not model treatments
const getTreatments = async ({ key }, args, { dataSources }) => {
  const limit = 1000;
  const offset = 0;

  // get datasets that deal with this taxon.
  const datasets = await dataSources.datasetAPI.searchDatasets({
    query: { taxonKey: key, type: 'CHECKLIST', limit, offset },
  });

  const treatmentDatasets = datasets?.results.filter((x) => {
    return treatmentPublishers.indexOf(x.publishingOrganizationKey) > -1;
  });

  // for each of these datasets look for the related species within those datasets.
  const decoratedTreatmentDatasets = await Promise.all(
    treatmentDatasets.map(async (e) => {
      const related = await dataSources.taxonAPI.getTaxonDetails({
        resource: 'related',
        key,
        query: { datasetKey: e.key },
      });
      // if there is any related species, then there is invasive species listed in that dataset (assuming the provided dataset is listing invasive species)
      const species = related?.results || [];

      // if that related species (which is from plazi) has a reference to plazi, then it probably has a treatment attached to it.
      const _relatedTaxon = species.find((s) => !!s.references);
      if (_relatedTaxon) {
        try {
          const treatment = await getTreatment(
            { key: _relatedTaxon.key },
            args,
            {
              dataSources,
            },
          );
          return { ...e, treatment, _relatedTaxon };
        } catch (err) {
          console.log(
            `Error while getting treatment for ${_relatedTaxon.key} in dataset ${e.key}`,
            err,
          );
          return { ...e };
        }
      }
      return { ...e };
    }),
  );

  // treaments are only those related species that have links to treatment bank
  // for each treatment lookup the verbatim (from which we use the eol extension to show treatment info)
  // and get the images for that taxon.
  const treatments = decoratedTreatmentDatasets
    .filter((e) => !!e?._relatedTaxon?.references && !!e.treatment)
    .map((e) => e.treatment);
  return treatments;
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
    taxonSearch: (parent, { query = {}, ...args } = {}, { dataSources }) =>
      dataSources.taxonAPI.searchTaxa({ query: { ...args, ...query } }),
    backboneSearch: (parent, { query = {}, ...args } = {}, { dataSources }) =>
      dataSources.taxonAPI.searchBackbone({ query: { ...args, ...query } }),
    taxon: (parent, { key }, { dataSources }) =>
      dataSources.taxonAPI.getTaxonByKey({ key }),
    checklistRoots: (parent, { datasetKey: key, ...query }, { dataSources }) =>
      dataSources.taxonAPI.getChecklistRoots({ key, query }),
    taxonSuggestions: (parent, query, { dataSources }) =>
      dataSources.taxonAPI.getSuggestions(query),
    taxonBySourceId: (parent, { sourceId, datasetKey }, { dataSources }) =>
      dataSources.taxonAPI.getTaxonBySourceId({ sourceId, datasetKey }),
    speciesMatchByUsageKey: (
      parent,
      { usageKey, checklistKey = DEFAULT_CHECKLIST_KEY },
      { dataSources },
    ) =>
      dataSources.taxonAPI.getSpeciesMatchByUsageKey({
        usageKey,
        checklistKey,
      }),
  },
  Taxon: {
    dataset: ({ datasetKey }, args, { dataSources }) =>
      dataSources.datasetAPI.getDatasetByKey({ key: datasetKey }),
    sourceTaxon: ({ sourceTaxonKey }, args, { dataSources }) =>
      dataSources.taxonAPI.getTaxonByKey({ key: sourceTaxonKey }),
    formattedName: (
      { key, scientificName },
      { useFallback },
      { dataSources },
    ) => {
      return dataSources.taxonAPI
        .getParsedName({ key })
        .then((formattedName) => {
          return formattedName;
        })
        .catch((err) => {
          if (useFallback) {
            return name;
          }
          throw err;
        });
    },
    wikiData: ({ key }, args, { dataSources }) =>
      dataSources.wikidataAPI.getWikiDataTaxonData(key),
    backboneTaxon: ({ key, nubKey }, args, { dataSources }) => {
      if (typeof nubKey === 'undefined' || key === nubKey) return null;
      return dataSources.taxonAPI.getTaxonByKey({ key: nubKey });
    },
    acceptedTaxon: ({ key, acceptedKey }, args, { dataSources }) => {
      if (typeof acceptedKey === 'undefined' || key === acceptedKey)
        return null;
      return dataSources.taxonAPI.getTaxonByKey({ key: acceptedKey });
    },
    mapCapabilities: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.occurrenceAPI.getMapCapabilities({ taxonKey: key });
    },
    taxonImages_volatile: ({ key, nubKey }, { size }, { dataSources }) =>
      dataSources.taxonMediaAPI.getRepresentativeImages({
        taxon: nubKey ?? key,
        dataSources,
        size,
      }),
    speciesCount: ({ key }, args, { dataSources }) =>
      getTaxonFacet('rank')(
        { _query: { higherTaxonKey: key } },
        { limit: 100 },
        { dataSources },
      ).then((data) => {
        return data.find((d) => d.name === 'SPECIES')?.count || 0;
      }),
    checklistBankBreakdown: async ({ key }, args, { dataSources }) => {
      const taxon = await dataSources.taxonAPI.getTaxonByKey({ key });
      if (taxon.origin === 'DENORMED_CLASSIFICATION') {
        return null;
      }
      const dataset = await dataSources.datasetAPI.getDatasetByKey({
        key: taxon.datasetKey,
      });
      const clbDatasetKey = dataset?.identifiers.find(
        (i) => i.type === 'CLB_DATASET_KEY',
      )?.identifier;

      if (clbDatasetKey) {
        try {
          const breakdown = await axios.get(
            `https://api.checklistbank.org/dataset/${clbDatasetKey}/taxon/${
              taxon.datasetKey === config.gbifBackboneUUID ? key : taxon.taxonID
            }/breakdown`,
          );
          return breakdown.data
            .filter((t) => t.species > 0)
            .map((t) => ({
              ...t,
              children: t.children
                .filter((c) => c.species > 0)
                .sort((a, b) => b.species - a.species),
            }))
            .sort((a, b) => b.species - a.species);
        } catch (e) {
          throw new Error(
            e?.response?.data?.message ||
              e?.message ||
              `An error occurred while fetching the breakdown for ChecklistBank dataset ${clbDatasetKey} and taxon ${taxon.taxonID}`,
          );
        }
      }
      console.log(
        `No CLB_DATASET_KEY found in identifiers for dataset ${dataset?.key}`,
      );
      console.log(dataset?.identifiers);
      throw new GraphQLError(
        `No CLB_DATASET_KEY found in identifiers for dataset ${dataset?.key}`,
        {
          extensions: { code: 'YOUR_ERROR_CODE' },
        },
      );
    },
    invasiveInCountries: async ({ key }, args, { dataSources }) => {
      const limit = 500; // get all countries in the world and hope that this publisher only publish one per country and not not invasives
      const offset = 0;
      const griisLists = await dataSources.datasetAPI.searchDatasets({
        query: {
          taxonKey: key,
          type: 'CHECKLIST',
          publishingOrg: config.griisPublisherUUID,
          limit,
          offset,
        },
      });
      const results = await Promise.all(
        griisLists.results.map((dataset) =>
          getInvasiveSpeciesInfo({ taxonKey: key, dataset }, args, {
            dataSources,
          }),
        ),
      );

      return results.filter((e) => e);
    },
    iucnStatus: async ({ key }, args, { dataSources }) => {
      const related = await dataSources.taxonAPI.getTaxonDetails({
        resource: 'related',
        key,
        query: { datasetKey: config.iucnDatasetKey },
      });
      const iucnTaxon = related?.results?.[0];
      if (!iucnTaxon) {
        return null;
      }
      const distributions = await dataSources.taxonAPI.getTaxonDetails({
        resource: 'distributions',
        key: iucnTaxon.key,
      });

      if (distributions?.results?.length === 0) {
        return null;
      }
      const globalDistribution = distributions?.results.find((e) =>
        e.locality ? e.locality.toLowerCase() === 'global' : false,
      );
      if (!globalDistribution) {
        return null;
      }
      return {
        distribution: globalDistribution,
        references: iucnTaxon.references,
      };
    },
    treatments: getTreatments,
  },
  TaxonSearchResult: {
    facet: (parent) => ({
      _query: { ...parent._query, limit: undefined, offset: undefined },
    }), // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
  },
  TaxonFacet: {
    rank: getTaxonFacet('rank'),
    status: getTaxonFacet('status'),
    higherTaxonKey: getTaxonFacet('highertaxonKey'),
    issue: getTaxonFacet('issue'),
  },
  TaxonFacetResult: {
    taxonSearch: (parent, query, { dataSources }) =>
      dataSources.taxonAPI.searchTaxa({
        query: { ...parent._query, ...query },
      }),
  },
  TaxonBreakdown: {
    taxon: ({ name: key }, args, { dataSources }) =>
      dataSources.taxonAPI.getTaxonByKey({ key }),
    taxonSearch: (parent, query, { dataSources }) =>
      dataSources.taxonAPI.searchTaxa({
        query: { ...parent._query, ...query },
      }),
  },
};
