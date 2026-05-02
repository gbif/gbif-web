import { useConfig } from '@/config/config';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToolUnsavedGuard } from '../_shared/useToolUnsavedGuard';
import {
  BATCH_SIZE,
  CSV_EXPORT_FIELDS,
  Phase,
  SpeciesRow,
  SuggestResult,
} from './types';
import {
  applyMatchData,
  applySuggestion,
  buildCsv,
  fromTaxonSuggestion,
  parseCSV,
  processInBatches,
  toCandidate,
} from './utils';

export type SpeciesLookupState = {
  phase: Phase;
  species: SpeciesRow[];
  defaultKingdom?: string;
  isMatching: boolean;
  matchedCount: number;
  offset: number;
  itemToEdit: SpeciesRow | null;
  searchQuery: string;
  suggestions: SuggestResult[];
  isSuggestLoading: boolean;
  showDownload: boolean;
  downloadUrl: string;
  excludeUnmatched: boolean;
  error?: string;
  isDragOver: boolean;
  searchInputRef: React.RefObject<HTMLInputElement>;
  advancedExampleCsv: string;
  setDefaultKingdom: (k: string | undefined) => void;
  setOffset: (n: number) => void;
  setExcludeUnmatched: (b: boolean) => void;
  setShowDownload: (b: boolean) => void;
  setSearchQuery: (q: string) => void;
  reset: () => void;
  handleFile: (file: File) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  matchNames: () => Promise<void>;
  openEdit: (row: SpeciesRow) => void;
  closeEdit: () => void;
  selectSuggestion: (suggestion: SuggestResult) => void;
  discardMatch: () => void;
  generateCsv: () => void;
};

const ADVANCED_EXAMPLE_CSV =
  'data:text/csv;charset=utf-8,' +
  encodeURIComponent(
    'scientificName,kingdom,id\nPuma concolor,animalia,1\nAnimalia,,2\nQuercus robur,plantae,3\n'
  );

