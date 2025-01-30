import { useStringParam } from '@/hooks/useParam';

export function useEntityDrawer() {
  const [previewKey, setPreviewKey] = useStringParam({
    key: 'entity',
  });

  return [previewKey, (key?: string | undefined) => setPreviewKey(key)] as const;
}
