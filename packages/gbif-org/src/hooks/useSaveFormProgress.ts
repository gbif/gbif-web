import { useEffect } from 'react';

export function useSaveFormProgress(key: string, getState: () => any) {
  useEffect(() => {
    const handler = () => {
      const state = getState();
      window.sessionStorage.setItem(key, JSON.stringify(state));
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
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
