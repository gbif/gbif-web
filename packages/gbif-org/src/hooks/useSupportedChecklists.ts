import { useEffect, useState } from 'react';

const supportedChecklists =
  import.meta.env.PUBLIC_SUPPORTED_CHECKLISTS_FOR_DOWNLOAD?.split(',') || [];
const defaultVisibleChecklists =
  import.meta.env.PUBLIC_DEFAULT_VISIBLE_CHECKLISTS_FOR_DOWNLOAD?.split(',') || [];
const defaultChecklist =
  import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY || 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c'; // default backbone

export type Checklist = {
  key: string;
  title: string;
  alias: string;
  isDefault: boolean;
  isAlwaysVisible: boolean;
};

async function getSupportedChecklists(): Promise<Checklist[]> {
  // async to account for it being fetched from server in future
  const hardcodedMetadata: Record<string, { title: string; alias: string }> = {
    'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c': {
      title: 'GBIF Backbone Taxonomy',
      alias: 'GBIF',
    },
    '7ddf754f-d193-4cc9-b351-99906754a03b': {
      title: 'Catalogue of Life',
      alias: 'COL',
    },
  };
  return supportedChecklists.map((key: string) => ({
    key,
    title: hardcodedMetadata[key]?.title || key,
    alias: hardcodedMetadata[key]?.alias || key,
    isAlwaysVisible: defaultVisibleChecklists.includes(key),
    isDefault: key === defaultChecklist,
  }));
}

export function useSupportedChecklists() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSupportedChecklists()
      .then((data) => {
        setChecklists(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load checklists:', error);
        setLoading(false);
      });
  }, []);

  return { checklists, loading };
}