import { gql } from 'apollo-server';
import {
  KNOWN_BLOCK_TYPES,
  KNOWN_CAROUSEL_BLOCKS,
  KNOWN_FEATURE_TYPES,
} from './acceptedTypes';

const typeDef = gql`
  extend type Query {
    composition(id: String!): Composition
  }

  type Composition {
    id: ID!
    title: String!
    excerpt: String
    summary: String
    createdAt: DateTime!
    # TODO: Add blocks when the changes has been made in the API
    updatedAt: DateTime
    primaryImage: AssetImage
    keywords: [String]
    urlAlias: String
    machineIdentifier: String
    blocks: [BlockItem!]
  }

  union BlockItem = ${Object.values(KNOWN_BLOCK_TYPES).join(' | ')}

  type HeaderBlock {
    summary: String
    id: ID!
    title: String
    type: String
    contentType: String
    primaryImage: AssetImage
    hideTitle: Boolean
  }

  type TextBlock {
    title: String
    body: String
    hideTitle: Boolean
    id: ID!
    backgroundColour: String
    contentType: String
  }

  type FeatureBlock {
    id: ID!
    title: String
    body: String
    hideTitle: Boolean
    maxPerRow: Int
    backgroundColour: String
    contentType: String
    features: [FeatureItem!]
  }

  type FeaturedTextBlock {
    id: ID!
    title: String
    body: String
    backgroundColour: String
    contentType: String
    primaryImage: AssetImage
    hideTitle: Boolean
  }

  type CarouselBlock {
    id: ID!
    title: String
    body: String
    backgroundColour: String
    contentType: String
    features: [CarouselBlockFeature!]
  }

  type MediaBlock {
    id: ID!
    title: String!
    body: String
    reverse: Boolean
    subtitle: String
    backgroundColour: String
    contentType: String
    roundImage: Boolean
    callToAction: [Link!]
    primaryImage: AssetImage
  }

  type MediaCountBlock {
    id: ID!
    title: String!
    body: String
    primaryImage: AssetImage
    reverse: Boolean
    subtitle: String
    titleCountPart: String!
    backgroundColour: String
    contentType: String
    roundImage: Boolean
    callToAction: [Link!]
  }

  type CustomComponentBlock {
    id: ID!
    componentType: String
    title: String
    width: String
    backgroundColour: String
    contentType: String
    settings: JSON
  }

  union FeatureItem = ${Object.values(KNOWN_FEATURE_TYPES).join(' | ')}

  type Feature {
    id: ID!
    title: String!
    url: String!
    primaryImage: AssetImage!
    contentType: String
  }

  union CarouselBlockFeature = ${Object.values(KNOWN_CAROUSEL_BLOCKS).join(
    ' | ',
  )}
`;

export default typeDef;
