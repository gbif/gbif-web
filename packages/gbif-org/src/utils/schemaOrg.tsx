import { TaxonKeyQuery } from '@/gql/graphql';
import get from 'lodash/get';

export const getDatasetSchema = (dataset) => {
  const authors = (dataset.volatileContributors || [])
    .filter((c) => c.type === 'ORIGINATOR')
    .map(function (contact) {
      if (contact.firstName || contact.lastName) {
        const c = {
          '@type': 'Person',
          name: `${contact.firstName ? contact.firstName + ' ' : ''}${contact.lastName}`,
          email: contact.email[0],
          telephone: contact.phone[0],
          jobTitle: contact.position,
          identifier:
            get(contact, 'userId[0]', '').indexOf('//orcid.org/') === -1
              ? contact.userId[0]
              : {
                  '@id':
                    'https://orcid.org/' + get(contact.userId[0].split('//orcid.org/'), '[1]', ''),
                  '@type': 'PropertyValue',
                  propertyID: 'https://registry.identifiers.org/registry/orcid',
                  value: 'orcid:' + get(contact.userId[0].split('//orcid.org/'), '[1]', ''),
                  url:
                    'https://orcid.org/' + get(contact.userId[0].split('//orcid.org/'), '[1]', ''),
                },
          address: {
            '@type': 'PostalAddress',
            streetAddress: contact.address,
            addressLocality: contact.city,
            postalCode: contact.postalCode,
            addressRegion: contact.province,
            addressCountry: contact.country,
          },
        };

        if (contact.organization) {
          c.affiliation = {
            '@type': 'Organization',
            name: contact.organization,
          };
        }
        return c;
      } else if (contact.organization) {
        // The contact has neither first nor last name, but it has organization
        return {
          '@type': 'Organization',
          name: contact.organization,
          email: contact.email[0],
          telephone: contact.phone[0],
          address: {
            '@type': 'PostalAddress',
            streetAddress: contact.address,
            addressLocality: contact.city,
            postalCode: contact.postalCode,
            addressRegion: contact.province,
            addressCountry: contact.country,
          },
        };
      } else {
        return undefined;
      }
    })
    .filter((c) => !!c);

  const keywords = [
    ...(dataset?.keywordCollections || [])
      .filter(
        (kc) =>
          get(kc, 'thesaurus') &&
          get(kc, 'thesaurus', '').indexOf('http://rs.gbif.org/vocabulary/') > -1
      )
      .map((kc) =>
        kc.keywords.map((k) => ({
          '@type': 'DefinedTerm',
          name: k,
          inDefinedTermSet:
            'http://rs.gbif.org/vocabulary/' +
            get(get(kc, 'thesaurus', '').split('http://rs.gbif.org/vocabulary/'), '[1]', ''),
        }))
      ),
    ...(dataset?.keywordCollections || [])
      .filter((kc) => !get(kc, 'thesaurus') || get(kc, 'thesaurus') === 'N/A')
      .map((kc) =>
        kc.keywords.map((k) => ({
          '@type': 'Text',
          name: k,
        }))
      ),
    ...(dataset?.keywordCollections || [])
      .filter(
        (kc) =>
          get(kc, 'thesaurus') &&
          get(kc, 'thesaurus') !== 'N/A' &&
          get(kc, 'thesaurus').indexOf('http://rs.gbif.org/vocabulary/') === -1
      )
      .map((kc) =>
        kc.keywords.map((k) => ({
          '@type': 'DefinedTerm',
          name: k,
          inDefinedTermSet: get(kc, 'thesaurus', ''),
        }))
      ),
  ].flat();

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    '@id': 'https://doi.org/' + dataset.doi,
    'http://purl.org/dc/terms/conformsTo': {
      '@type': 'CreativeWork',
      '@id': 'https://bioschemas.org/profiles/Dataset/1.0-RELEASE',
    },
    identifier: [
      {
        '@id': 'https://doi.org/' + dataset.doi,
        '@type': 'PropertyValue',
        propertyID: 'https://registry.identifiers.org/registry/doi',
        value: 'doi:' + dataset.doi,
        url: 'https://doi.org/' + dataset.doi,
      },
      {
        '@type': 'PropertyValue',
        propertyID: 'UUID',
        value: dataset.key,
      },
    ],
    url: 'https://www.gbif.org/dataset/' + dataset.key,
    name: dataset?.title,
    author: authors,
    creator: authors,
    description: dataset.description,
    license: dataset.license,
    inLanguage: dataset.dataLanguage,
    datePublished: dataset.created,
    dateModified: dataset.modified,
    publisher: {
      '@type': 'Organization',
      name: dataset?.publishingOrganizationTitle,
      url: get(dataset, 'publishingOrganization.homepage[0]'),
      logo: get(dataset, 'publishingOrganization.logoUrl'),
    },
    provider: {
      '@type': 'Organization',
      name: 'GBIF',
      url: 'https://www.gbif.org',
      logo: 'https://www.gbif.org/img/logo/GBIF50.png',
      email: 'info@gbif.org',
      telephone: '+45 35 32 14 70',
    },
    keywords: keywords,
  };
  if (
    dataset.temporalCoverages &&
    dataset.temporalCoverages.length > 0 &&
    get(dataset, 'temporalCoverages[0].end') &&
    get(dataset, 'temporalCoverages[0].start')
  ) {
    schema.temporalCoverage = `${get(dataset, 'temporalCoverages[0].start')}/${get(
      dataset,
      'temporalCoverages[0].end'
    )}`;
  }

  if (get(dataset, 'geographicCoverages[0].boundingBox')) {
    const box = get(dataset, 'geographicCoverages[0].boundingBox');
    schema.spatialCoverage = {
      '@type': 'Place',
      geo: {
        '@type': 'GeoShape',
        box: `${box.minLatitude} ${box.minLongitude} ${box.maxLatitude} ${box.maxLongitude}`,
      },
    };
  }

  return schema;
};

