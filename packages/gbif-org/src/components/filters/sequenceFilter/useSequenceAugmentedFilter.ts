import { useConfig } from '@/config/config';
import { FilterType } from '@/contexts/filter';
import {
  getCachedResolution,
  parseSequenceFilterValue,
  resolveSequence,
  selectedSequenceIds,
} from '@/utils/sequenceSearch';
import { useEffect, useMemo, useState } from 'react';

export const SEQUENCE_FILTER_HANDLE = 'nucleotideSequenceId';

/**
 * The "Similar sequences" filter persists only `{ sequence, selected }` in the URL — the
 * matched nucleotideSequenceIDs are recomputed from the sequence (cheap thanks to the
 * vsearch cache). But the predicate serializer is synchronous and needs the IDs, so this
 * hook resolves them and injects them into the in-memory filter (as `ids` on the value).
 * That changes the filter hash when resolution completes, which makes the views re-query.
 * The IDs live only in memory; `stripSequenceFilterIds` removes them before the filter is
 * written back to the URL.
 */
export function useSequenceAugmentedFilter(filter: FilterType): FilterType {
  const config = useConfig();
  const webUtilsBase = import.meta.env.PUBLIC_WEB_UTILS;
  const [version, setVersion] = useState(0);

  const value = parseSequenceFilterValue(filter?.must?.[SEQUENCE_FILTER_HANDLE]?.[0]);
  const sequence = value?.sequence;
  const selectedKey = (value?.selected ?? []).join(',');

  // Warm the cache for the active sequence; bump version when it resolves so the memo
  // below recomputes with the freshly resolved IDs.
  useEffect(() => {
    if (!sequence) return;
    if (getCachedResolution(sequence)) {
      setVersion((v) => v + 1);
      return;
    }
    let active = true;
    resolveSequence(sequence, config.v1Endpoint, webUtilsBase).finally(() => {
      if (active) setVersion((v) => v + 1);
    });
    return () => {
      active = false;
    };
  }, [sequence, config.v1Endpoint, webUtilsBase]);

  return useMemo(() => {
    if (!sequence) return filter;
    const resolution = getCachedResolution(sequence);
    // cold / invalid / too long: no ids, predicate omitted
    if (!resolution || resolution.invalid || resolution.tooLong) return filter;
    const ids = selectedSequenceIds(resolution.bins, value?.selected ?? []);
    const augmented = JSON.stringify({ sequence, selected: value?.selected ?? [], ids });
    return {
      ...filter,
      must: { ...filter.must, [SEQUENCE_FILTER_HANDLE]: [augmented] },
    };
    // `version` bumps when resolution completes so the memo recomputes with the IDs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sequence, selectedKey, version]);
}

// Remove the in-memory `ids` before the filter is serialized to the URL, so the URL only
// ever holds `{ sequence, selected }`.
export function stripSequenceFilterIds(filter: FilterType): FilterType {
  const raw = filter?.must?.[SEQUENCE_FILTER_HANDLE]?.[0];
  const value = parseSequenceFilterValue(raw);
  if (!value || value.ids == null) return filter;
  const stripped = JSON.stringify({ sequence: value.sequence, selected: value.selected });
  return {
    ...filter,
    must: { ...filter.must, [SEQUENCE_FILTER_HANDLE]: [stripped] },
  };
}
