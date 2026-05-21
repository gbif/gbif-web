import { FormattedMessage } from 'react-intl';
import { CsvDownloadModal } from '../_shared/csvDownloadModal';
import { ResultsPhase } from './resultsPhase';
import { UploadPhase } from './uploadPhase';
import { useNameParserState } from './useNameParserState';

export default function NameParserPage() {
  const {
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
  } = useNameParserState();

  return (
    <>
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
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
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
    </>
  );
}
