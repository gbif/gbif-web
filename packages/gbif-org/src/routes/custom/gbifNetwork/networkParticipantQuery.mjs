/**
 * Be aware that this query is being used server side to prepopulate the cache for the network page.
 * Any breaking changes here should be reflected in packages/gbif-org/gbif/routes/proxy/proxy.mjs
 */
export const NETWORK_PARTICIPANTS_QUERY = /* GraphQL */ `
  query GbifNetworkParticipants {
    nodeSteeringGroup {
      name
      title
      institutionName
      address
      addressCountry
      email
      role
      contact {
        participants {
          id
          name
          gbifRegion
        }
      }
    }
    nodeSearch(limit: 1000) {
      results {
        type
        country
        identifiers {
          type
          identifier
        }
        participant {
          id
          participationStatus
          membershipStart
          name
          gbifRegion
          countryCode
        }
        contacts(type: ["HEAD_OF_DELEGATION", "NODE_MANAGER"]) {
          firstName
          lastName
          type
        }
      }
    }
  }
`;
