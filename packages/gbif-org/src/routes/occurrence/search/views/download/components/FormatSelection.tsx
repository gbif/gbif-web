import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DynamicLink } from '@/reactRouterPlugins';
import { FaChevronLeft } from 'react-icons/fa';
import { FormattedMessage } from 'react-intl';
import { SequenceAvailabilityNotice } from './SequenceAvailabilityNotice';
import { formatFileSize, getEstimatedSizeInBytes } from './utils';

interface Format {
  id: string;
  estimateSize: boolean;
  featureKeys?: string[];
  downloadFormat?: string;
  // The format can only contain records with a DNA sequence, so it is sized by - and only offered
  // for - the sequenced part of the search.
  requiresSequences?: boolean;
}

interface FormatSelectionProps {
  onFormatSelect: (format: Format, estimatedSizeInBytes: number) => void;
  onBack?: () => void;
  totalRecords?: number;
  sequencedRecords?: number;
  loadingCounts?: boolean;
  enabledFormats?: string[];
}

// A FASTA archive is a Darwin Core Archive with more in it, so it carries every DwC-A feature and
// adds the sequence files - keep the two in step by deriving one from the other.
const DWCA_FEATURE_KEYS = [
  'multipleCsv',
  'rawAndInterpreted',
  'multimediaLinks',
  'coordinates',
  'individualOccurrences',
];

const formatCards: Format[] = [
  {
    id: 'SIMPLE_CSV',
    estimateSize: true,
    featureKeys: ['singleCsv', 'interpretedData', 'coordinates', 'individualOccurrences'],
  },
  {
    id: 'DWCA',
    estimateSize: true,
    featureKeys: DWCA_FEATURE_KEYS,
  },
  {
    id: 'FASTA_ARCHIVE',
    // The sequence files make the size too unpredictable to estimate per record.
    estimateSize: false,
    requiresSequences: true,
    // The sequence-specific traits lead, since they are what sets this apart from a plain DwC-A.
    featureKeys: ['dnaSequences', 'sequencedRecordsOnly', ...DWCA_FEATURE_KEYS],
  },
  {
    id: 'SPECIES_LIST',
    estimateSize: true,
    featureKeys: ['singleCsv', 'interpretedData', 'occurrenceCounts'],
  },
  {
    id: 'SQL_CUBE',
    downloadFormat: 'SQL_TSV_ZIP',
    estimateSize: false,
    featureKeys: ['singleCsv', 'interpretedData', 'coordinatesIfSelected', 'occurrenceCounts'],
  },
];

