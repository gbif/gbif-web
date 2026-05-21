import { DownloadAsTSVLink } from '@/components/cardHeaderActions/downloadAsTSVLink';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FeatureList, GenericFeature } from '@/components/highlights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { DownloadKeyQuery } from '@/gql/graphql';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { DatasetTable, EventDatasetTable } from './DatasetTable';
import { Download } from '../downloadKey';

type Props = {
  download: Download;
  datasetsByDownload: DownloadKeyQuery['datasetsByDownload'];
  downloadType?: 'occurrence' | 'event';
};

export function DatasetCard({ download, datasetsByDownload, downloadType = 'occurrence' }: Props) {
  const TableComponent = downloadType === 'event' ? EventDatasetTable : DatasetTable;
  const tsvExportUrl =
    downloadType === 'occurrence'
      ? `${import.meta.env.PUBLIC_API_V1}/occurrence/download/${download.key}/datasets/export?format=TSV`
      : `${import.meta.env.PUBLIC_API_V1}/experimental/event/download/${download.key}/datasets/export?format=TSV`;

  return (
    <Card className="g-mb-4">
      <CardHeader className="!g-pb-1">
        <CardTitle>
          <FormattedMessage
            id="downloadKey.nConstituentDatasets"
            values={{ total: download?.numberDatasets }}
          />
        </CardTitle>
        <FeatureList className="g-mt-2 g-text-slate-700">
          <GenericFeature>
            <FormattedMessage id="downloadKey.constituentOrganizations" />
            <span className="g-me-1">:</span>
            <FormattedNumber value={download.numberOrganizations ?? 0} />
          </GenericFeature>
          <GenericFeature>
            <FormattedMessage id="downloadKey.constituentPublishingCountries" />
            <span className="g-me-1">:</span>
            <FormattedNumber value={download.numberPublishingCountries ?? 0} />
          </GenericFeature>
        </FeatureList>
        {tsvExportUrl && (
          <div className="g-flex g-justify-end">
            <DownloadAsTSVLink tsvUrl={tsvExportUrl} />
          </div>
        )}
      </CardHeader>
      {datasetsByDownload && (download?.numberDatasets ?? 0) > 0 && (
        <CardContent className="!g-px-0 g-border-t g-overflow-auto">
          <ErrorBoundary type="BLOCK" debugTitle="Failed to load datasets on download page">
            <TableComponent
              downloadKey={download.key}
              initialDatasets={datasetsByDownload.results}
              limit={datasetsByDownload.limit}
              count={datasetsByDownload.count}
            />
          </ErrorBoundary>
        </CardContent>
      )}
    </Card>
  );
}
