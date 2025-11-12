import { useEffect } from 'react';
import { CubeDimensions } from './types';

interface UseCubeValidationProps {
  cube: CubeDimensions;
  onValidationChange?: (isValid: boolean) => void;
}

export function useCubeValidation({ cube, onValidationChange }: UseCubeValidationProps) {
  const isValid = () => {
    const hasTaxonomic = Boolean(cube.taxonomicLevel);
    const hasTemporal = Boolean(cube.temporalResolution);
    const hasSpatial =
      Boolean(cube.spatial) && (cube.spatial === 'COUNTRY' || Boolean(cube.resolution));

    return hasTaxonomic || hasTemporal || hasSpatial;
  };

  const valid = isValid();

  useEffect(() => {
    onValidationChange?.(valid);
  }, [cube, valid, onValidationChange]);

  return {
    isValid: valid,
    hasMinimumDimensions: valid,
  };
}