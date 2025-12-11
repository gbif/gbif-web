/**
 * Be aware that this query is being used server side to prepopulate the cache.
 * See packages/gbif-org/gbif/routes/proxy/proxy.mjs
 */
export const HOMEPAGE_QUERY = /* GraphQL */ `
  query HomePage {
    gbifHome {
      title
      summary
      primaryImage {
        file {
          url
          thumbor
        }
        title
        description
      }
      ...HomePageCountIcons
      blocks {
        ...BlockItemDetails
      }
    }
  }

  fragment HomePageCountIcons on Home {
    occurrenceIcon {
      file {
        url
      }
    }
    datasetIcon {
      file {
        url
      }
    }
    publisherIcon {
      file {
        url
      }
    }
    literatureIcon {
      file {
        url
      }
    }
  }

  fragment BlockItemDetails on BlockItem {
    __typename
    ... on HeaderBlock {
      id
      ...HeaderBlockDetails
    }
    ... on FeatureBlock {
      id
      ...FeatureBlockDetails
    }
    ... on FeaturedTextBlock {
      id
      ...FeaturedTextBlockDetails
    }
    ... on CarouselBlock {
      id
      ...CarouselBlockDetails
    }
    ... on MediaBlock {
      id
      ...MediaBlockDetails
    }
    ... on MediaCountBlock {
      id
      ...MediaCountBlockDetails
    }
    ... on CustomComponentBlock {
      id
      ...CustomComponentBlockDetails
    }
    ... on TextBlock {
      id
      ...TextBlockDetails
    }
  }

  fragment HeaderBlockDetails on HeaderBlock {
    __typename
    title
    summary
    hideTitle
    primaryImage {
      ...ArticleBanner
    }
  }

  fragment ArticleBanner on AssetImage {
    description
    title
    file {
      url
      details {
        image {
          width
          height
        }
      }
      normal: thumbor(width: 1200, height: 500)
      mobile: thumbor(width: 800, height: 400)
    }
  }

  fragment FeatureBlockDetails on FeatureBlock {
    __typename
    maxPerRow
    title
    hideTitle
    body
    backgroundColour
    features {
      __typename
      ... on Feature {
        id
        title
        comment
        url
        primaryImage {
          ...ProseCardImg
        }
      }
      ... on News {
        id
        title
        optionalImg: primaryImage {
          ...ProseCardImg
        }
      }
      ... on DataUse {
        id
        title
        optionalImg: primaryImage {
          ...ProseCardImg
        }
      }
      ... on MeetingEvent {
        id
        title
        start
        end
        optionalImg: primaryImage {
          ...ProseCardImg
        }
      }
    }
  }

  fragment ProseCardImg on AssetImage {
    file {
      mobile: thumbor(width: 500, height: 400)
    }
    title
    description
  }

  fragment FeaturedTextBlockDetails on FeaturedTextBlock {
    __typename
    id
    title
    hideTitle
    body
    backgroundColour
    primaryImage {
      file {
        url
      }
    }
  }

  fragment CarouselBlockDetails on CarouselBlock {
    __typename
    id
    title
    body
    backgroundColour
    features {
      __typename
      ... on MediaBlock {
        ...MediaBlockDetails
      }
      ... on MediaCountBlock {
        ...MediaCountBlockDetails
      }
    }
  }

  fragment MediaBlockDetails on MediaBlock {
    __typename
    id
    mediaTitle: title
    body
    optionalImg: primaryImage {
      file {
        url
      }
      title
      description
    }
    reverse
    subtitle
    backgroundColour
    roundImage
    callToAction {
      label
      url
    }
  }

  fragment MediaCountBlockDetails on MediaCountBlock {
    __typename
    id
    mediaTitle: title
    body
    optionalImg: primaryImage {
      file {
        mobile: thumbor(width: 500, height: 400)
      }
      title
      description
    }
    reverse
    subtitle
    titleCountPart
    backgroundColour
    roundImage
    callToAction {
      label
      url
    }
  }

  fragment CustomComponentBlockDetails on CustomComponentBlock {
    id
    componentType
    title
    width
    backgroundColour
    settings
  }

  fragment TextBlockDetails on TextBlock {
    title
    body
    hideTitle
    id
    backgroundColour
  }
`;
