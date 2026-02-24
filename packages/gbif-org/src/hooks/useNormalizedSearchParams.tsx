import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const snakeToCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

export function useNormalizedSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Normalize params
  const normalized = useMemo(() => {
    const out = new URLSearchParams();
    let changed = false;

    for (const [key, value] of searchParams.entries()) {
      const camelKey = snakeToCamel(key);
      if (camelKey !== key) changed = true;
      out.append(camelKey, value);
    }

    return { params: out, changed };
  }, [searchParams]);

  // Sync URL once (replace, not push)
  useEffect(() => {
    if (normalized.changed) {
      setSearchParams(normalized.params, { replace: true });
    }
  }, [normalized, setSearchParams]);

  return [normalized.params, setSearchParams] as const;
}
