import { useStringParam } from '@/hooks/useParam';

export function useEntityDrawer() {
  return useStringParam({
    key: 'entity',
  });
}
