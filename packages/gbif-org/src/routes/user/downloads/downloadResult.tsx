import { FormattedNumber } from '@/components/dashboard/shared';
import { defaultDateFormatProps } from '@/components/headerComponents';
import { Card } from '@/components/ui/largeCard';
import { DownloadResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { DownloadTitle } from '@/routes/occurrence/download/key/downloadKey';
import { DownloadFilterSummary } from '@/routes/occurrence/download/key/sections/queryCard';
import { fragmentManager } from '@/services/fragmentManager';
import { formatBytes } from '@/utils/formatBytes';
import { FormattedDate, FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment DownloadResult on Download {
    key
    created
    modified
    doi
    downloadLink
    status
    totalRecords
    numberDatasets
    size
    license
    request {
      predicate
      sql: sqlFormatted
      format
      description
      gbifMachineDescription
    }
  }
`);

interface DownloadResultProps {
  download: DownloadResultFragment;
  onCancel?: (key: string) => void;
}

export function DownloadResult({ download }: DownloadResultProps) {
  const { size, unit } = formatBytes(download?.size ?? 0, 0);

  return (
    <DynamicLink pageId="downloadKey" variables={{ key: download.key }}>
      <Card className="g-mb-4 hover:g-shadow-lg g-transition-shadow g-duration-300 hover:g-border-primary-300">
        <article className="">
          <div className="g-p-4 g-flex g-flex-col g-gap-2">
            <div className="g-flex g-justify-between g-items-start">
              <div className="g-flex-grow">
                <div className="g-flex g-items-center g-gap-2">
                  <h3 className="g-text-base g-font-semibold">
                    <DownloadTitle download={download} />
                  </h3>
                </div>

                {download.request?.description && (
                  <p className="g-text-sm g-text-slate-700 g-mt-2">
                    {download.request.description}
                  </p>
                )}
              </div>
            </div>

            <div className="g-flex g-flex-wrap g-gap-4 g-text-sm g-text-slate-600">
              <div>
                <FormattedMessage id="downloadKey.created" />:{' '}
                {download.created ? (
                  <FormattedDate value={download?.created} {...defaultDateFormatProps} />
                ) : (
                  <FormattedMessage id="phrases.unknownDate" />
                )}
              </div>
              {download.size && (
                <div>
                  <FormattedMessage id="downloadKey.fileSize" />: <FormattedNumber value={size} />{' '}
                  {unit}
                </div>
              )}
              {download.request?.format && (
                <div>
                  <FormattedMessage id="downloadKey.format" />:{' '}
                  <FormattedMessage id={`enums.downloadFormat.${download?.request?.format}`} />
                </div>
              )}
            </div>
          </div>
          <div className="g-border-t g-border-gray-200 g-p-4 g-overflow-auto">
            <DownloadFilterSummary download={download} />
          </div>
        </article>
      </Card>
    </DynamicLink>
  );
}
