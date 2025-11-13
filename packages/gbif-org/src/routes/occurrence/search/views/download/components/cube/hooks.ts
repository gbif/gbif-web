import { useState } from 'react';
import { generateCubeSql } from '../cubeService';
import { CubeDimensions } from './types';

export function useSqlGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAndNavigate = async (cube: CubeDimensions, predicate?: any, query?: any) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateCubeSql(cube, predicate, query);
      const url = result.sql
        ? `/occurrence/download/sql?${new URLSearchParams({ sql: result.sql })}`
        : '/occurrence/download/sql';
      window.location.href = url;
    } catch (err) {
      console.error('Failed to generate SQL:', err);
      setError('Failed to generate SQL. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, error, generateAndNavigate };
}
