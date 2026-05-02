import { useCallback, useEffect, useRef, useState } from 'react';
import { useConfig } from '@/config/config';
import { useToolUnsavedGuard } from '../_shared/useToolUnsavedGuard';
import {
  BATCH_CONCURRENCY,
  BATCH_SIZE,
  BlastMatch,
  DEFAULT_MARKER,
  MAX_BATCH_ERRORS,
  MAX_RETRIES,
  Phase,
  SAMPLE_SEQUENCES_BY_MARKER,
  SequenceInput,
  SequenceResult,
  SortDirection,
} from './types';
import { buildCsv, chunk, isSupportedFile, parseSequenceInput } from './utils';

export type SequenceIdState = {
  phase: Phase;
  inputText: string;
  marker: string;
  results: SequenceResult[];
  matchedCount: number;
  isProcessing: boolean;
  isComplete: boolean;
  error?: string;
  matchError?: string;
  isDragOver: boolean;
  offset: number;
  excludeUnmatched: boolean;
  sortColumn?: string;
  sortDirection: SortDirection;
  showDownload: boolean;
  downloadUrl: string;
  setInputText: (value: string) => void;
  setMarker: (value: string) => void;
  setOffset: (value: number) => void;
  setExcludeUnmatched: (value: boolean) => void;
  setShowDownload: (value: boolean) => void;
  reset: () => void;
  handleSubmitText: () => void;
  handleLoadSample: () => void;
  handleFile: (file: File) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleSort: (column: string) => void;
  generateCsv: () => void;
};

