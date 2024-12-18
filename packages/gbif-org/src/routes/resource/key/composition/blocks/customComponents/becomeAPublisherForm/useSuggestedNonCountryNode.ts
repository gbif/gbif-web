import { useConfig } from '@/config/config';
import { NonCountryNodeQuery, NonCountryNodeQueryVariables } from '@/gql/graphql';
import { useI18n } from '@/reactRouterPlugins';
import { GraphQLService } from '@/services/graphQLService';
import { useCallback, useState } from 'react';

const NON_COUNTRY_NODE_QUERY = /* GraphQL */ `
  query NonCountryNode($identifier: String!) {
    nodeSearch(identifierType: GBIF_PARTICIPANT, identifier: $identifier) {
      results {
        key
        participantTitle
      }
    }
  }
`;

export type SuggestedNonCountryNode = {
  key: string;
  title: string;
};

export function useSuggestedNonCountryNode() {
  const { graphqlEndpoint } = useConfig();
  const { locale } = useI18n();
  const [suggestedNonCountryNode, setSuggestedNonCountryNode] = useState<
    SuggestedNonCountryNode | undefined
  >();

  const updateSuggestedNonCountryNode = useCallback(
    async (identifier: string) => {
      const graphqlService = new GraphQLService({
        endpoint: graphqlEndpoint,
        locale: locale.cmsLocale || locale.code,
      });

      const node = await graphqlService
        .query<NonCountryNodeQuery, NonCountryNodeQueryVariables>(NON_COUNTRY_NODE_QUERY, {
          identifier,
        })
        .then((response) => response.json())
        .then((json) => json.data.nodeSearch?.results[0]);

      if (node && node.participantTitle) {
        setSuggestedNonCountryNode({
          key: node.key,
          title: node.participantTitle,
        });
      } else {
        setSuggestedNonCountryNode(undefined);
      }
    },
    [graphqlEndpoint, locale.cmsLocale, locale.code]
  );

  return { suggestedNonCountryNode, updateSuggestedNonCountryNode };
}
