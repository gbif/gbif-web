import { useEffect, useMemo, useState } from 'react';

export type ProgressHandler = {
  addLoading: () => void;
  addLoaded: () => void;
};

export function useTileLoadingFeedback() {
  const [hideLoadingProgress, setHideLoadingProgress] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(0);

  // Will be used by the getOccurrenceRasterLayer function to add loading feedback when individual tiles have loaded
  const progressHandler: ProgressHandler = useMemo(
    () => ({
      addLoading: () => {
        setLoadingCount((prev) => prev + 1);
        setHideLoadingProgress(false);
      },
      addLoaded: () => {
        setLoadedCount((prev) => prev + 1);
      },
    }),
    [setLoadedCount, setLoadingCount]
  );

  const loadingProgress = (loadedCount / loadingCount) * 100;

  useEffect(() => {
    if (loadingProgress === 100) {
      setTimeout(() => {
        setHideLoadingProgress(true);
        setLoadedCount(0);
        setLoadingCount(0);
      }, 200);
    }
  }, [loadingProgress, setHideLoadingProgress, setLoadedCount, setLoadingCount]);

  return {
    hideLoadingProgress,
    progressHandler,
    loadingProgress,
  };
}
