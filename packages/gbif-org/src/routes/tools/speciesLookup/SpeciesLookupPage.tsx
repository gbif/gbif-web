import { useConfig } from '@/config/config';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CsvDownloadModal } from '../_shared/csvDownloadModal';
import { ApiContent } from './help';
import { EditModal } from './editModal';
import { ResultsPhase } from './resultsPhase';
import { SelectKingdomPhase } from './selectKingdomPhase';
import {
  BATCH_SIZE,
  CSV_EXPORT_FIELDS,
  Phase,
  SpeciesRow,
  SuggestResult,
} from './types';
import { UploadPhase } from './uploadPhase';
import {
  applyMatchData,
  applySuggestion,
  buildCsv,
  fromTaxonSuggestion,
  parseCSV,
  processInBatches,
  toCandidate,
} from './utils';
import { Helmet } from 'react-helmet-async';
import { DataHeader } from '@/components/dataHeader';

export default function SpeciesLookupPage() {
  const { formatMessage } = useIntl();
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
        const res = await fetch(
          `${v2Endpoint}/taxon/suggest/${defaultChecklistKey}?${params}`
        );
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

  const advancedExampleCsv =
    'data:text/csv;charset=utf-8,' +
    encodeURIComponent(
      'scientificName,kingdom,id\nPuma concolor,animalia,1\nAnimalia,,2\nQuercus robur,plantae,3\n'
    );

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: 'tools.speciesLookup.pageTitle' })}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <DataHeader hideCatalogueSelector className="g-bg-white" apiContent={<ApiContent />} />
      <article className="g-min-h-screen g-flex g-flex-col g-bg-slate-100">
        <PageContainer topPadded hasDataHeader className="g-border-b g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl g-pb-4 md:g-pb-8">
            <ArticlePreTitle>
              <FormattedMessage id="tools.speciesLookup.tools" defaultMessage="Tools" />
            </ArticlePreTitle>
            <ArticleTitle>
              <FormattedMessage
                id="tools.speciesLookup.pageTitle"
                defaultMessage="Species lookup"
              />
            </ArticleTitle>
          </ArticleTextContainer>
        </PageContainer>

        {phase === 'upload' && (
          <UploadPhase
            error={error}
            isDragOver={isDragOver}
            advancedExampleCsv={advancedExampleCsv}
            onFile={handleFile}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          />
        )}

        {phase === 'selectKingdom' && (
          <SelectKingdomPhase
            species={species}
            defaultKingdom={defaultKingdom}
            isMatching={isMatching}
            matchedCount={matchedCount}
            offset={offset}
            onBack={reset}
            onSetDefaultKingdom={setDefaultKingdom}
            onMatchNames={matchNames}
            onSetOffset={setOffset}
          />
        )}

        {phase === 'results' && (
          <>
            <ResultsPhase
              species={species}
              excludeUnmatched={excludeUnmatched}
              offset={offset}
              onBack={reset}
              onOpenEdit={openEdit}
              onSetOffset={setOffset}
              onSetExcludeUnmatched={setExcludeUnmatched}
              onGenerateCsv={generateCsv}
            />
            <EditModal
              itemToEdit={itemToEdit}
              searchQuery={searchQuery}
              suggestions={suggestions}
              isSuggestLoading={isSuggestLoading}
              searchInputRef={searchInputRef}
              onClose={closeEdit}
              onSearchChange={setSearchQuery}
              onSelectSuggestion={selectSuggestion}
              onDiscard={discardMatch}
            />
            <CsvDownloadModal
              open={showDownload}
              downloadUrl={downloadUrl}
              filename="species-match.csv"
              title={
                <FormattedMessage
                  id="tools.speciesLookup.downloadAsCsv"
                  defaultMessage="Download as .csv"
                />
              }
              description={
                <FormattedMessage
                  id="tools.speciesLookup.downloadDescription"
                  defaultMessage="Your results are ready to download."
                />
              }
              cancelLabel={
                <FormattedMessage id="tools.speciesLookup.cancel" defaultMessage="Cancel" />
              }
              onClose={() => setShowDownload(false)}
            />
          </>
        )}
      </article>
    </>
  );
}
