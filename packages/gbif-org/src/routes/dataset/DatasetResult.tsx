import { DynamicLink } from '@/components/DynamicLink';
import { DatasetCountsFragment, DatasetResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/FragmentManager';
import { isPositiveNumber } from '@/utils/isPositiveNumber';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { MapThumbnail, MapTypes } from '../resource/key/components/MapThumbnail';

fragmentManager.register(/* GraphQL */ `
  fragment DatasetResult on DatasetSearchStub {
    key
    title
    excerpt
    type
    publishingOrganizationTitle
    recordCount
    license
  }
`);

fragmentManager.register(/* GraphQL */ `
  fragment DatasetCounts on DatasetSearchStub {
    key
    occurrenceCount
    literatureCount
  }
`);

export function DatasetResult({
  dataset,
  counts,
}: {
  dataset: DatasetResultFragment;
  counts?: DatasetCountsFragment;
}) {
  return (
    <article className="bg-slate-50 p-4 rounded border mb-4 flex flex-row gap-4">
      <div>
        <h3 className="text-base font-semibold mb-2">
          <DynamicLink to={`/dataset/${dataset.key}`}>{dataset.title}</DynamicLink>
        </h3>
        <p className="font-normal text-slate-500 text-sm">{dataset.excerpt}</p>
        <div className="mt-2 flex items-center">
          <Tag>
            <FormattedMessage id={`enums.datasetType.${dataset.type}`} />
          </Tag>
          {isPositiveNumber(counts?.literatureCount) && (
            <Tag>
              <FormattedMessage id="tableHeaders.citations" />:{' '}
              <FormattedNumber value={counts.literatureCount} />
            </Tag>
          )}
          {isPositiveNumber(counts?.occurrenceCount) && (
            <Tag>
              <FormattedMessage id="tableHeaders.occurrences" />:{' '}
              <FormattedNumber value={counts.occurrenceCount} />
            </Tag>
          )}
        </div>
      </div>
      <div className="max-w-64">
        <MapThumbnail
          type={MapTypes.DatasetKey}
          identifier={dataset.key}
          overlayStyle="classic-noborder.poly"
          className="rounded"
        />
      </div>
    </article>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
      {children}
    </span>
  );
}
