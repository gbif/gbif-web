import { FormattedMessage } from 'react-intl';
import { CsvDownloadModal } from '../_shared/csvDownloadModal';
import { ResultsPhase } from './resultsPhase';
import { UploadPhase } from './uploadPhase';
import { useToolCmsResource } from '../_shared/toolLayout';
import { useSequenceIdState } from './useSequenceIdState';

export default function SequenceIdPage() {
  const cmsResource = useToolCmsResource();
  const {
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
  } = useSequenceIdState();

  return (
    <>
      {phase === 'upload' && (
        <UploadPhase
          error={error}
          isProcessing={isProcessing}
          isDragOver={isDragOver}
          inputText={inputText}
          marker={marker}
          hasCmsAbout={!!cmsResource}
          onInputTextChange={setInputText}
          onMarkerChange={setMarker}
          onSubmit={handleSubmitText}
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
            results={results}
            marker={marker}
            matchedCount={matchedCount}
            isProcessing={isProcessing}
            isComplete={isComplete}
            matchError={matchError}
            excludeUnmatched={excludeUnmatched}
            offset={offset}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onBack={reset}
            onSetOffset={setOffset}
            onSetExcludeUnmatched={setExcludeUnmatched}
            onSort={handleSort}
            onGenerateCsv={generateCsv}
          />
          <CsvDownloadModal
            open={showDownload}
            downloadUrl={downloadUrl}
            filename="blastresult.csv"
            title={
              <FormattedMessage
                id="tools.sequenceId.downloadAsCsv"
                defaultMessage="Download as .csv"
              />
            }
            description={
              <FormattedMessage
                id="tools.sequenceId.downloadDescription"
                defaultMessage="Your BLAST results are ready to download."
              />
            }
            cancelLabel={
              <FormattedMessage id="tools.sequenceId.cancel" defaultMessage="Cancel" />
            }
            onClose={() => setShowDownload(false)}
          />
        </>
      )}
    </>
  );
}
