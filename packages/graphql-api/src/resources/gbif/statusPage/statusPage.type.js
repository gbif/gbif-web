import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    statusPage: StatusPage @cacheControl(maxAge: 10, scope: PUBLIC)
  }

  type StatusPage {
    """
    Custom status page indicator showing notification status and color - not part of the official statuspage API, but used internally for hte gbif.org header
    """
    notificationIcon: StatusPageIndicator
  }

  type StatusPageIndicator {
    color: String!
    showNotification: Boolean!
    status: String!
  }
`;

export default typeDef;
