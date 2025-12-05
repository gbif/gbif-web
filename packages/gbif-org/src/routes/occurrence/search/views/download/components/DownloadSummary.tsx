import { useSupportedChecklists } from '@/hooks/useSupportedChecklists';
import { FormattedMessage } from 'react-intl';

export function DownloadSummary({
  selectedFormat,
  configuration,
}: {
  selectedFormat: any;
  configuration: any;
}) {
  const { checklists } = useSupportedChecklists();
  // Get configuration summary for sidebar
  const getConfigSummary = () => {
    const isDarwinCoreArchive = selectedFormat?.id === 'DWCA';
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

    if (isDarwinCoreArchive && 'extensions' in configuration) {
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
