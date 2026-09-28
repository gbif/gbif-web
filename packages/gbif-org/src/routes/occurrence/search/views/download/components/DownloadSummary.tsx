import { useSupportedChecklists } from '@/hooks/useSupportedChecklists';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { requiresSequences, supportsExtensions } from './utils';

export function DownloadSummary({
  selectedFormat,
  configuration,
  sequencedRecords,
}: {
  selectedFormat: any;
  configuration: any;
  // Only relevant for formats that hold a subset of the search, so the sidebar can state how many
  // records the download will actually contain.
  sequencedRecords?: number;
}) {
  const { checklists } = useSupportedChecklists();
  // Get configuration summary for sidebar
  const getConfigSummary = () => {
    const summary = [
      {
        label: <FormattedMessage id="occurrenceDownloadFlow.format" />,
        value: (
          <FormattedMessage
            id={`occurrenceDownloadFlow.downloadFormats.${selectedFormat?.id}.title`}
          />
        ),
      },
      // {
      //   label: <FormattedMessage id="occurrenceDownloadFlow.csvDelimiter" />,
      //   value: <FormattedMessage id="occurrenceDownloadFlow.tabDelimiter" />,
      // },
    ];

    if (configuration.checklistKey) {
      summary.push({
        label: <FormattedMessage id="occurrenceDownloadFlow.taxonomy" />,
        value: <>{checklists.find((x) => x.key === configuration.checklistKey)?.alias ?? ''}</>,
      });
    }

    if (requiresSequences(selectedFormat?.id) && typeof sequencedRecords === 'number') {
      summary.push({
        label: <FormattedMessage id="occurrenceDownloadFlow.sequences.recordsIncluded" />,
        value: <FormattedNumber value={sequencedRecords} />,
      });
    }

    if (supportsExtensions(selectedFormat?.id) && 'extensions' in configuration) {
      summary.push({
        label: <FormattedMessage id="occurrenceDownloadFlow.extensions" />,
        value: configuration.extensions.length.toString(),
      });
    }

    return summary;
  };

  return (
    <div className="g-space-y-3 g-text-sm">
      {getConfigSummary().map((item, index) => (
        <div key={index} className="g-flex g-justify-between">
          <span className="g-text-gray-600">{item.label}:</span>
          <span className="g-font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
