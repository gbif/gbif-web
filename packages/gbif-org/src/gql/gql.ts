/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query Header {\n    gbifHome {\n      title\n      summary\n      children {\n        externalLink\n        link\n        title\n        children {\n          externalLink\n          link\n          title\n          children {\n            externalLink\n            link\n            title\n          }\n        }\n      }\n    }\n  }\n": types.HeaderDocument,
    "\n  query HelpText($identifier: String!, $locale: String) {\n    help(identifier: $identifier, locale: $locale) {\n      id\n      identifier\n      title\n      body\n    }\n  }\n": types.HelpTextDocument,
    "\n  query HelpTitle($identifier: String!, $locale: String) {\n    help(identifier: $identifier, locale: $locale) {\n      id\n      identifier\n      title\n    }\n  }\n": types.HelpTitleDocument,
    "\n  query ParticipantSelect($type: NodeType, $participationStatus: ParticipationStatus, $limit: Int) {\n    participantSearch(type: $type, participationStatus: $participationStatus, limit: $limit) {\n      endOfRecords\n      count\n      results {\n        id\n        name\n      }\n    }\n  }\n": types.ParticipantSelectDocument,
    "\n  fragment DatasetResult on DatasetSearchStub {\n    key\n    title\n    excerpt\n    type\n    publishingOrganizationTitle\n    recordCount\n    license\n  }\n": types.DatasetResultFragmentDoc,
    "\n  query Dataset($key: ID!) {\n    dataset(key: $key) {\n      title\n      type\n      deleted\n      created\n      publishingOrganizationKey\n      publishingOrganizationTitle\n\n      contactsCitation {\n        key\n        abbreviatedName\n        firstName\n        lastName\n        userId\n        roles\n      }\n    }\n  }\n": types.DatasetDocument,
    "\n  query Occurrence($key: ID!) {\n    occurrence(key: $key) {\n      eventDate\n      scientificName\n      coordinates\n      dataset {\n        key\n        title\n      }\n    }\n  }\n": types.OccurrenceDocument,
    "\n  query OccurrenceSearch($from: Int, $predicate: Predicate) {\n    occurrenceSearch(predicate: $predicate) {\n      documents(from: $from) {\n        from\n        size\n        total\n        results {\n          key\n          scientificName\n          eventDate\n          coordinates\n          county\n          basisOfRecord\n          datasetName\n          publisherTitle\n        }\n      }\n    }\n  }\n": types.OccurrenceSearchDocument,
    "\n  query Publisher($key: ID!) {\n    publisher: organization(key: $key) {\n      title\n    }\n  }\n": types.PublisherDocument,
    "\n  query AliasHandling($alias: String!) {\n    resource(alias: $alias) {\n      ...ResourceRedirectDetails\n    }\n  }\n": types.AliasHandlingDocument,
    "\n  fragment ArticlePage on Article {\n    id\n    title\n    summary\n    excerpt\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    documents {\n      ...DocumentPreview\n    }\n    topics\n    purposes\n    audiences\n    citation\n    createdAt\n  }\n": types.ArticlePageFragmentDoc,
    "\n  fragment ArticleBanner on AssetImage {\n    description\n    title\n    file {\n      url\n      details {\n        image {\n          width\n          height\n        }\n      }\n      normal: thumbor(width: 1200, height: 500)\n      mobile: thumbor(width: 800, height: 400)\n    }\n  }\n": types.ArticleBannerFragmentDoc,
    "\n  fragment DocumentPreview on DocumentAsset {\n    title\n    file {\n      url\n      fileName\n      contentType\n      volatile_documentType\n      details {\n        size\n      }\n    }\n  }\n": types.DocumentPreviewFragmentDoc,
    "\n  fragment FundingOrganisationDetails on FundingOrganisation {\n    id\n    title\n    url\n    logo {\n      title\n      file {\n        url\n      }\n    }\n  }\n": types.FundingOrganisationDetailsFragmentDoc,
    "\n  fragment ProgrammeFundingBanner on Programme {\n    __typename\n    fundingOrganisations {\n      ...FundingOrganisationDetails\n    }\n  }\n": types.ProgrammeFundingBannerFragmentDoc,
    "\n  fragment ProjectFundingBanner on GbifProject {\n    __typename\n    fundsAllocated\n    programme {\n      ...ProgrammeFundingBanner\n    }\n    overrideProgrammeFunding {\n      ...FundingOrganisationDetails\n    }\n  }\n": types.ProjectFundingBannerFragmentDoc,
    "\n  fragment BlockItemDetails on BlockItem {\n    __typename\n    ... on HeaderBlock {\n      id\n      ...HeaderBlockDetails\n    }\n    ... on FeatureBlock {\n      id\n      ...FeatureBlockDetails\n    }\n    ... on FeaturedTextBlock {\n      id\n      ...FeaturedTextBlockDetails\n    }\n    ... on CarouselBlock {\n      id\n      ...CarouselBlockDetails\n    }\n    ... on MediaBlock {\n      id\n      ...MediaBlockDetails\n    }\n    ... on MediaCountBlock {\n      id\n      ...MediaCountBlockDetails\n    }\n    ... on CustomComponentBlock {\n      id\n      ...CustomComponentBlockDetails\n    }\n    ... on TextBlock {\n      id\n      ...TextBlockDetails\n    }\n  }\n": types.BlockItemDetailsFragmentDoc,
    "\n  fragment CarouselBlockDetails on CarouselBlock {\n    __typename\n    id\n    title\n    body\n    backgroundColour\n    features {\n      __typename\n      ... on MediaBlock {\n        ...MediaBlockDetails\n      }\n      ... on MediaCountBlock {\n        ...MediaCountBlockDetails\n      }\n    }\n  }\n": types.CarouselBlockDetailsFragmentDoc,
    "\n  fragment CustomComponentBlockDetails on CustomComponentBlock {\n    id\n    componentType\n    title\n    width\n    backgroundColour\n    settings\n  }\n": types.CustomComponentBlockDetailsFragmentDoc,
    "\n  fragment FeatureBlockDetails on FeatureBlock {\n    __typename\n    maxPerRow\n    title\n    hideTitle\n    body\n    backgroundColour\n    features {\n      __typename\n      ... on Feature {\n        id\n        title\n        url\n        primaryImage {\n          ...ProseCardImg\n        }\n      }\n      ... on News {\n        id\n        title\n        optionalImg: primaryImage {\n          ...ProseCardImg\n        }\n      }\n      ... on DataUse {\n        id\n        title\n        optionalImg: primaryImage {\n          ...ProseCardImg\n        }\n      }\n      ... on Event {\n        id\n        title\n        start\n        end\n        optionalImg: primaryImage {\n          ...ProseCardImg\n        }\n      }\n    }\n  }\n": types.FeatureBlockDetailsFragmentDoc,
    "\n  fragment FeaturedTextBlockDetails on FeaturedTextBlock {\n    __typename\n    id\n    title\n    hideTitle\n    body\n    backgroundColour\n  }\n": types.FeaturedTextBlockDetailsFragmentDoc,
    "\n  fragment HeaderBlockDetails on HeaderBlock {\n    __typename\n    title\n    summary\n    hideTitle\n    primaryImage {\n      ...ArticleBanner\n    }\n  }\n": types.HeaderBlockDetailsFragmentDoc,
    "\n  fragment MediaBlockDetails on MediaBlock {\n    __typename\n    id\n    mediaTitle: title\n    body\n    optionalImg: primaryImage {\n      file {\n        mobile: thumbor(width: 500, height: 400)\n      }\n      title\n      description\n    }\n    reverse\n    subtitle\n    backgroundColour\n    roundImage\n    callToAction {\n      label\n      url\n    }\n  }\n": types.MediaBlockDetailsFragmentDoc,
    "\n  fragment MediaCountBlockDetails on MediaCountBlock {\n    __typename\n    id\n    mediaTitle: title\n    body\n    optionalImg: primaryImage {\n      file {\n        mobile: thumbor(width: 500, height: 400)\n      }\n      title\n      description\n    }\n    reverse\n    subtitle\n    titleCountPart\n    backgroundColour\n    roundImage\n    callToAction {\n      label\n      url\n    }\n  }\n": types.MediaCountBlockDetailsFragmentDoc,
    "\n  fragment TextBlockDetails on TextBlock {\n    title\n    body\n    hideTitle\n    id\n    backgroundColour\n  }\n": types.TextBlockDetailsFragmentDoc,
    "\n  query OrganizationPreview($key: ID!) {\n    organization(key: $key) {\n      title\n      created\n      contacts {\n        email\n        firstName\n        lastName\n      }\n      description\n    }\n  }\n": types.OrganizationPreviewDocument,
    "\n  query TaiwanNode($identifier: String!) {\n    nodeSearch(identifierType: GBIF_PARTICIPANT, identifier: $identifier) {\n      results {\n        key\n        participantTitle\n        participationStatus\n        title\n      }\n    }\n  }\n": types.TaiwanNodeDocument,
    "\n  query NodeCountry($countryCode: String!) {\n    nodeCountry(countryCode: $countryCode) {\n      key\n      participantTitle\n      participationStatus\n      title\n    }\n  }\n": types.NodeCountryDocument,
    "\n  query NonCountryNode($identifier: String!) {\n    nodeSearch(identifierType: GBIF_PARTICIPANT, identifier: $identifier) {\n      results {\n        key\n        participantTitle\n      }\n    }\n  }\n": types.NonCountryNodeDocument,
    "\n  query Participants {\n    participantSearch(limit: 1000, type: COUNTRY) {\n      endOfRecords\n      results {\n        id\n        name\n        countryCode\n        participationStatus\n      }\n    }\n  }\n": types.ParticipantsDocument,
    "\n  fragment CompositionPage on Composition {\n    id\n    maybeTitle: title\n    summary\n    excerpt\n    blocks {\n      ...BlockItemDetails\n    }\n  }\n": types.CompositionPageFragmentDoc,
    "\n  fragment ProseCardImg on AssetImage {\n    file {\n      mobile: thumbor(width: 500, height: 400)\n    }\n    title\n    description\n  }\n": types.ProseCardImgFragmentDoc,
    "\n  fragment ResourceRedirectDetails on Resource {\n    __typename\n    ... on Article {\n      id\n      title\n      urlAlias\n    }\n    ... on Composition {\n      id\n      maybeTitle: title\n      urlAlias\n    }\n    ... on DataUse {\n      id\n      title\n    }\n    ... on Document {\n      id\n      title\n    }\n    ... on Event {\n      id\n      title\n    }\n    ... on News {\n      id\n      title\n    }\n    ... on Programme {\n      id\n      title\n    }\n    ... on GbifProject {\n      id\n      title\n    }\n    ... on Tool {\n      id\n      title\n    }\n  }\n": types.ResourceRedirectDetailsFragmentDoc,
    "\n  fragment DataUsePage on DataUse {\n    id\n    title\n    summary\n    resourceUsed\n    excerpt\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    countriesOfCoverage\n    topics\n    purposes\n    audiences\n    citation\n    createdAt\n  }\n": types.DataUsePageFragmentDoc,
    "\n  fragment DocumentPage on Document {\n    id\n    title\n    createdAt\n    excerpt\n    summary\n    primaryLink {\n      label\n      url\n    }\n    document {\n      title\n      description\n      file {\n        fileName\n        url\n      }\n    }\n    body\n    citation\n  }\n": types.DocumentPageFragmentDoc,
    "\n  fragment EventResult on Event {\n    id\n    title\n    excerpt\n    country\n    location\n    venue\n    start\n    end\n    primaryLink {\n      url\n    }\n    gbifsAttendee\n    allDayEvent\n  }\n": types.EventResultFragmentDoc,
    "\n  fragment EventPage on Event {\n    id\n    title\n    summary\n    excerpt\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    location\n    country\n    start\n    end\n    eventLanguage\n    venue\n    allDayEvent\n    documents {\n      ...DocumentPreview\n    }\n  }\n": types.EventPageFragmentDoc,
    "\n  fragment NewsResult on News {\n    id\n    title\n    excerpt\n    primaryImage {\n      file {\n        url: thumbor(width: 300, height: 150)\n      }\n    }\n    createdAt\n  }\n": types.NewsResultFragmentDoc,
    "\n  fragment NewsPage on News {\n    id\n    title\n    summary\n    excerpt\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    countriesOfCoverage\n    topics\n    purposes\n    audiences\n    citation\n    createdAt\n  }\n": types.NewsPageFragmentDoc,
    "\n  fragment ProgrammePage on Programme {\n    title\n    excerpt\n    blocks {\n      ...BlockItemDetails\n    }\n    ...ProgrammeFundingBanner\n  }\n": types.ProgrammePageFragmentDoc,
    "\n  fragment ProjectAboutTab on GbifProject {\n    projectId\n    id\n    body\n    start\n    end\n    status\n    fundsAllocated\n    matchingFunds\n    grantType\n    purposes\n    leadPartner {\n      ...ParticipantOrFundingOrganisationDetails\n    }\n    additionalPartners {\n      ...ParticipantOrFundingOrganisationDetails\n    }\n    leadContact\n    fundingOrganisations {\n      ...ParticipantOrFundingOrganisationDetails\n    }\n    programme {\n      fundingOrganisations {\n        ...ParticipantOrFundingOrganisationDetails\n      }\n    }\n    overrideProgrammeFunding {\n      ...ParticipantOrFundingOrganisationDetails\n    }\n    programme {\n      id\n      title\n    }\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    documents {\n      ...DocumentPreview\n    }\n  }\n": types.ProjectAboutTabFragmentDoc,
    "\n  fragment ParticipantOrFundingOrganisationDetails on ParticipantOrFundingOrganisation {\n    __typename\n    ... on FundingOrganisation {\n      id\n      title\n      url\n    }\n    ... on Participant {\n      id\n      title\n    }\n  }\n": types.ParticipantOrFundingOrganisationDetailsFragmentDoc,
    "\n  fragment ProjectDatasetsTab on Query {\n    gbifProject(id: $key) {\n      projectId\n    }\n    datasetsHelp: help(identifier: \"how-to-link-datasets-to-my-project-page\") {\n      title\n    }\n  }\n": types.ProjectDatasetsTabFragmentDoc,
    "\n  query ProjectDatasets($projectId: ID!) {\n    datasetSearch(projectId: [$projectId], limit: 500) {\n      count\n      limit\n      offset\n      results {\n        ...DatasetResult\n      }\n    }\n  }\n": types.ProjectDatasetsDocument,
    "\n  query ProjectNewsAndEvents($key: String!) {\n    gbifProject(id: $key) {\n      news {\n        __typename\n        createdAt\n        ...NewsResult\n      }\n      events {\n        __typename\n        start\n        ...EventResult\n      }\n    }\n    help(identifier: \"how-to-add-events-to-my-project-page\") {\n      title\n    }\n  }\n": types.ProjectNewsAndEventsDocument,
    "\n  fragment ProjectPage on GbifProject {\n    # Define the values used by this page\n    title\n    excerpt\n    status\n    start\n    end\n    fundsAllocated\n    primaryLink {\n      label\n      url\n    }\n    ...ProjectFundingBanner\n    # The Project About tab uses the data from this loader and defines its own data needs in this fragment\n    ...ProjectAboutTab\n  }\n": types.ProjectPageFragmentDoc,
    "\n    query Project($key: String!) {\n      resource(id: $key) {\n        ...ResourceRedirectDetails\n        ... on GbifProject {\n          ...ProjectPage\n        }\n      }\n      # The Project Datasets tab also uses some data from this loader and defines its own data needs in this fragment\n      ...ProjectDatasetsTab\n    }\n  ": types.ProjectDocument,
    "\n  fragment ToolPage on Tool {\n    id\n    title\n    summary\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    citation\n    createdAt\n    author\n    rights\n    rightsHolder\n    publicationDate\n  }\n": types.ToolPageFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Header {\n    gbifHome {\n      title\n      summary\n      children {\n        externalLink\n        link\n        title\n        children {\n          externalLink\n          link\n          title\n          children {\n            externalLink\n            link\n            title\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Header {\n    gbifHome {\n      title\n      summary\n      children {\n        externalLink\n        link\n        title\n        children {\n          externalLink\n          link\n          title\n          children {\n            externalLink\n            link\n            title\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HelpText($identifier: String!, $locale: String) {\n    help(identifier: $identifier, locale: $locale) {\n      id\n      identifier\n      title\n      body\n    }\n  }\n"): (typeof documents)["\n  query HelpText($identifier: String!, $locale: String) {\n    help(identifier: $identifier, locale: $locale) {\n      id\n      identifier\n      title\n      body\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HelpTitle($identifier: String!, $locale: String) {\n    help(identifier: $identifier, locale: $locale) {\n      id\n      identifier\n      title\n    }\n  }\n"): (typeof documents)["\n  query HelpTitle($identifier: String!, $locale: String) {\n    help(identifier: $identifier, locale: $locale) {\n      id\n      identifier\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ParticipantSelect($type: NodeType, $participationStatus: ParticipationStatus, $limit: Int) {\n    participantSearch(type: $type, participationStatus: $participationStatus, limit: $limit) {\n      endOfRecords\n      count\n      results {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ParticipantSelect($type: NodeType, $participationStatus: ParticipationStatus, $limit: Int) {\n    participantSearch(type: $type, participationStatus: $participationStatus, limit: $limit) {\n      endOfRecords\n      count\n      results {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment DatasetResult on DatasetSearchStub {\n    key\n    title\n    excerpt\n    type\n    publishingOrganizationTitle\n    recordCount\n    license\n  }\n"): (typeof documents)["\n  fragment DatasetResult on DatasetSearchStub {\n    key\n    title\n    excerpt\n    type\n    publishingOrganizationTitle\n    recordCount\n    license\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Dataset($key: ID!) {\n    dataset(key: $key) {\n      title\n      type\n      deleted\n      created\n      publishingOrganizationKey\n      publishingOrganizationTitle\n\n      contactsCitation {\n        key\n        abbreviatedName\n        firstName\n        lastName\n        userId\n        roles\n      }\n    }\n  }\n"): (typeof documents)["\n  query Dataset($key: ID!) {\n    dataset(key: $key) {\n      title\n      type\n      deleted\n      created\n      publishingOrganizationKey\n      publishingOrganizationTitle\n\n      contactsCitation {\n        key\n        abbreviatedName\n        firstName\n        lastName\n        userId\n        roles\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Occurrence($key: ID!) {\n    occurrence(key: $key) {\n      eventDate\n      scientificName\n      coordinates\n      dataset {\n        key\n        title\n      }\n    }\n  }\n"): (typeof documents)["\n  query Occurrence($key: ID!) {\n    occurrence(key: $key) {\n      eventDate\n      scientificName\n      coordinates\n      dataset {\n        key\n        title\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OccurrenceSearch($from: Int, $predicate: Predicate) {\n    occurrenceSearch(predicate: $predicate) {\n      documents(from: $from) {\n        from\n        size\n        total\n        results {\n          key\n          scientificName\n          eventDate\n          coordinates\n          county\n          basisOfRecord\n          datasetName\n          publisherTitle\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query OccurrenceSearch($from: Int, $predicate: Predicate) {\n    occurrenceSearch(predicate: $predicate) {\n      documents(from: $from) {\n        from\n        size\n        total\n        results {\n          key\n          scientificName\n          eventDate\n          coordinates\n          county\n          basisOfRecord\n          datasetName\n          publisherTitle\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Publisher($key: ID!) {\n    publisher: organization(key: $key) {\n      title\n    }\n  }\n"): (typeof documents)["\n  query Publisher($key: ID!) {\n    publisher: organization(key: $key) {\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AliasHandling($alias: String!) {\n    resource(alias: $alias) {\n      ...ResourceRedirectDetails\n    }\n  }\n"): (typeof documents)["\n  query AliasHandling($alias: String!) {\n    resource(alias: $alias) {\n      ...ResourceRedirectDetails\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ArticlePage on Article {\n    id\n    title\n    summary\n    excerpt\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    documents {\n      ...DocumentPreview\n    }\n    topics\n    purposes\n    audiences\n    citation\n    createdAt\n  }\n"): (typeof documents)["\n  fragment ArticlePage on Article {\n    id\n    title\n    summary\n    excerpt\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    documents {\n      ...DocumentPreview\n    }\n    topics\n    purposes\n    audiences\n    citation\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ArticleBanner on AssetImage {\n    description\n    title\n    file {\n      url\n      details {\n        image {\n          width\n          height\n        }\n      }\n      normal: thumbor(width: 1200, height: 500)\n      mobile: thumbor(width: 800, height: 400)\n    }\n  }\n"): (typeof documents)["\n  fragment ArticleBanner on AssetImage {\n    description\n    title\n    file {\n      url\n      details {\n        image {\n          width\n          height\n        }\n      }\n      normal: thumbor(width: 1200, height: 500)\n      mobile: thumbor(width: 800, height: 400)\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment DocumentPreview on DocumentAsset {\n    title\n    file {\n      url\n      fileName\n      contentType\n      volatile_documentType\n      details {\n        size\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment DocumentPreview on DocumentAsset {\n    title\n    file {\n      url\n      fileName\n      contentType\n      volatile_documentType\n      details {\n        size\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FundingOrganisationDetails on FundingOrganisation {\n    id\n    title\n    url\n    logo {\n      title\n      file {\n        url\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment FundingOrganisationDetails on FundingOrganisation {\n    id\n    title\n    url\n    logo {\n      title\n      file {\n        url\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProgrammeFundingBanner on Programme {\n    __typename\n    fundingOrganisations {\n      ...FundingOrganisationDetails\n    }\n  }\n"): (typeof documents)["\n  fragment ProgrammeFundingBanner on Programme {\n    __typename\n    fundingOrganisations {\n      ...FundingOrganisationDetails\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProjectFundingBanner on GbifProject {\n    __typename\n    fundsAllocated\n    programme {\n      ...ProgrammeFundingBanner\n    }\n    overrideProgrammeFunding {\n      ...FundingOrganisationDetails\n    }\n  }\n"): (typeof documents)["\n  fragment ProjectFundingBanner on GbifProject {\n    __typename\n    fundsAllocated\n    programme {\n      ...ProgrammeFundingBanner\n    }\n    overrideProgrammeFunding {\n      ...FundingOrganisationDetails\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BlockItemDetails on BlockItem {\n    __typename\n    ... on HeaderBlock {\n      id\n      ...HeaderBlockDetails\n    }\n    ... on FeatureBlock {\n      id\n      ...FeatureBlockDetails\n    }\n    ... on FeaturedTextBlock {\n      id\n      ...FeaturedTextBlockDetails\n    }\n    ... on CarouselBlock {\n      id\n      ...CarouselBlockDetails\n    }\n    ... on MediaBlock {\n      id\n      ...MediaBlockDetails\n    }\n    ... on MediaCountBlock {\n      id\n      ...MediaCountBlockDetails\n    }\n    ... on CustomComponentBlock {\n      id\n      ...CustomComponentBlockDetails\n    }\n    ... on TextBlock {\n      id\n      ...TextBlockDetails\n    }\n  }\n"): (typeof documents)["\n  fragment BlockItemDetails on BlockItem {\n    __typename\n    ... on HeaderBlock {\n      id\n      ...HeaderBlockDetails\n    }\n    ... on FeatureBlock {\n      id\n      ...FeatureBlockDetails\n    }\n    ... on FeaturedTextBlock {\n      id\n      ...FeaturedTextBlockDetails\n    }\n    ... on CarouselBlock {\n      id\n      ...CarouselBlockDetails\n    }\n    ... on MediaBlock {\n      id\n      ...MediaBlockDetails\n    }\n    ... on MediaCountBlock {\n      id\n      ...MediaCountBlockDetails\n    }\n    ... on CustomComponentBlock {\n      id\n      ...CustomComponentBlockDetails\n    }\n    ... on TextBlock {\n      id\n      ...TextBlockDetails\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CarouselBlockDetails on CarouselBlock {\n    __typename\n    id\n    title\n    body\n    backgroundColour\n    features {\n      __typename\n      ... on MediaBlock {\n        ...MediaBlockDetails\n      }\n      ... on MediaCountBlock {\n        ...MediaCountBlockDetails\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment CarouselBlockDetails on CarouselBlock {\n    __typename\n    id\n    title\n    body\n    backgroundColour\n    features {\n      __typename\n      ... on MediaBlock {\n        ...MediaBlockDetails\n      }\n      ... on MediaCountBlock {\n        ...MediaCountBlockDetails\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CustomComponentBlockDetails on CustomComponentBlock {\n    id\n    componentType\n    title\n    width\n    backgroundColour\n    settings\n  }\n"): (typeof documents)["\n  fragment CustomComponentBlockDetails on CustomComponentBlock {\n    id\n    componentType\n    title\n    width\n    backgroundColour\n    settings\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FeatureBlockDetails on FeatureBlock {\n    __typename\n    maxPerRow\n    title\n    hideTitle\n    body\n    backgroundColour\n    features {\n      __typename\n      ... on Feature {\n        id\n        title\n        url\n        primaryImage {\n          ...ProseCardImg\n        }\n      }\n      ... on News {\n        id\n        title\n        optionalImg: primaryImage {\n          ...ProseCardImg\n        }\n      }\n      ... on DataUse {\n        id\n        title\n        optionalImg: primaryImage {\n          ...ProseCardImg\n        }\n      }\n      ... on Event {\n        id\n        title\n        start\n        end\n        optionalImg: primaryImage {\n          ...ProseCardImg\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment FeatureBlockDetails on FeatureBlock {\n    __typename\n    maxPerRow\n    title\n    hideTitle\n    body\n    backgroundColour\n    features {\n      __typename\n      ... on Feature {\n        id\n        title\n        url\n        primaryImage {\n          ...ProseCardImg\n        }\n      }\n      ... on News {\n        id\n        title\n        optionalImg: primaryImage {\n          ...ProseCardImg\n        }\n      }\n      ... on DataUse {\n        id\n        title\n        optionalImg: primaryImage {\n          ...ProseCardImg\n        }\n      }\n      ... on Event {\n        id\n        title\n        start\n        end\n        optionalImg: primaryImage {\n          ...ProseCardImg\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FeaturedTextBlockDetails on FeaturedTextBlock {\n    __typename\n    id\n    title\n    hideTitle\n    body\n    backgroundColour\n  }\n"): (typeof documents)["\n  fragment FeaturedTextBlockDetails on FeaturedTextBlock {\n    __typename\n    id\n    title\n    hideTitle\n    body\n    backgroundColour\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment HeaderBlockDetails on HeaderBlock {\n    __typename\n    title\n    summary\n    hideTitle\n    primaryImage {\n      ...ArticleBanner\n    }\n  }\n"): (typeof documents)["\n  fragment HeaderBlockDetails on HeaderBlock {\n    __typename\n    title\n    summary\n    hideTitle\n    primaryImage {\n      ...ArticleBanner\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MediaBlockDetails on MediaBlock {\n    __typename\n    id\n    mediaTitle: title\n    body\n    optionalImg: primaryImage {\n      file {\n        mobile: thumbor(width: 500, height: 400)\n      }\n      title\n      description\n    }\n    reverse\n    subtitle\n    backgroundColour\n    roundImage\n    callToAction {\n      label\n      url\n    }\n  }\n"): (typeof documents)["\n  fragment MediaBlockDetails on MediaBlock {\n    __typename\n    id\n    mediaTitle: title\n    body\n    optionalImg: primaryImage {\n      file {\n        mobile: thumbor(width: 500, height: 400)\n      }\n      title\n      description\n    }\n    reverse\n    subtitle\n    backgroundColour\n    roundImage\n    callToAction {\n      label\n      url\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MediaCountBlockDetails on MediaCountBlock {\n    __typename\n    id\n    mediaTitle: title\n    body\n    optionalImg: primaryImage {\n      file {\n        mobile: thumbor(width: 500, height: 400)\n      }\n      title\n      description\n    }\n    reverse\n    subtitle\n    titleCountPart\n    backgroundColour\n    roundImage\n    callToAction {\n      label\n      url\n    }\n  }\n"): (typeof documents)["\n  fragment MediaCountBlockDetails on MediaCountBlock {\n    __typename\n    id\n    mediaTitle: title\n    body\n    optionalImg: primaryImage {\n      file {\n        mobile: thumbor(width: 500, height: 400)\n      }\n      title\n      description\n    }\n    reverse\n    subtitle\n    titleCountPart\n    backgroundColour\n    roundImage\n    callToAction {\n      label\n      url\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TextBlockDetails on TextBlock {\n    title\n    body\n    hideTitle\n    id\n    backgroundColour\n  }\n"): (typeof documents)["\n  fragment TextBlockDetails on TextBlock {\n    title\n    body\n    hideTitle\n    id\n    backgroundColour\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OrganizationPreview($key: ID!) {\n    organization(key: $key) {\n      title\n      created\n      contacts {\n        email\n        firstName\n        lastName\n      }\n      description\n    }\n  }\n"): (typeof documents)["\n  query OrganizationPreview($key: ID!) {\n    organization(key: $key) {\n      title\n      created\n      contacts {\n        email\n        firstName\n        lastName\n      }\n      description\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TaiwanNode($identifier: String!) {\n    nodeSearch(identifierType: GBIF_PARTICIPANT, identifier: $identifier) {\n      results {\n        key\n        participantTitle\n        participationStatus\n        title\n      }\n    }\n  }\n"): (typeof documents)["\n  query TaiwanNode($identifier: String!) {\n    nodeSearch(identifierType: GBIF_PARTICIPANT, identifier: $identifier) {\n      results {\n        key\n        participantTitle\n        participationStatus\n        title\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NodeCountry($countryCode: String!) {\n    nodeCountry(countryCode: $countryCode) {\n      key\n      participantTitle\n      participationStatus\n      title\n    }\n  }\n"): (typeof documents)["\n  query NodeCountry($countryCode: String!) {\n    nodeCountry(countryCode: $countryCode) {\n      key\n      participantTitle\n      participationStatus\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NonCountryNode($identifier: String!) {\n    nodeSearch(identifierType: GBIF_PARTICIPANT, identifier: $identifier) {\n      results {\n        key\n        participantTitle\n      }\n    }\n  }\n"): (typeof documents)["\n  query NonCountryNode($identifier: String!) {\n    nodeSearch(identifierType: GBIF_PARTICIPANT, identifier: $identifier) {\n      results {\n        key\n        participantTitle\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Participants {\n    participantSearch(limit: 1000, type: COUNTRY) {\n      endOfRecords\n      results {\n        id\n        name\n        countryCode\n        participationStatus\n      }\n    }\n  }\n"): (typeof documents)["\n  query Participants {\n    participantSearch(limit: 1000, type: COUNTRY) {\n      endOfRecords\n      results {\n        id\n        name\n        countryCode\n        participationStatus\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CompositionPage on Composition {\n    id\n    maybeTitle: title\n    summary\n    excerpt\n    blocks {\n      ...BlockItemDetails\n    }\n  }\n"): (typeof documents)["\n  fragment CompositionPage on Composition {\n    id\n    maybeTitle: title\n    summary\n    excerpt\n    blocks {\n      ...BlockItemDetails\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProseCardImg on AssetImage {\n    file {\n      mobile: thumbor(width: 500, height: 400)\n    }\n    title\n    description\n  }\n"): (typeof documents)["\n  fragment ProseCardImg on AssetImage {\n    file {\n      mobile: thumbor(width: 500, height: 400)\n    }\n    title\n    description\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ResourceRedirectDetails on Resource {\n    __typename\n    ... on Article {\n      id\n      title\n      urlAlias\n    }\n    ... on Composition {\n      id\n      maybeTitle: title\n      urlAlias\n    }\n    ... on DataUse {\n      id\n      title\n    }\n    ... on Document {\n      id\n      title\n    }\n    ... on Event {\n      id\n      title\n    }\n    ... on News {\n      id\n      title\n    }\n    ... on Programme {\n      id\n      title\n    }\n    ... on GbifProject {\n      id\n      title\n    }\n    ... on Tool {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  fragment ResourceRedirectDetails on Resource {\n    __typename\n    ... on Article {\n      id\n      title\n      urlAlias\n    }\n    ... on Composition {\n      id\n      maybeTitle: title\n      urlAlias\n    }\n    ... on DataUse {\n      id\n      title\n    }\n    ... on Document {\n      id\n      title\n    }\n    ... on Event {\n      id\n      title\n    }\n    ... on News {\n      id\n      title\n    }\n    ... on Programme {\n      id\n      title\n    }\n    ... on GbifProject {\n      id\n      title\n    }\n    ... on Tool {\n      id\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment DataUsePage on DataUse {\n    id\n    title\n    summary\n    resourceUsed\n    excerpt\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    countriesOfCoverage\n    topics\n    purposes\n    audiences\n    citation\n    createdAt\n  }\n"): (typeof documents)["\n  fragment DataUsePage on DataUse {\n    id\n    title\n    summary\n    resourceUsed\n    excerpt\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    countriesOfCoverage\n    topics\n    purposes\n    audiences\n    citation\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment DocumentPage on Document {\n    id\n    title\n    createdAt\n    excerpt\n    summary\n    primaryLink {\n      label\n      url\n    }\n    document {\n      title\n      description\n      file {\n        fileName\n        url\n      }\n    }\n    body\n    citation\n  }\n"): (typeof documents)["\n  fragment DocumentPage on Document {\n    id\n    title\n    createdAt\n    excerpt\n    summary\n    primaryLink {\n      label\n      url\n    }\n    document {\n      title\n      description\n      file {\n        fileName\n        url\n      }\n    }\n    body\n    citation\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventResult on Event {\n    id\n    title\n    excerpt\n    country\n    location\n    venue\n    start\n    end\n    primaryLink {\n      url\n    }\n    gbifsAttendee\n    allDayEvent\n  }\n"): (typeof documents)["\n  fragment EventResult on Event {\n    id\n    title\n    excerpt\n    country\n    location\n    venue\n    start\n    end\n    primaryLink {\n      url\n    }\n    gbifsAttendee\n    allDayEvent\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventPage on Event {\n    id\n    title\n    summary\n    excerpt\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    location\n    country\n    start\n    end\n    eventLanguage\n    venue\n    allDayEvent\n    documents {\n      ...DocumentPreview\n    }\n  }\n"): (typeof documents)["\n  fragment EventPage on Event {\n    id\n    title\n    summary\n    excerpt\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    location\n    country\n    start\n    end\n    eventLanguage\n    venue\n    allDayEvent\n    documents {\n      ...DocumentPreview\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NewsResult on News {\n    id\n    title\n    excerpt\n    primaryImage {\n      file {\n        url: thumbor(width: 300, height: 150)\n      }\n    }\n    createdAt\n  }\n"): (typeof documents)["\n  fragment NewsResult on News {\n    id\n    title\n    excerpt\n    primaryImage {\n      file {\n        url: thumbor(width: 300, height: 150)\n      }\n    }\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NewsPage on News {\n    id\n    title\n    summary\n    excerpt\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    countriesOfCoverage\n    topics\n    purposes\n    audiences\n    citation\n    createdAt\n  }\n"): (typeof documents)["\n  fragment NewsPage on News {\n    id\n    title\n    summary\n    excerpt\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    countriesOfCoverage\n    topics\n    purposes\n    audiences\n    citation\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProgrammePage on Programme {\n    title\n    excerpt\n    blocks {\n      ...BlockItemDetails\n    }\n    ...ProgrammeFundingBanner\n  }\n"): (typeof documents)["\n  fragment ProgrammePage on Programme {\n    title\n    excerpt\n    blocks {\n      ...BlockItemDetails\n    }\n    ...ProgrammeFundingBanner\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProjectAboutTab on GbifProject {\n    projectId\n    id\n    body\n    start\n    end\n    status\n    fundsAllocated\n    matchingFunds\n    grantType\n    purposes\n    leadPartner {\n      ...ParticipantOrFundingOrganisationDetails\n    }\n    additionalPartners {\n      ...ParticipantOrFundingOrganisationDetails\n    }\n    leadContact\n    fundingOrganisations {\n      ...ParticipantOrFundingOrganisationDetails\n    }\n    programme {\n      fundingOrganisations {\n        ...ParticipantOrFundingOrganisationDetails\n      }\n    }\n    overrideProgrammeFunding {\n      ...ParticipantOrFundingOrganisationDetails\n    }\n    programme {\n      id\n      title\n    }\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    documents {\n      ...DocumentPreview\n    }\n  }\n"): (typeof documents)["\n  fragment ProjectAboutTab on GbifProject {\n    projectId\n    id\n    body\n    start\n    end\n    status\n    fundsAllocated\n    matchingFunds\n    grantType\n    purposes\n    leadPartner {\n      ...ParticipantOrFundingOrganisationDetails\n    }\n    additionalPartners {\n      ...ParticipantOrFundingOrganisationDetails\n    }\n    leadContact\n    fundingOrganisations {\n      ...ParticipantOrFundingOrganisationDetails\n    }\n    programme {\n      fundingOrganisations {\n        ...ParticipantOrFundingOrganisationDetails\n      }\n    }\n    overrideProgrammeFunding {\n      ...ParticipantOrFundingOrganisationDetails\n    }\n    programme {\n      id\n      title\n    }\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    documents {\n      ...DocumentPreview\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ParticipantOrFundingOrganisationDetails on ParticipantOrFundingOrganisation {\n    __typename\n    ... on FundingOrganisation {\n      id\n      title\n      url\n    }\n    ... on Participant {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  fragment ParticipantOrFundingOrganisationDetails on ParticipantOrFundingOrganisation {\n    __typename\n    ... on FundingOrganisation {\n      id\n      title\n      url\n    }\n    ... on Participant {\n      id\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProjectDatasetsTab on Query {\n    gbifProject(id: $key) {\n      projectId\n    }\n    datasetsHelp: help(identifier: \"how-to-link-datasets-to-my-project-page\") {\n      title\n    }\n  }\n"): (typeof documents)["\n  fragment ProjectDatasetsTab on Query {\n    gbifProject(id: $key) {\n      projectId\n    }\n    datasetsHelp: help(identifier: \"how-to-link-datasets-to-my-project-page\") {\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProjectDatasets($projectId: ID!) {\n    datasetSearch(projectId: [$projectId], limit: 500) {\n      count\n      limit\n      offset\n      results {\n        ...DatasetResult\n      }\n    }\n  }\n"): (typeof documents)["\n  query ProjectDatasets($projectId: ID!) {\n    datasetSearch(projectId: [$projectId], limit: 500) {\n      count\n      limit\n      offset\n      results {\n        ...DatasetResult\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProjectNewsAndEvents($key: String!) {\n    gbifProject(id: $key) {\n      news {\n        __typename\n        createdAt\n        ...NewsResult\n      }\n      events {\n        __typename\n        start\n        ...EventResult\n      }\n    }\n    help(identifier: \"how-to-add-events-to-my-project-page\") {\n      title\n    }\n  }\n"): (typeof documents)["\n  query ProjectNewsAndEvents($key: String!) {\n    gbifProject(id: $key) {\n      news {\n        __typename\n        createdAt\n        ...NewsResult\n      }\n      events {\n        __typename\n        start\n        ...EventResult\n      }\n    }\n    help(identifier: \"how-to-add-events-to-my-project-page\") {\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProjectPage on GbifProject {\n    # Define the values used by this page\n    title\n    excerpt\n    status\n    start\n    end\n    fundsAllocated\n    primaryLink {\n      label\n      url\n    }\n    ...ProjectFundingBanner\n    # The Project About tab uses the data from this loader and defines its own data needs in this fragment\n    ...ProjectAboutTab\n  }\n"): (typeof documents)["\n  fragment ProjectPage on GbifProject {\n    # Define the values used by this page\n    title\n    excerpt\n    status\n    start\n    end\n    fundsAllocated\n    primaryLink {\n      label\n      url\n    }\n    ...ProjectFundingBanner\n    # The Project About tab uses the data from this loader and defines its own data needs in this fragment\n    ...ProjectAboutTab\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Project($key: String!) {\n      resource(id: $key) {\n        ...ResourceRedirectDetails\n        ... on GbifProject {\n          ...ProjectPage\n        }\n      }\n      # The Project Datasets tab also uses some data from this loader and defines its own data needs in this fragment\n      ...ProjectDatasetsTab\n    }\n  "): (typeof documents)["\n    query Project($key: String!) {\n      resource(id: $key) {\n        ...ResourceRedirectDetails\n        ... on GbifProject {\n          ...ProjectPage\n        }\n      }\n      # The Project Datasets tab also uses some data from this loader and defines its own data needs in this fragment\n      ...ProjectDatasetsTab\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ToolPage on Tool {\n    id\n    title\n    summary\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    citation\n    createdAt\n    author\n    rights\n    rightsHolder\n    publicationDate\n  }\n"): (typeof documents)["\n  fragment ToolPage on Tool {\n    id\n    title\n    summary\n    body\n    primaryImage {\n      ...ArticleBanner\n    }\n    primaryLink {\n      label\n      url\n    }\n    secondaryLinks {\n      label\n      url\n    }\n    citation\n    createdAt\n    author\n    rights\n    rightsHolder\n    publicationDate\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;