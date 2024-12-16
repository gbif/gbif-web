const config = {
  options: {
    abbreviation: {
      type: 'keyword',
      field: 'abbreviation',
    },
    additionalInfo: {
      type: 'text',
      field: 'additionalInfo',
      get: {
        type: 'fuzzy',
      },
    },
    alias: {
      type: 'text',
      field: 'alias',
      get: {
        type: 'fuzzy',
      },
    },
    q: {
      type: 'text',
      field: 'all',
      get: {
        type: 'fuzzy',
      },
    },
    city: {
      type: 'keyword',
      field: 'city',
    },
    collectionKey: {
      type: 'keyword',
      field: 'collectionKey',
    },
    continent: {
      type: 'keyword',
      field: 'continent',
    },
    country: {
      type: 'keyword',
      field: 'country',
    },
    countryCoverage: {
      type: 'keyword',
      field: 'countryCoverage',
    },
    created: {
      type: 'date',
      field: 'created',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    createdBy: {
      type: 'keyword',
      field: 'createdBy',
    },
    dataLanguage: {
      type: 'keyword',
      field: 'dataLanguage',
    },
    dataScore: {
      type: 'numeric',
      field: 'dataScore',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    decade: {
      type: 'numeric',
      field: 'decade',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    deleted: {
      type: 'date',
      field: 'deleted',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    description: {
      type: 'text',
      field: 'description',
      get: {
        type: 'fuzzy',
      },
    },
    doi: {
      type: 'keyword',
      field: 'doi',
    },
    duplicateOfDatasetKey: {
      type: 'keyword',
      field: 'duplicateOfDatasetKey',
    },
    external: {
      type: 'boolean',
      field: 'external',
    },
    homepage: {
      type: 'keyword',
      field: 'homepage',
    },
    hostingOrganizationKey: {
      type: 'keyword',
      field: 'hostingOrganizationKey',
    },
    hostingOrganizationTitle: {
      type: 'keyword',
      field: 'hostingOrganizationTitle',
    },
    installationKey: {
      type: 'keyword',
      field: 'installationKey',
    },
    installationTitle: {
      type: 'keyword',
      field: 'installationTitle',
    },
    institutionKey: {
      type: 'keyword',
      field: 'institutionKey',
    },
    key: {
      type: 'keyword',
      field: 'key',
    },
    keyword: {
      type: 'keyword',
      field: 'keyword',
    },
    language: {
      type: 'keyword',
      field: 'language',
    },
    license: {
      type: 'keyword',
      field: 'license',
    },
    lockedForAutoUpdate: {
      type: 'boolean',
      field: 'lockedForAutoUpdate',
    },
    logoUrl: {
      type: 'keyword',
      field: 'logoUrl',
    },
    maintenanceDescription: {
      type: 'text',
      field: 'maintenanceDescription',
      get: {
        type: 'fuzzy',
      },
    },
    maintenanceUpdateFrequency: {
      type: 'text',
      field: 'maintenanceUpdateFrequency',
      get: {
        type: 'fuzzy',
      },
    },
    metadata: {
      type: 'text',
      field: 'metadata',
      get: {
        type: 'fuzzy',
      },
    },
    modified: {
      type: 'date',
      field: 'modified',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    modifiedBy: {
      type: 'keyword',
      field: 'modifiedBy',
    },
    nameUsagesPercentage: {
      type: 'numeric',
      field: 'nameUsagesPercentage',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    numConstituents: {
      type: 'numeric',
      field: 'numConstituents',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    occurrencePercentage: {
      type: 'numeric',
      field: 'occurrencePercentage',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    parentDatasetKey: {
      type: 'keyword',
      field: 'parentDatasetKey',
    },
    postalCode: {
      type: 'keyword',
      field: 'postalCode',
    },
    programmeAcronym: {
      type: 'keyword',
      field: 'programmeAcronym',
    },
    projectId: {
      type: 'keyword',
      field: 'project.identifier',
    },
    province: {
      type: 'keyword',
      field: 'province',
    },
    pubDate: {
      type: 'date',
      field: 'pubDate',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    publishingCountry: {
      type: 'keyword',
      field: 'publishingCountry',
    },
    publishingOrganizationKey: {
      type: 'keyword',
      field: 'publishingOrganizationKey',
    },
    publishingOrganizationTitle: {
      type: 'keyword',
      field: 'publishingOrganizationTitle',
    },
    purpose: {
      type: 'text',
      field: 'purpose',
      get: {
        type: 'fuzzy',
      },
    },
    rights: {
      type: 'text',
      field: 'rights',
      get: {
        type: 'fuzzy',
      },
    },
    subtype: {
      type: 'keyword',
      field: 'subtype',
    },
    taxonKey: {
      type: 'keyword',
      field: 'taxonKey',
    },
    title: {
      type: 'text',
      field: 'title',
      get: {
        type: 'fuzzy',
      },
    },
    type: {
      type: 'keyword',
      field: 'type',
    },
    version: {
      type: 'text',
      field: 'version',
      get: {
        type: 'fuzzy',
      },
    },
    year: {
      type: 'numeric',
      field: 'year',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    collections_identifier: {
      type: 'keyword',
      field: 'collections.identifier',
    },
    collections_name: {
      type: 'text',
      field: 'collections.name',
      get: {
        type: 'fuzzy',
      },
    },
    collections_parentIdentifier: {
      type: 'text',
      field: 'collections.parentIdentifier',
      get: {
        type: 'fuzzy',
      },
    },
    collections_specimenPreservationMethod: {
      type: 'text',
      field: 'collections.specimenPreservationMethod',
      get: {
        type: 'fuzzy',
      },
    },
    collections_curatorialUnits_count: {
      type: 'numeric',
      field: 'collections.curatorialUnits.count',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    collections_curatorialUnits_deviation: {
      type: 'numeric',
      field: 'collections.curatorialUnits.deviation',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    collections_curatorialUnits_lower: {
      type: 'numeric',
      field: 'collections.curatorialUnits.lower',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    collections_curatorialUnits_typeVerbatim: {
      type: 'text',
      field: 'collections.curatorialUnits.typeVerbatim',
      get: {
        type: 'fuzzy',
      },
    },
    collections_curatorialUnits_upper: {
      type: 'numeric',
      field: 'collections.curatorialUnits.upper',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
  },
};

module.exports = {
  config,
};
