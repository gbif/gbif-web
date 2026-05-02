import { FormattedMessage } from 'react-intl';
import { CsvDownloadModal } from '../_shared/csvDownloadModal';
import { EditModal } from './editModal';
import { ResultsPhase } from './resultsPhase';
import { SelectKingdomPhase } from './selectKingdomPhase';
import { UploadPhase } from './uploadPhase';
import { useSpeciesLookupState } from './useSpeciesLookupState';

export default function SpeciesLookupPage() {
  const {
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
    advancedExampleCsv,
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
  } = useSpeciesLookupState();

  return (
    <>
      {phase === 'upload' && (
        <UploadPhase
          error={error}
          isDragOver={isDragOver}
          advancedExampleCsv={advancedExampleCsv}
          onFile={handleFile}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
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
    </>
  );
}
