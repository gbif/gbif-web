import { useStringParam } from '@/hooks/useParam';

// Used to abstract away the fact that preventScrollReset is always true when opening/closing the drawer
export function useEntityDrawer() {
  const [previewKey, setPreviewKey] = useStringParam({ key: 'entity' });

  return [previewKey, (key?: string | undefined) => setPreviewKey(key, true, true)] as const;
}
