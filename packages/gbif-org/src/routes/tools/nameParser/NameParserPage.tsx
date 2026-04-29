import { DataHeader } from '@/components/dataHeader';
import { useConfig } from '@/config/config';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { CsvDownloadModal } from '../_shared/csvDownloadModal';
import { ApiContent } from './help';
import { ResultsPhase } from './resultsPhase';
import {
  CSV_EXPORT_FIELDS,
  ParsedName,
  Phase,
  SAMPLE_NAMES,
  SortDirection,
} from './types';
import { UploadPhase } from './uploadPhase';
import { buildCsv, parseNameInput } from './utils';

export default function NameParserPage() {
  const { formatMessage } = useIntl();
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
      const valid =
        file.type === '' || file.type === 'text/plain' || file.name.endsWith('.txt');
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

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: 'tools.nameParser.pageTitle' })}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <DataHeader hideCatalogueSelector className="g-bg-white" apiContent={<ApiContent />} />
      <article className="g-min-h-screen g-flex g-flex-col g-bg-slate-100">
        <PageContainer topPadded hasDataHeader className="g-border-b g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl g-pb-4 md:g-pb-8">
            <ArticlePreTitle>
              <FormattedMessage id="tools.nameParser.tools" defaultMessage="Tools" />
            </ArticlePreTitle>
            <ArticleTitle>
              <FormattedMessage id="tools.nameParser.pageTitle" defaultMessage="Name parser" />
            </ArticleTitle>
          </ArticleTextContainer>
        </PageContainer>

        {phase === 'upload' && (
          <UploadPhase
            error={error}
            isParsing={isParsing}
            isDragOver={isDragOver}
            inputText={inputText}
            onInputTextChange={setInputText}
            onParseText={handleParseText}
            onLoadSample={handleLoadSample}
            onFile={handleFile}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          />
        )}

        {phase === 'results' && (
          <>
            <ResultsPhase
              names={names}
              excludeUnparsed={excludeUnparsed}
              offset={offset}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onBack={reset}
              onSetOffset={setOffset}
              onSetExcludeUnparsed={setExcludeUnparsed}
              onSort={handleSort}
              onGenerateCsv={generateCsv}
            />
            <CsvDownloadModal
              open={showDownload}
              downloadUrl={downloadUrl}
              filename="parsed-names.csv"
              title={
                <FormattedMessage
                  id="tools.nameParser.downloadAsCsv"
                  defaultMessage="Download as .csv"
                />
              }
              description={
                <FormattedMessage
                  id="tools.nameParser.downloadDescription"
                  defaultMessage="Your parsed names are ready to download."
                />
              }
              cancelLabel={
                <FormattedMessage id="tools.nameParser.cancel" defaultMessage="Cancel" />
              }
              onClose={() => setShowDownload(false)}
            />
          </>
        )}
      </article>
    </>
  );
}