export default function FormatSelection({
  onFormatSelect,
  onBack,
  totalRecords = 0,
  sequencedRecords,
  loadingCounts = false,
  enabledFormats = ['SIMPLE_CSV', 'DWCA', 'FASTA_ARCHIVE', 'SPECIES_LIST', 'SQL_CUBE'],
}: FormatSelectionProps) {
  return (
    <div className="g-max-w-4xl g-mx-auto g-space-y-4">
      {/* Back Button */}
      {onBack && (
        <div className="g-mb-4">
          <button
            onClick={onBack}
            className="g-flex g-items-center g-gap-2 g-text-gray-600 hover:g-text-gray-900 g-mb-4 g-transition-colors"
          >
            <FaChevronLeft size={20} />
            <FormattedMessage id="occurrenceDownloadFlow.back" defaultMessage="Back" />
          </button>
        </div>
      )}

      <Card className="g-rounded-lg">
        {formatCards
          .filter((format) => enabledFormats.includes(format.id))
          .map((format) => {
            // A sequence-only format is sized by the sequenced subset, not the whole search, and is
            // unusable when the search holds no sequences at all.
            const recordsInFormat = format.requiresSequences ? sequencedRecords : totalRecords;
            const disabled =
              !loadingCounts && format.requiresSequences && (sequencedRecords ?? 0) === 0;
            const selectFormat = () => {
              if (disabled) return;
              onFormatSelect(format, getEstimatedSizeInBytes(format.id, recordsInFormat ?? 0));
            };
            return (
              <div
                key={format.id}
                className={`g-border-b g-overflow-hidden g-border-gray-200 last:g-border-0`}
              >
                {/* Main Card Content */}
                <div className={`g-p-4 md:g-p-6 ${disabled ? 'g-opacity-60' : ''}`}>
                  <div className="g-flex g-items-center g-justify-between">
                    <div className="g-flex-1">
                      <div className="g-flex g-flex-col lg:g-flex-row lg:g-items-end lg:g-justify-between g-gap-4">
                        <div className="g-flex-1">
                          <div className="g-flex g-items-center g-gap-3 g-mb-0">
                            <h3
                              className={`g-text-base g-font-bold g-text-gray-900 g-transition-colors ${
                                disabled
                                  ? 'g-cursor-not-allowed'
                                  : 'g-cursor-pointer hover:g-text-primary-600'
                              }`}
                              onClick={selectFormat}
                            >
                              <FormattedMessage
                                id={`occurrenceDownloadFlow.downloadFormats.${format.id}.title`}
                              />
                            </h3>
                          </div>
                          {loadingCounts && (
                            <Skeleton className="g-text-sm g-mb-2 g-block g-w-36">Loading</Skeleton>
                          )}
                          {!loadingCounts && (recordsInFormat ?? 0) > 0 && format.estimateSize && (
                            <div className="g-text-sm g-text-slate-500 g-mb-2">
                              <FormattedMessage id={`occurrenceDownloadFlow.estimatedSize`} />:{' '}
                              {formatFileSize(
                                getEstimatedSizeInBytes(format.id, recordsInFormat ?? 0)
                              )}
                            </div>
                          )}
                          <p className="g-text-gray-600 g-text-sm g-mb-3">
                            <FormattedMessage
                              id={`occurrenceDownloadFlow.downloadFormats.${format.id}.description`}
                            />
                          </p>

                          {/* Compact Features */}
                          <div className="g-flex g-flex-wrap g-gap-2">
                            {format.featureKeys?.map((featureKey, index) => (
                              <span
                                key={index}
                                className="g-inline-flex g-items-center g-gap-1 g-text-xs g-bg-gray-50 g-text-gray-700 g-px-2 g-py-1 g-rounded-full"
                              >
                                <FormattedMessage
                                  id={`occurrenceDownloadFlow.downloadFormats.features.${featureKey}`}
                                />
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="g-flex g-flex-col g-items-stretch g-gap-3">
                          <Button size="default" disabled={disabled} onClick={selectFormat}>
                            <FormattedMessage
                              id="occurrenceDownloadFlow.configure"
                              defaultMessage="Configure"
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Why the format is disabled, or how much of the search it would contain */}
                  {format.requiresSequences && disabled && (
                    <SequenceAvailabilityNotice
                      className="g-mt-4 g-bg-slate-100 g-border-none g-text-slate-600"
                      totalRecords={totalRecords}
                      sequencedRecords={sequencedRecords}
                      loading={loadingCounts}
                    />
                  )}
                </div>
              </div>
            );
          })}
      </Card>
      <div className="g-mt-8">
        <p className="g-text-gray-600 g-text-sm">
          <FormattedMessage
            id="occurrenceDownloadFlow.weAlsoSupport"
            defaultMessage="We also support {link}"
            values={{
              link: (
                <DynamicLink pageId="occurrenceDownloadSql" className="g-underline">
                  <FormattedMessage
                    id="occurrenceDownloadFlow.sqlDownloadsLink"
                    defaultMessage="SQL downloads"
                  />
                </DynamicLink>
              ),
            }}
          />
        </p>
        {/* <p className="g-text-gray-600 g-text-sm g-mt-4">
          Not sure which format to choose? Try this{' '}
          <span className="g-underline">example archive</span> or{' '}
          <DynamicLink
            pageId="faq"
            searchParams={{ question: 'download-formats' }}
            className="g-underline"
          >
            read more
          </DynamicLink>
          .
        </p> */}
      </div>
    </div>
  );
}
