const config = {
  options: {
    q: {
      type: 'text',
      field: '_all',
      get: {
        type: 'fuzzy',
      },
    },
    audiences: {
      type: 'keyword',
      field: 'audiences',
    },
    citation: {
      type: 'text',
      field: 'citation',
      get: {
        type: 'fuzzy',
      },
    },
    contentType: {
      type: 'keyword',
      field: 'contentType',
    },
    countriesOfCoverage: {
      type: 'keyword',
      field: 'countriesOfCoverage',
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
    gbifProgrammeAcronym: {
      type: 'keyword',
      field: 'gbifProgrammeAcronym',
    },
    gbifRegion: {
      type: 'keyword',
      field: 'gbifRegion',
    },
    homepage: {
      type: 'boolean',
      field: 'homepage',
    },
    id: {
      type: 'keyword',
      field: 'id',
    },
    keywords: {
      type: 'keyword',
      field: 'keywords.keyword',
      get: {
        type: 'keyword',
      },
    },
    locale: {
      type: 'keyword',
      field: 'locale',
    },
    gbifProgramme: {
      type: 'nested',
      field: 'programme',
      config: {
        prefix: 'programme',
        options: {
          id: {
            type: 'keyword',
            field: 'id',
          },
        },
      },
      get: {
        type: 'delimted',
        delimter: '__',
        termOrder: ['id'],
      },
    },
    meta: {
      type: 'nested',
      field: 'meta',
      config: {
        prefix: 'meta',
        options: {
          drupal_created: {
            type: 'date',
            field: 'drupal.created',
            get: {
              type: 'range_or_term',
              defaultUpperBound: 'gte',
              defaultLowerBound: 'lte',
            },
          },
          drupal_modified: {
            type: 'date',
            field: 'drupal.modified',
            get: {
              type: 'range_or_term',
              defaultUpperBound: 'gte',
              defaultLowerBound: 'lte',
            },
          },
          drupal_nodeId: {
            type: 'numeric',
            field: 'drupal.nodeId',
            get: {
              type: 'range_or_term',
              defaultUpperBound: 'gte',
              defaultLowerBound: 'lte',
            },
          },
          drupal_user: {
            type: 'text',
            field: 'drupal.user',
            get: {
              type: 'fuzzy',
            },
          },
          drupal_aliases_alias: {
            type: 'text',
            field: 'drupal.aliases.alias',
            get: {
              type: 'fuzzy',
            },
          },
          drupal_aliases_language: {
            type: 'text',
            field: 'drupal.aliases.language',
            get: {
              type: 'fuzzy',
            },
          },
          drupal_englishVersionId_target: {
            type: 'numeric',
            field: 'drupal.englishVersionId.target',
            get: {
              type: 'range_or_term',
              defaultUpperBound: 'gte',
              defaultLowerBound: 'lte',
            },
          },
          drupal_language_language: {
            type: 'text',
            field: 'drupal.language.language',
            get: {
              type: 'fuzzy',
            },
          },
          drupal_audience: {
            type: 'text',
            field: 'drupal.audience',
            get: {
              type: 'fuzzy',
            },
          },
          drupal_contactInfo: {
            type: 'text',
            field: 'drupal.contactInfo',
            get: {
              type: 'fuzzy',
            },
          },
          drupal_legacyDate: {
            type: 'text',
            field: 'drupal.legacyDate',
            get: {
              type: 'fuzzy',
            },
          },
          drupal_resources: {
            type: 'text',
            field: 'drupal.resources',
            get: {
              type: 'fuzzy',
            },
          },
          drupal_status: {
            type: 'text',
            field: 'drupal.status',
            get: {
              type: 'fuzzy',
            },
          },
        },
      },
      get: {
        type: 'delimted',
        delimter: '__',
        termOrder: ['drupal'],
      },
    },
    programmeTag: {
      type: 'keyword',
      field: 'programmeTag',
    },
    projectTag: {
      type: 'keyword',
      field: 'projectTag',
    },
    purposes: {
      type: 'keyword',
      field: 'purposes',
    },
    revision: {
      type: 'numeric',
      field: 'revision',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    searchable: {
      type: 'boolean',
      field: 'searchable',
    },
    topics: {
      type: 'keyword',
      field: 'topics',
    },
    type: {
      type: 'keyword',
      field: 'type',
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
    environment_sys_id: {
      type: 'keyword',
      field: 'environment.sys.id',
    },
    environment_sys_linkType: {
      type: 'text',
      field: 'environment.sys.linkType',
      get: {
        type: 'fuzzy',
      },
    },
    environment_sys_type: {
      type: 'text',
      field: 'environment.sys.type',
      get: {
        type: 'fuzzy',
      },
    },
    space_sys_id: {
      type: 'keyword',
      field: 'space.sys.id',
    },
    space_sys_linkType: {
      type: 'text',
      field: 'space.sys.linkType',
      get: {
        type: 'fuzzy',
      },
    },
    space_sys_type: {
      type: 'text',
      field: 'space.sys.type',
      get: {
        type: 'fuzzy',
      },
    },
    countriesOfResearcher: {
      type: 'keyword',
      field: 'countriesOfResearcher',
    },
    allDayEvent: {
      type: 'boolean',
      field: 'allDayEvent',
    },
    attendees: {
      type: 'text',
      field: 'attendees',
      get: {
        type: 'fuzzy',
      },
    },
    country: {
      type: 'keyword',
      field: 'country',
    },
    end: {
      type: 'date',
      field: 'end',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    gbifsAttendee: {
      type: 'keyword',
      field: 'gbifsAttendee',
    },
    gbifsCalendar: {
      type: 'boolean',
      field: 'gbifsCalendar',
    },
    gbifsNotes: {
      type: 'text',
      field: 'gbifsNotes',
      get: {
        type: 'fuzzy',
      },
    },
    location: {
      type: 'keyword',
      field: 'location',
    },
    organisingParticipants: {
      type: 'nested',
      field: 'organisingParticipants',
      config: {
        prefix: 'organisingParticipants',
        options: {
          country: {
            type: 'text',
            field: 'country',
            get: {
              type: 'fuzzy',
            },
          },
          id: {
            type: 'keyword',
            field: 'id',
          },
        },
      },
      get: {
        type: 'delimted',
        delimter: '__',
        termOrder: ['country', 'id', 'title'],
      },
    },
    start: {
      type: 'date',
      field: 'start',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    venue: {
      type: 'keyword',
      field: 'venue',
    },
    coordinates_lat: {
      type: 'numeric',
      field: 'coordinates.lat',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    coordinates_lon: {
      type: 'numeric',
      field: 'coordinates.lon',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    eventLanguage: {
      type: 'keyword',
      field: 'eventLanguage.en-GB',
    },
    contractCountry: {
      type: 'keyword',
      field: 'contractCountry',
    },
    fundsAllocated: {
      type: 'numeric',
      field: 'fundsAllocated',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    grantType: {
      type: 'keyword',
      field: 'grantType',
    },
    leadContact: {
      type: 'text',
      field: 'leadContact',
      get: {
        type: 'fuzzy',
      },
    },
    matchingFunds: {
      type: 'numeric',
      field: 'matchingFunds',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    officialTitle: {
      type: 'keyword',
      field: 'officialTitle',
    },
    projectId: {
      type: 'keyword',
      field: 'projectId',
    },
    status: {
      type: 'keyword',
      field: 'status',
    },
    acronym: {
      type: 'keyword',
      field: 'acronym',
    },
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
    chapter: {
      type: 'keyword',
      field: 'chapter',
    },
    citationKey: {
      type: 'keyword',
      field: 'citationKey',
    },
    citationType: {
      type: 'keyword',
      field: 'citationType',
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
    created: {
      type: 'date',
      field: 'created',
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
    fileAttached: {
      type: 'boolean',
      field: 'fileAttached',
    },
    gbifDatasetKey: {
      type: 'keyword',
      field: 'gbifDatasetKey',
    },
    gbifDerivedDatasetDoi: {
      type: 'text',
      field: 'gbifDerivedDatasetDoi',
      get: {
        type: 'fuzzy',
      },
    },
    gbifDownloadKey: {
      type: 'keyword',
      field: 'gbifDownloadKey',
    },
    gbifFeatureId: {
      type: 'keyword',
      field: 'gbifFeatureId',
    },
    gbifHigherTaxonKey: {
      type: 'keyword',
      field: 'gbifHigherTaxonKey',
    },
    gbifNetworkKey: {
      type: 'keyword',
      field: 'gbifNetworkKey',
    },
    gbifOccurrenceKey: {
      type: 'keyword',
      field: 'gbifOccurrenceKey',
    },
    gbifProjectIdentifier: {
      type: 'keyword',
      field: 'gbifProjectIdentifier',
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
    machineIdentifier: {
      type: 'keyword',
      field: 'machineIdentifier',
    },
    urlAlias: {
      type: 'keyword',
      field: 'urlAlias',
    },
    identifier: {
      type: 'keyword',
      field: 'identifier',
    },
    author: {
      type: 'text',
      field: 'author',
      get: {
        type: 'fuzzy',
      },
    },
    publicationDate: {
      type: 'date',
      field: 'publicationDate',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    rights: {
      type: 'text',
      field: 'rights',
      get: {
        type: 'fuzzy',
      },
    },
    rightsHolder: {
      type: 'keyword',
      field: 'rightsHolder',
    },
    externalLink: {
      type: 'boolean',
      field: 'externalLink',
    },
    link: {
      type: 'keyword',
      field: 'link',
    },
    roles: {
      type: 'text',
      field: 'roles',
      get: {
        type: 'fuzzy',
      },
    },
    url: {
      type: 'keyword',
      field: 'url',
    },
    directoryId: {
      type: 'numeric',
      field: 'directoryId',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    nodeEstablishmentDate: {
      type: 'date',
      field: 'nodeEstablishmentDate',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    nodeHasMandate: {
      type: 'boolean',
      field: 'nodeHasMandate',
    },
    networkKey: {
      type: 'keyword',
      field: 'networkKey',
    },
    summary: {
      type: 'text',
      field: 'summary',
      get: {
        type: 'fuzzy',
      },
    },
    articleType: {
      type: 'keyword',
      field: 'articleType',
    },
    displayDate: {
      type: 'boolean',
      field: 'displayDate',
    },
    notificationType: {
      type: 'keyword',
      field: 'notificationType',
    },
    severity: {
      type: 'keyword',
      field: 'severity',
    },
  },
};

module.exports = {
  config,
};
