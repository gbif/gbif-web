import { useState } from 'react';
import { generateCubeSql } from './cubeService';
import { CubeDimensions } from './types';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/reactRouterPlugins';
import { setTextAreaContentStorageDirectly } from '@/routes/occurrence/download/editor/predicateEditor';

export function useSqlGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { localizeLink } = useI18n();

  const generateAndNavigate = async (cube: CubeDimensions, predicate?: any) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateCubeSql(cube, predicate);
      const useUrl = result.sql.length <= 1700;
      const url = result.sql
        ? `/occurrence/download/sql?${new URLSearchParams(useUrl ? { sql: result.sql } : {})}`
        : '/occurrence/download/sql';

      if (!useUrl) {
        setTextAreaContentStorageDirectly('sql', result.sql);
      }
      /*
        This isn't ideal as the link isn't a nice link that you can open in a new tab. 
        But it is fine for now and I do not like the idea to construct the full 
        SQL download link on every interaction just to keep the url updated
      */
      navigate(localizeLink(url));
    } catch (err) {
      console.error('Failed to generate SQL:', err);
      setError('Failed to generate SQL. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, error, generateAndNavigate };
}
