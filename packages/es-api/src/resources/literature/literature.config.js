const config = {
  options: {
    abstract: {
      type: 'text',
      field: 'abstract',
      get: {
        type: 'fuzzy',
      },
    },
    accessed: {
      type: 'date',
      field: 'accessed',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    authored: {
      type: 'boolean',
      field: 'authored',
    },
    authors: {
      type: 'nested',
      field: 'authors',
      config: {
        prefix: 'authors',
        options: {
          firstName: {
            type: 'keyword',
            field: 'firstName',
          },
          lastName: {
            type: 'keyword',
            field: 'lastName',
          },
        },
      },
      get: {
        type: 'delimted',
        delimter: '__',
        termOrder: ['firstName', 'lastName'],
      },
    },
    gbifProjectIdentifier: {
      type: 'keyword',
      field: 'gbifProjectIdentifier',
    },
    chapter: {
      type: 'keyword',
      field: 'chapter',
    },
    citationKey: {
      type: 'keyword',
      field: 'citationKey',
    },
    city: {
      type: 'keyword',
      field: 'city',
    },
    code: {
      type: 'keyword',
      field: 'code',
    },
    confirmed: {
      type: 'boolean',
      field: 'confirmed',
    },
    contentType: {
      type: 'keyword',
      field: 'contentType',
    },
    countriesOfCoverage: {
      type: 'keyword',
      field: 'countriesOfCoverage',
    },
    countriesOfResearcher: {
      type: 'keyword',
      field: 'countriesOfResearcher',
    },
    country: {
      type: 'keyword',
      field: 'country',
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
    discovered: {
      type: 'date',
      field: 'accessed',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    added: {
      type: 'date',
      field: 'created',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    createdAt: {
      type: 'date',
      field: 'createdAt',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    day: {
      type: 'numeric',
      field: 'day',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    department: {
      type: 'keyword',
      field: 'department',
    },
    edition: {
      type: 'keyword',
      field: 'edition',
    },
    editors: {
      type: 'nested',
      field: 'editors',
      config: {
        prefix: 'editors',
        options: {
          firstName: {
            type: 'keyword',
            field: 'firstName',
          },
          lastName: {
            type: 'keyword',
            field: 'lastName',
          },
        },
      },
      get: {
        type: 'delimted',
        delimter: '__',
        termOrder: ['firstName', 'lastName'],
      },
    },
    fileAttached: {
      type: 'boolean',
      field: 'fileAttached',
    },
    gbifDatasetKey: {
      type: 'keyword',
      field: 'gbifDatasetKey',
    },
    gbifDownloadKey: {
      type: 'keyword',
      field: 'gbifDownloadKey',
    },
    gbifOccurrenceKey: {
      type: 'keyword',
      field: 'gbifOccurrenceKey',
    },
    gbifRegion: {
      type: 'keyword',
      field: 'gbifRegion',
    },
    gbifTaxonKey: {
      type: 'keyword',
      field: 'gbifTaxonKey',
    },
    genre: {
      type: 'keyword',
      field: 'genre',
    },
    groupId: {
      type: 'keyword',
      field: 'groupId',
    },
    hidden: {
      type: 'boolean',
      field: 'hidden',
    },
    id: {
      type: 'keyword',
      field: 'id',
    },
    doi: {
      type: 'flatNested',
      field: 'identifiers',
      config: {
        prefix: 'identifiers',
        options: {
          doi: {
            type: 'keyword',
            field: 'doi',
          },
        },
      },
    },
    identifiers: {
      type: 'nested',
      field: 'identifiers',
      config: {
        prefix: 'identifiers',
        options: {
          arxiv: {
            type: 'keyword',
            field: 'arxiv',
          },
          doi: {
            type: 'keyword',
            field: 'doi',
          },
          isbn: {
            type: 'keyword',
            field: 'isbn',
          },
          issn: {
            type: 'keyword',
            field: 'issn',
          },
          pmid: {
            type: 'keyword',
            field: 'pmid',
          },
        },
      },
      get: {
        type: 'delimted',
        delimter: '__',
        termOrder: ['arxiv', 'doi', 'isbn', 'issn', 'pmid'],
      },
    },
    institution: {
      type: 'keyword',
      field: 'institution',
    },
    issue: {
      type: 'keyword',
      field: 'issue',
    },
    keywords: {
      type: 'keyword',
      field: 'keywords',
    },
    language: {
      type: 'keyword',
      field: 'language',
    },
    literatureType: {
      type: 'keyword',
      field: 'literatureType',
    },
    medium: {
      type: 'keyword',
      field: 'medium',
    },
    month: {
      type: 'numeric',
      field: 'month',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    notes: {
      type: 'text',
      field: 'notes',
      get: {
        type: 'fuzzy',
      },
    },
    openAccess: {
      type: 'boolean',
      field: 'openAccess',
    },
    pages: {
      type: 'keyword',
      field: 'pages',
    },
    patentApplicationNumber: {
      type: 'keyword',
      field: 'patentApplicationNumber',
    },
    patentLegalStatus: {
      type: 'keyword',
      field: 'patentLegalStatus',
    },
    patentOwner: {
      type: 'keyword',
      field: 'patentOwner',
    },
    peerReview: {
      type: 'boolean',
      field: 'peerReview',
    },
    privatePublication: {
      type: 'boolean',
      field: 'privatePublication',
    },
    profileId: {
      type: 'keyword',
      field: 'profileId',
    },
    publisher: {
      type: 'keyword',
      field: 'publisher',
    },
    publishingOrganizationKey: {
      type: 'keyword',
      field: 'publishingOrganizationKey',
    },
    gbifNetworkKey: {
      type: 'keyword',
      field: 'gbifNetworkKey',
    },
    read: {
      type: 'boolean',
      field: 'read',
    },
    relevance: {
      type: 'keyword',
      field: 'relevance',
    },
    reprintEdition: {
      type: 'keyword',
      field: 'reprintEdition',
    },
    revision: {
      type: 'keyword',
      field: 'revision',
    },
    searchable: {
      type: 'boolean',
      field: 'searchable',
    },
    series: {
      type: 'keyword',
      field: 'series',
    },
    seriesEditor: {
      type: 'keyword',
      field: 'seriesEditor',
    },
    shortTitle: {
      type: 'keyword',
      field: 'shortTitle',
    },
    source: {
      type: 'keyword',
      field: 'source',
    },
    gbifProgrammeAcronym: {
      type: 'keyword',
      field: 'gbifProgrammeAcronym',
    },
    sourceType: {
      type: 'keyword',
      field: 'sourceType',
    },
    starred: {
      type: 'boolean',
      field: 'starred',
    },
    tags: {
      type: 'keyword',
      field: 'tags',
    },
    title: {
      type: 'text',
      field: 'title',
      get: {
        type: 'fuzzy',
      },
    },
    topics: {
      type: 'keyword',
      field: 'topics',
    },
    translators: {
      type: 'nested',
      field: 'translators',
      config: {
        prefix: 'translators',
        options: {
          firstName: {
            type: 'keyword',
            field: 'firstName',
          },
          lastName: {
            type: 'keyword',
            field: 'lastName',
          },
        },
      },
      get: {
        type: 'delimted',
        delimter: '__',
        termOrder: ['firstName', 'lastName'],
      },
    },
    updatedAt: {
      type: 'date',
      field: 'updatedAt',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    userContext: {
      type: 'keyword',
      field: 'userContext',
    },
    volume: {
      type: 'keyword',
      field: 'volume',
    },
    websites: {
      type: 'keyword',
      field: 'websites',
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
    q: {
      field: '_all',
      get: {
        type: 'fuzzy',
      },
    },
  },
};

module.exports = {
  config,
};
