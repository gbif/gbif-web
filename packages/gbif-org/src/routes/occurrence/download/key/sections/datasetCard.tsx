import { DownloadAsTSVLink } from '@/components/cardHeaderActions/downloadAsTSVLink';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FeatureList, GenericFeature } from '@/components/highlights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { DownloadKeyQuery } from '@/gql/graphql';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { DatasetTable } from './DatasetTable';

export function DatasetCard({
  download,
  datasetsByDownload,
}: {
  download: DownloadKeyQuery['download'];
  datasetsByDownload: DownloadKeyQuery['datasetsByDownload'];
}) {
  if (!download) return null;

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
            <FormattedNumber value={download.numberOrganizations} />
          </GenericFeature>
          <GenericFeature>
            <FormattedMessage id="downloadKey.constituentPublishingCountries" />
            <span className="g-me-1">:</span>
            <FormattedNumber value={download.numberPublishingCountries} />
          </GenericFeature>
        </FeatureList>
        <div className="g-flex g-justify-end">
          <DownloadAsTSVLink
            tsvUrl={`${import.meta.env.PUBLIC_API_V1}/occurrence/download/${
              download.key
            }/datasets/export?format=TSV`}
          />
        </div>
      </CardHeader>
      {datasetsByDownload && (download?.numberDatasets ?? 0) > 0 && (
        <CardContent className="!g-px-0 g-border-t g-overflow-auto">
          <ErrorBoundary type="BLOCK" publicDescription="Failed to load datasets on download page">
            <DatasetTable
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