const getSchemaTaxonName = (taxon: {
  scientificName?: string | null;
  scientificNameAuthorship?: string | null;
  taxonRank?: string | null;
}) => {
  const name = {
    '@type': 'TaxonName',
    name: taxon.scientificName,
    author: taxon.scientificNameAuthorship,
    taxonRank: taxon.taxonRank,
  };
  // TODO taxonapi: not sure what the equivalent is
  // if (taxon.publishedIn) {
  //   name.isBasedOn = {
  //     '@type': 'ScholarlyArticle',
  //     name: taxon.publishedIn,
  //   };
  // }
  return name;
};

export const getTaxonSchema = (taxonData: TaxonKeyQuery) => {
  const taxon = taxonData?.taxonInfo?.taxon;
  const taxonInfo = taxonData?.taxonInfo;
  if (!taxon || !taxonInfo) {
    return {};
  }
  const schema = {
    '@context': [
      'https://schema.org/',
      {
        dwc: 'http://rs.tdwg.org/dwc/terms/',
        'dwc:vernacularName': { '@container': '@language' },
      },
    ],
    '@type': 'Taxon',
    'http://purl.org/dc/terms/conformsTo': {
      '@type': 'Taxon',
      '@id': 'https://bioschemas.org/profiles/Taxon/0.6-RELEASE',
    },
    additionalType: ['dwc:Taxon', 'http://rs.tdwg.org/ontology/voc/TaxonConcept#TaxonConcept'],
    identifier: [
      {
        '@type': 'PropertyValue',
        name: 'GBIF taxonKey',
        propertyID: 'http://www.wikidata.org/prop/direct/P846',
        value: taxon.taxonID,
      },
      {
        '@type': 'PropertyValue',
        name: 'dwc:taxonID',
        propertyID: 'http://rs.tdwg.org/dwc/terms/taxonID',
        value: taxon.taxonID,
      },
    ],
    name: taxon.scientificName,
    scientificName: getSchemaTaxonName(taxon),

    taxonRank: [
      `http://rs.gbif.org/vocabulary/gbif/rank/${taxon.taxonRank.toLowerCase()}`,
      taxon.taxonRank.toLowerCase(),
    ],
  };
  if (taxonInfo.synonyms && get(taxon, 'synonyms[0]')) {
    schema.alternateName = taxonInfo.synonyms.map((s) => s.scientificName);
    schema.alternateScientificName = taxonInfo.synonyms.map(getSchemaTaxonName);
  }
  if (taxonInfo.vernacularNames && get(taxonInfo, 'vernacularNames[0]')) {
    schema['dwc:vernacularName'] = taxonInfo.vernacularNames.map((v) => ({
      '@language': v.language,
      '@value': v.vernacularName,
    }));
  }
  if (taxonInfo.classification && taxonInfo.classification.length > 0) {
    const parent = taxonInfo.classification[taxonInfo.classification.length - 1];
    const parentTaxonRank = parent.taxonRank ? parent.taxonRank.toLowerCase() : 'unranked';
    schema.parentTaxon = {
      '@type': 'Taxon',
      name: parent.scientificName,
      scientificName: getSchemaTaxonName(parent),
      identifier: [
        {
          '@type': 'PropertyValue',
          name: 'GBIF taxonKey',
          propertyID: 'http://www.wikidata.org/prop/direct/P846',
          value: parent.taxonID,
        },
        {
          '@type': 'PropertyValue',
          name: 'dwc:taxonID',
          propertyID: 'http://rs.tdwg.org/dwc/terms/taxonID',
          value: parent.taxonID,
        },
      ],
      taxonRank: [`http://rs.gbif.org/vocabulary/gbif/rank/${parentTaxonRank}`, parentTaxonRank],
    };
  }
  return schema;
};
