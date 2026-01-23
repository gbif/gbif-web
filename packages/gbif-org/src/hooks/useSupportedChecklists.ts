import { LanguageOption } from '@/config/config';
import { ChecklistMetadataQuery, ChecklistMetadataQueryVariables } from '@/gql/graphql';
import { useI18n } from '@/reactRouterPlugins';
import { GraphQLService } from '@/services/graphQLService';
import { useEffect, useState } from 'react';

const supportedChecklists =
  import.meta.env.PUBLIC_SUPPORTED_CHECKLISTS_FOR_DOWNLOAD?.split(',') || [];
const defaultVisibleChecklists =
  import.meta.env.PUBLIC_DEFAULT_VISIBLE_CHECKLISTS_FOR_DOWNLOAD?.split(',') || [];
const defaultChecklist =
  import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY || 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c'; // default backbone


export type ChecklistMetadata = {
  version: string;
  link: string;
};

export type Checklist = {
  key: string;
  title: string;
  alias: string;
  isDefault: boolean;
  isAlwaysVisible: boolean;
  metadata?: ChecklistMetadata;
};

async function getSupportedChecklists(locale: LanguageOption): Promise<Checklist[]> {
  const graphqlService = new GraphQLService({
    endpoint: import.meta.env.PUBLIC_GRAPHQL_ENDPOINT,
    locale: locale.cmsLocale || locale.localeCode,
  });
  const colKey = '7ddf754f-d193-4cc9-b351-99906754a03b';

  const colMetadataResponse = await graphqlService.query<ChecklistMetadataQuery, ChecklistMetadataQueryVariables>(CHECKLIST_METADATA_QUERY, { checklistKey: colKey })
    .then(response => response.json())
    .then(json => json.data?.checklistMetadata?.mainIndex);

  const colMetadata: ChecklistMetadata | undefined = colMetadataResponse?.clbDatasetKey ? {
    version: colMetadataResponse.version ?? colMetadataResponse.datasetTitle,
    link: `${import.meta.env.PUBLIC_CHECKLIST_BANK_WEBSITE}/dataset/${colMetadataResponse.clbDatasetKey}/about`,
  } : undefined;

  const hardcodedMetadata: Record<string, { title: string; alias: string; metadata?: ChecklistMetadata }> = {
    'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c': {
      title: 'GBIF Backbone Taxonomy',
      alias: 'GBIF',
    },
    [colKey]: {
      title: 'Catalogue of Life',
      alias: 'COL',
      metadata: colMetadata,
    },
  };
  return supportedChecklists.map((key: string) => ({
    key,
    title: hardcodedMetadata[key]?.title || key,
    alias: hardcodedMetadata[key]?.alias || key,
    isAlwaysVisible: defaultVisibleChecklists.includes(key),
    isDefault: key === defaultChecklist,
    metadata: hardcodedMetadata[key]?.metadata,
  }));
}

export function useSupportedChecklists() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useI18n();

  useEffect(() => {
    getSupportedChecklists(locale)
      .then((data) => {
        setChecklists(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load checklists:', error);
        setLoading(false);
      });
  }, [locale]);

  return { checklists, loading };
}

const CHECKLIST_METADATA_QUERY = /* GraphQL */ `
  query ChecklistMetadata($checklistKey: ID!) {
    checklistMetadata(checklistKey: $checklistKey) {
      mainIndex {
        clbDatasetKey
        datasetTitle
        version
      }
    }
  }
`;