export function useSequenceIdState(): SequenceIdState {
  const { defaultChecklistKey } = useConfig();
  const blastBatchEndpoint = `${import.meta.env.PUBLIC_WEB_UTILS}/sequence/blast/batch`;

  const [phase, setPhase] = useState<Phase>('upload');
  const [inputText, setInputText] = useState('');
  const [marker, setMarker] = useState<string>(DEFAULT_MARKER);
  const [results, setResults] = useState<SequenceResult[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [matchError, setMatchError] = useState<string | undefined>();
  const [isDragOver, setIsDragOver] = useState(false);
  const [offset, setOffset] = useState(0);
  const [excludeUnmatched, setExcludeUnmatched] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showDownload, setShowDownload] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  // Cancellation: bumped on reset() so any in-flight processing aborts on the next chunk.
  const runIdRef = useRef(0);

  // Warn before navigating away with unsaved data
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (results.length > 0 && !error) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [results.length, error]);

  useToolUnsavedGuard(results.length > 0 && !error);

  const reset = useCallback(() => {
    runIdRef.current += 1;
    setPhase('upload');
    setResults([]);
    setMatchedCount(0);
    setIsProcessing(false);
    setIsComplete(false);
    setError(undefined);
    setMatchError(undefined);
    setOffset(0);
    setExcludeUnmatched(false);
    setSortColumn(undefined);
    setSortDirection('asc');
  }, []);

  const runBlast = useCallback(
    async (inputs: SequenceInput[], selectedMarker: string) => {
      const runId = ++runIdRef.current;

      // Seed the result list so the table can render with pending rows immediately.
      const initialResults: SequenceResult[] = inputs.map((i) => ({
        occurrenceId: i.occurrenceId,
        sequence: i.sequence,
        marker: selectedMarker,
        status: 'pending',
      }));
      setResults(initialResults);
      setMatchedCount(0);
      setIsProcessing(true);
      setIsComplete(false);
      setError(undefined);
      setMatchError(undefined);
      setPhase('results');

      const batches = chunk(inputs, BATCH_SIZE).map((items, batchIndex) => ({
        items,
        batchIndex,
        startOffset: batchIndex * BATCH_SIZE,
      }));

      let erroredCount = 0;
      const queue = [...batches];

      const processBatch = async (batch: { items: SequenceInput[]; startOffset: number }) => {
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            const res = await fetch(blastBatchEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sequence: batch.items.map((i) => i.sequence),
                marker: selectedMarker,
                datasetKey: defaultChecklistKey,
              }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = (await res.json()) as BlastMatch[];
            if (runId !== runIdRef.current) return;
            setResults((prev) => {
              const next = [...prev];
              batch.items.forEach((_item, idx) => {
                const slot = batch.startOffset + idx;
                if (next[slot]) {
                  next[slot] = {
                    ...next[slot],
                    status: 'matched',
                    match: data[idx],
                  };
                }
              });
              return next;
            });
            setMatchedCount((c) => c + batch.items.length);
            return;
          } catch (e) {
            if (attempt === MAX_RETRIES - 1) {
              if (runId !== runIdRef.current) return;
              erroredCount += batch.items.length;
              setResults((prev) => {
                const next = [...prev];
                batch.items.forEach((_item, idx) => {
                  const slot = batch.startOffset + idx;
                  if (next[slot]) {
                    next[slot] = {
                      ...next[slot],
                      status: 'errored',
                      error: e instanceof Error ? e.message : 'Network error',
                    };
                  }
                });
                return next;
              });
              setMatchedCount((c) => c + batch.items.length);
            }
          }
        }
      };

      const workers: Promise<void>[] = [];
      for (let w = 0; w < BATCH_CONCURRENCY; w++) {
        workers.push(
          (async () => {
            while (queue.length > 0) {
              if (runId !== runIdRef.current) return;
              const batch = queue.shift();
              if (!batch) return;
              await processBatch(batch);
            }
          })()
        );
      }

      await Promise.all(workers);

      if (runId !== runIdRef.current) return;
      setIsProcessing(false);
      setIsComplete(true);
      if (erroredCount > MAX_BATCH_ERRORS) {
        setError(
          `Too many sequences could not be matched (${erroredCount} of ${inputs.length}) — please try again later.`
        );
      } else if (erroredCount > 0) {
        setMatchError(`${erroredCount} of ${inputs.length} sequences could not be matched`);
      }
    },
    [blastBatchEndpoint]
  );

  const submit = useCallback(
    (rawInput: string, selectedMarker: string) => {
      const parsed = parseSequenceInput(rawInput);
      if ('error' in parsed) {
        setError(parsed.error);
        return;
      }
      setError(undefined);
      runBlast(parsed, selectedMarker);
    },
    [runBlast]
  );

  const handleSubmitText = useCallback(() => {
    submit(inputText, marker);
  }, [inputText, marker, submit]);

  const handleLoadSample = useCallback(() => {
    const sample = SAMPLE_SEQUENCES_BY_MARKER[marker] ?? SAMPLE_SEQUENCES_BY_MARKER[DEFAULT_MARKER];
    setInputText(sample);
    setError(undefined);
  }, [marker]);

  const handleFile = useCallback(
    (file: File) => {
      if (!isSupportedFile(file)) {
        setError('Invalid file format — upload a FASTA (.fasta, .fa) or CSV/TSV file');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setInputText(text);
        submit(text, marker);
      };
      reader.readAsText(file);
    },
    [marker, submit]
  );

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

  const handleSort = useCallback(
    (column: string) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(column);
        setSortDirection('asc');
      }
      setOffset(0);
    },
    [sortColumn, sortDirection]
  );

  const generateCsv = useCallback(() => {
    const csv = buildCsv(results, excludeUnmatched);
    const blob = new Blob([csv], { type: 'text/csv' });
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(URL.createObjectURL(blob));
    setShowDownload(true);
  }, [results, excludeUnmatched, downloadUrl]);

  return {
    phase,
    inputText,
    marker,
    results,
    matchedCount,
    isProcessing,
    isComplete,
    error,
    matchError,
    isDragOver,
    offset,
    excludeUnmatched,
    sortColumn,
    sortDirection,
    showDownload,
    downloadUrl,
    setInputText,
    setMarker,
    setOffset,
    setExcludeUnmatched,
    setShowDownload,
    reset,
    handleSubmitText,
    handleLoadSample,
    handleFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleSort,
    generateCsv,
  };
}
