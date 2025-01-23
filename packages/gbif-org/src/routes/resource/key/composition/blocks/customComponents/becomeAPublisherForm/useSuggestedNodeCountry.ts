import { useConfig } from '@/config/config';
import {
  NodeCountryQuery,
  NodeCountryQueryVariables,
  TaiwanNodeQuery,
  TaiwanNodeQueryVariables,
} from '@/gql/graphql';
import { useI18n } from '@/reactRouterPlugins';
import { GraphQLService } from '@/services/graphQLService';
import { useCallback, useState } from 'react';

const TAIWAN_NODE_QUERY = /* GraphQL */ `
  query TaiwanNode($identifier: String!) {
    nodeSearch(identifierType: GBIF_PARTICIPANT, identifier: $identifier) {
      results {
        key
        participantTitle
        participationStatus
        title
      }
    }
  }
`;

const NODE_COUNTRY_QUERY = /* GraphQL */ `
  query NodeCountry($countryCode: String!) {
    nodeCountry(countryCode: $countryCode) {
      key
      participantTitle
      participationStatus
      title
    }
  }
`;

export type SuggestedNodeCountry = {
  key: string;
  title: string;
};

export function useSuggestedNodeCountry() {
  const { graphqlEndpoint } = useConfig();
  const { locale } = useI18n();
  const [suggestedNodeCountry, setSuggestedNodeCountry] = useState<
    SuggestedNodeCountry | undefined
  >();
  const config = useConfig();

  const updateSuggestedNodeCountry = useCallback(
    async (countryCode: string) => {
      const graphqlService = new GraphQLService({
        endpoint: graphqlEndpoint,
        locale: locale.cmsLocale || locale.localeCode,
      });

      const node =
        countryCode === 'TW'
          ? await graphqlService
              .query<TaiwanNodeQuery, TaiwanNodeQueryVariables>(TAIWAN_NODE_QUERY, {
                identifier: config.hardcodedKeys.taiwanNodeidentifier,
              })
              .then((response) => response.json())
              .then((json) => json.data.nodeSearch?.results[0])
          : await graphqlService
              .query<NodeCountryQuery, NodeCountryQueryVariables>(NODE_COUNTRY_QUERY, {
                countryCode,
              })
              .then((response) => response.json())
              .then((json) => json.data.nodeCountry);

      if (
        node &&
        node.participantTitle &&
        node.participationStatus !== 'OBSERVER' &&
        node.participationStatus !== 'FORMER'
      ) {
        let title = node.participantTitle;
        if (node.title) title += ` (${node.title})`;

        setSuggestedNodeCountry({
          key: node.key,
          title,
        });
      } else {
        setSuggestedNodeCountry(undefined);
      }
    },
    [
      graphqlEndpoint,
      locale.cmsLocale,
      locale.localeCode,
      setSuggestedNodeCountry,
      config.hardcodedKeys.taiwanNodeidentifier,
    ]
  );

  return {
    suggestedNodeCountry,
    updateSuggestedNodeCountry,
  };
}