export function useSpeciesLookupState(): SpeciesLookupState {
  const config = useConfig();
  const v2Endpoint = config.v2Endpoint;
  const defaultChecklistKey = config.defaultChecklistKey;

  const [phase, setPhase] = useState<Phase>('upload');
  const [species, setSpecies] = useState<SpeciesRow[]>([]);
  const [defaultKingdom, setDefaultKingdom] = useState<string | undefined>();
  const [isMatching, setIsMatching] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [itemToEdit, setItemToEdit] = useState<SpeciesRow | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestResult[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [excludeUnmatched, setExcludeUnmatched] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isDragOver, setIsDragOver] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Warn before navigating away with unsaved data
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (species.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [species.length]);

  useToolUnsavedGuard(species.length > 0);

  const reset = useCallback(() => {
    setPhase('upload');
    setSpecies([]);
    setDefaultKingdom(undefined);
    setOffset(0);
    setError(undefined);
    setExcludeUnmatched(false);
  }, []);

  const handleFile = useCallback((file: File) => {
    const valid =
      file.type === '' ||
      file.type === 'text/csv' ||
      file.type === 'text/plain' ||
      file.name.endsWith('.csv');
    if (!valid) {
      setError('Invalid file format — the file must be a CSV file with a scientificName column');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = parseCSV(reader.result as string);
      if ('error' in result) {
        setError(result.error);
      } else {
        setError(undefined);
        setSpecies(result);
        setPhase('selectKingdom');
        setOffset(0);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const matchNames = useCallback(async () => {
    setIsMatching(true);
    setMatchedCount(0);
    const rows = species.map((s) => ({ ...s }));

    await processInBatches(
      rows,
      BATCH_SIZE,
      async (item) => {
        try {
          const params = new URLSearchParams({
            verbose: 'true',
            scientificName: item.verbatimScientificName,
          });
          if (defaultChecklistKey) params.set('checklistKey', defaultChecklistKey);
          const kingdom = item.preferedKingdom || defaultKingdom;
          if (kingdom) params.set('kingdom', kingdom);

          const matchRes = await fetch(`${v2Endpoint}/species/match?${params}`);
          if (!matchRes.ok) return;
          const matchData: Record<string, unknown> = await matchRes.json();

          const usage = matchData.usage as Record<string, unknown> | undefined;
          const primaryCandidate = usage?.key ? toCandidate(matchData) : null;
          const alternativeCandidates = Array.isArray(matchData.alternatives)
            ? (matchData.alternatives as Record<string, unknown>[]).map(toCandidate)
            : [];
          item.alternatives = primaryCandidate
            ? [primaryCandidate, ...alternativeCandidates]
            : alternativeCandidates;

          applyMatchData(item, matchData);
        } catch {
          // item stays unmatched
        }
      },
      (done) => setMatchedCount(done)
    );

    setSpecies(rows);
    setIsMatching(false);
    setPhase('results');
    setOffset(0);
  }, [species, defaultKingdom, v2Endpoint, defaultChecklistKey]);

  // Debounced suggest search
  useEffect(() => {
    if (!itemToEdit) return;
    const q = searchQuery.trim();
    if (!q) {
      setSuggestions([]);
      setIsSuggestLoading(false);
      return;
    }
    if (!defaultChecklistKey) {
      setSuggestions([]);
      setIsSuggestLoading(false);
      return;
    }
    setIsSuggestLoading(true);
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q, limit: '10' });
        const res = await fetch(`${v2Endpoint}/taxon/suggest/${defaultChecklistKey}?${params}`);
        if (res.ok) {
          const data = (await res.json()) as Record<string, unknown>[];
          setSuggestions(data.map(fromTaxonSuggestion));
        }
      } catch {
        // ignore
      } finally {
        setIsSuggestLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, itemToEdit, v2Endpoint, defaultChecklistKey]);

  // Focus search input when edit modal opens
  useEffect(() => {
    if (itemToEdit) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [itemToEdit]);

  const openEdit = useCallback((row: SpeciesRow) => {
    setItemToEdit(row);
    setSearchQuery('');
    setSuggestions([]);
    setIsSuggestLoading(false);
  }, []);

  const closeEdit = useCallback(() => {
    setItemToEdit(null);
    setSearchQuery('');
    setSuggestions([]);
    setIsSuggestLoading(false);
  }, []);

  const selectSuggestion = useCallback(
    (suggestion: SuggestResult) => {
      if (!itemToEdit) return;
      const updated = { ...itemToEdit, userEdited: true };
      applySuggestion(updated, suggestion);
      setSpecies((prev) => prev.map((s) => (s === itemToEdit ? updated : s)));
      closeEdit();
    },
    [itemToEdit, closeEdit]
  );

  const discardMatch = useCallback(() => {
    if (!itemToEdit) return;
    const updated = { ...itemToEdit, userEdited: true, discarded: true };
    applyMatchData(updated, {});
    setSpecies((prev) => prev.map((s) => (s === itemToEdit ? updated : s)));
    closeEdit();
  }, [itemToEdit, closeEdit]);

  const generateCsv = useCallback(() => {
    const csv = buildCsv(species, CSV_EXPORT_FIELDS, excludeUnmatched);
    const blob = new Blob([csv], { type: 'text/csv' });
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(URL.createObjectURL(blob));
    setShowDownload(true);
  }, [species, excludeUnmatched, downloadUrl]);

  return {
    phase,
    species,
    defaultKingdom,
    isMatching,
    matchedCount,
    offset,
    itemToEdit,
    searchQuery,
    suggestions,
    isSuggestLoading,
    showDownload,
    downloadUrl,
    excludeUnmatched,
    error,
    isDragOver,
    searchInputRef,
    advancedExampleCsv: ADVANCED_EXAMPLE_CSV,
    setDefaultKingdom,
    setOffset,
    setExcludeUnmatched,
    setShowDownload,
    setSearchQuery,
    reset,
    handleFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    matchNames,
    openEdit,
    closeEdit,
    selectSuggestion,
    discardMatch,
    generateCsv,
  };
}