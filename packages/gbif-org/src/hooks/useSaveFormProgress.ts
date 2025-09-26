import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useSaveFormProgress(key: string, getState: () => unknown) {
  const location = useLocation();
  const previousLocationRef = useRef(location.pathname);

  // Save form progress when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = previousLocationRef.current;

    // Only save if we're actually navigating to a different page
    if (previousPath !== currentPath) {
      const state = getState();
      window.sessionStorage.setItem(key, JSON.stringify(state));
      previousLocationRef.current = currentPath;
    }
  }, [location.pathname, key, getState]);

  // Save form progress on beforeunload (page refresh/close)
  useEffect(() => {
    const handler = () => {
      const state = getState();
      window.sessionStorage.setItem(key, JSON.stringify(state));
    };
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [key, getState]);
}

export function getFormProgress(key: string) {
  const draft = window.sessionStorage.getItem(key);
  if (draft) {
    try {
      const parsed = JSON.parse(draft);
      return parsed;
    } catch (e) {
      console.error('Failed to parse form draft', e);
    }
  }
}

export function clearSavedFormProgress(key: string) {
  window.sessionStorage.removeItem(key);
}
