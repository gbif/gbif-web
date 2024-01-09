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
    "\n  query Dataset($key: ID!) {\n    dataset(key: $key) {\n      title\n      publishingOrganizationKey\n      publishingOrganizationTitle\n    }\n  }\n": types.DatasetDocument,
    "\n  query Occurrence($key: ID!) {\n    occurrence(key: $key) {\n      eventDate\n      scientificName\n      coordinates\n      dataset {\n        key\n        title\n      }\n    }\n  }\n": types.OccurrenceDocument,
    "\n  query OccurrenceSearch($from: Int, $predicate: Predicate) {\n    occurrenceSearch(predicate: $predicate) {\n      documents(from: $from) {\n        from\n        size\n        total\n        results {\n          key\n          scientificName\n          eventDate\n          coordinates\n          county\n          basisOfRecord\n          datasetName\n          publisherTitle\n        }\n      }\n    }\n  }\n": types.OccurrenceSearchDocument,
    "\n  query Publisher($key: ID!) {\n    publisher: organization(key: $key) {\n      title\n    }\n  }\n": types.PublisherDocument,
    "\n  query Article($key: String!) {\n    article(id: $key) {\n      id\n      title\n      summary\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      topics\n      purposes\n      audiences\n      citation\n      createdAt\n    }\n  }\n": types.ArticleDocument,
    "\n  query DataUse($key: String!) {\n    dataUse(id: $key) {\n      id\n      title\n      summary\n      resourceUsed\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      primaryLink {\n        label\n        url\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      countriesOfCoverage\n      topics\n      purposes\n      audiences\n      citation\n      createdAt\n    }\n  }\n": types.DataUseDocument,
    "\n  query Event($key: String!) {\n    event(id: $key) {\n      id\n      title\n      summary\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      primaryLink {\n        label\n        url\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      location\n      country\n      start\n      end\n      eventLanguage\n      venue\n    }\n  }\n": types.EventDocument,
    "\n  query News($key: String!) {\n    news(id: $key) {\n      id\n      title\n      summary\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      primaryLink {\n        label\n        url\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      countriesOfCoverage\n      topics\n      purposes\n      audiences\n      citation\n      createdAt\n    }\n  }\n": types.NewsDocument,
    "\n  query Tool($key: String!) {\n    tool(id: $key) {\n      id\n      title\n      summary\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      primaryLink {\n        label\n        url\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      citation\n      createdAt\n    }\n  }\n": types.ToolDocument,
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
export function graphql(source: "\n  query Dataset($key: ID!) {\n    dataset(key: $key) {\n      title\n      publishingOrganizationKey\n      publishingOrganizationTitle\n    }\n  }\n"): (typeof documents)["\n  query Dataset($key: ID!) {\n    dataset(key: $key) {\n      title\n      publishingOrganizationKey\n      publishingOrganizationTitle\n    }\n  }\n"];
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
export function graphql(source: "\n  query Article($key: String!) {\n    article(id: $key) {\n      id\n      title\n      summary\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      topics\n      purposes\n      audiences\n      citation\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query Article($key: String!) {\n    article(id: $key) {\n      id\n      title\n      summary\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      topics\n      purposes\n      audiences\n      citation\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DataUse($key: String!) {\n    dataUse(id: $key) {\n      id\n      title\n      summary\n      resourceUsed\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      primaryLink {\n        label\n        url\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      countriesOfCoverage\n      topics\n      purposes\n      audiences\n      citation\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query DataUse($key: String!) {\n    dataUse(id: $key) {\n      id\n      title\n      summary\n      resourceUsed\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      primaryLink {\n        label\n        url\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      countriesOfCoverage\n      topics\n      purposes\n      audiences\n      citation\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Event($key: String!) {\n    event(id: $key) {\n      id\n      title\n      summary\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      primaryLink {\n        label\n        url\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      location\n      country\n      start\n      end\n      eventLanguage\n      venue\n    }\n  }\n"): (typeof documents)["\n  query Event($key: String!) {\n    event(id: $key) {\n      id\n      title\n      summary\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      primaryLink {\n        label\n        url\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      location\n      country\n      start\n      end\n      eventLanguage\n      venue\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query News($key: String!) {\n    news(id: $key) {\n      id\n      title\n      summary\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      primaryLink {\n        label\n        url\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      countriesOfCoverage\n      topics\n      purposes\n      audiences\n      citation\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query News($key: String!) {\n    news(id: $key) {\n      id\n      title\n      summary\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      primaryLink {\n        label\n        url\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      countriesOfCoverage\n      topics\n      purposes\n      audiences\n      citation\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Tool($key: String!) {\n    tool(id: $key) {\n      id\n      title\n      summary\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      primaryLink {\n        label\n        url\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      citation\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query Tool($key: String!) {\n    tool(id: $key) {\n      id\n      title\n      summary\n      body\n      primaryImage {\n        file {\n          url\n          normal: thumbor(width: 1200, height: 500)\n          mobile: thumbor(width: 800, height: 400)\n        }\n        description\n        title\n      }\n      primaryLink {\n        label\n        url\n      }\n      secondaryLinks {\n        label\n        url\n      }\n      citation\n      createdAt\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;