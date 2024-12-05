import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

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

    // Return the updated search parameters as a string
    return newSearchParams;
  }, [searchParams, paramsToRemove]);

  const getParams = useCallback(
    (view?: string, defaultValue?: string) => {
      const newSearchParams = new URLSearchParams(params);
      
      // Update or set the `view` parameter
      // if no view or view equals default value, remove the view parameter
      if (view && view !== defaultValue) {
        newSearchParams.set('view', view);
      } else {
        newSearchParams.delete('view');
      }
      return newSearchParams;
    },
    [params]
  );

  return {
    params,
    getParams,
  };
}