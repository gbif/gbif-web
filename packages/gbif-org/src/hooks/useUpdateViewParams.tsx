import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUpdateViewParams(paramsToRemove = [] as string[]): {
  params: URLSearchParams;
  getParams: (view?: string, defaultValue?: string) => URLSearchParams;
} {
  const [searchParams] = useSearchParams();

  const params = useMemo(() => {
    // Clone the current search parameters
    const newSearchParams = new URLSearchParams(searchParams);

    // Remove specified parameters
    paramsToRemove.forEach((param) => {
      newSearchParams.delete(param);
    });

    // Return the updated search parameters
    return newSearchParams;
  }, [searchParams, paramsToRemove]);

  const getParams = useCallback(
    (view?: string, defaultValue?: string) => {
      // Clone the current search parameters
      const newSearchParams = new URLSearchParams(params);

      // Update or set the `view` parameter
      // Update or set the `view` parameter and remove default values
      if (view && view !== defaultValue) {
        newSearchParams.set('view', view);
      } else {
        newSearchParams.delete('view');
      }

      // Return the cleaned up search parameters
      return newSearchParams;
    },
    [params]
  );

  return {
    params,
    getParams,
  };
}
