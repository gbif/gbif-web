/**
 * Be aware that this query is being used server side to prepopulate the cache.
 * See packages/gbif-org/gbif/routes/proxy/proxy.mjs
 */
export const HEADER_QUERY = /* GraphQL */ `
  query Header {
    gbifHome {
      title
      summary
      children {
        id
        externalLink
        link
        title
        children {
          id
          externalLink
          link
          title
          children {
            id
            externalLink
            link
            title
          }
        }
      }
    }
  }
`;
