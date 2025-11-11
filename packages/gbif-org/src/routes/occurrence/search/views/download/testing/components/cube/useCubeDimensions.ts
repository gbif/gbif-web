import { useCallback } from 'react';
import { CubeDimensions } from './types';

interface UseCubeDimensionsProps {
  cube: CubeDimensions;
  onChange: (dimensions: CubeDimensions) => void;
}

export function useCubeDimensions({ cube, onChange }: UseCubeDimensionsProps) {
  const updateDimensions = useCallback(
    (updates: Partial<CubeDimensions>) => {
      onChange({ ...cube, ...updates });
    },
    [cube, onChange]
  );

  return {
    cube,
    updateDimensions,
  };
}