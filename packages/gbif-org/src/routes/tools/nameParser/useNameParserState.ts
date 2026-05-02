import { useConfig } from '@/config/config';
import { useCallback, useEffect, useState } from 'react';
import { CSV_EXPORT_FIELDS, ParsedName, Phase, SAMPLE_NAMES, SortDirection } from './types';
import { buildCsv, parseNameInput } from './utils';
import { useToolUnsavedGuard } from '../_shared/useToolUnsavedGuard';

export type NameParserState = {
  phase: Phase;
  inputText: string;
  names: ParsedName[];
  isParsing: boolean;
  error?: string;
  isDragOver: boolean;
  offset: number;
  excludeUnparsed: boolean;
  sortColumn?: string;
  sortDirection: SortDirection;
  showDownload: boolean;
  downloadUrl: string;
  setInputText: (value: string) => void;
  setOffset: (value: number) => void;
  setExcludeUnparsed: (value: boolean) => void;
  setShowDownload: (value: boolean) => void;
  reset: () => void;
  handleParseText: () => void;
  handleLoadSample: () => void;
  handleFile: (file: File) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleSort: (column: string) => void;
  generateCsv: () => void;
};

export function useNameParserState(): NameParserState {
  const config = useConfig();
  const v1Endpoint = config.v1Endpoint;

  const [phase, setPhase] = useState<Phase>('upload');
  const [inputText, setInputText] = useState('');
  const [names, setNames] = useState<ParsedName[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isDragOver, setIsDragOver] = useState(false);
  const [offset, setOffset] = useState(0);
  const [excludeUnparsed, setExcludeUnparsed] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showDownload, setShowDownload] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  // Warn before navigating away with unsaved data
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (names.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [names.length]);

  useToolUnsavedGuard(names.length > 0);

  const reset = useCallback(() => {
    setPhase('upload');
    setNames([]);
    setOffset(0);
    setError(undefined);
    setExcludeUnparsed(false);
    setSortColumn(undefined);
    setSortDirection('asc');
  }, []);

  const parseList = useCallback(
    async (rawInput: string) => {
      const result = parseNameInput(rawInput);
      if ('error' in result) {
        setError(result.error);
        return;
      }
      setError(undefined);
      setIsParsing(true);
      try {
        const res = await fetch(`${v1Endpoint}/parser/name`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result),
        });
        if (!res.ok) {
          setError(`Parser request failed (${res.status})`);
          return;
        }
        const data = (await res.json()) as ParsedName[];
        setNames(data);
        setOffset(0);
        setPhase('results');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Network error');
      } finally {
        setIsParsing(false);
      }
    },
    [v1Endpoint]
  );

  const handleParseText = useCallback(() => {
    parseList(inputText);
  }, [inputText, parseList]);

  const handleLoadSample = useCallback(() => {
    setInputText(SAMPLE_NAMES);
    setError(undefined);
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const valid = file.type === '' || file.type === 'text/plain' || file.name.endsWith('.txt');
      if (!valid) {
        setError('Invalid file format — the file must be a plain text (.txt) file');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setInputText(text);
        parseList(text);
      };
      reader.readAsText(file);
    },
    [parseList]
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
    const csv = buildCsv(names, CSV_EXPORT_FIELDS, excludeUnparsed);
    const blob = new Blob([csv], { type: 'text/csv' });
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(URL.createObjectURL(blob));
    setShowDownload(true);
  }, [names, excludeUnparsed, downloadUrl]);

  return {
    phase,
    inputText,
    names,
    isParsing,
    error,
    isDragOver,
    offset,
    excludeUnparsed,
    sortColumn,
    sortDirection,
    showDownload,
    downloadUrl,
    setInputText,
    setOffset,
    setExcludeUnparsed,
    setShowDownload,
    reset,
    handleParseText,
    handleLoadSample,
    handleFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleSort,
    generateCsv,
  };
}