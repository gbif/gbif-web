import { DynamicLink } from '@/components/DynamicLink';
import { DatasetCountsFragment, DatasetResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/FragmentManager';
import { isPositiveNumber } from '@/utils/isPositiveNumber';
import { FormattedMessage, FormattedNumber } from 'react-intl';

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
  const link = `/dataset/${dataset.key}`;

  return (
    <article className="bg-slate-50 p-4 rounded border mb-4">
      <h3 className="flex-auto text-base font-semibold mb-2">
        <DynamicLink to={link}>{dataset.title}</DynamicLink>
      </h3>
      <div className="font-normal text-slate-500 text-sm flex">
        <div className="flex-auto">
          {dataset.excerpt}
          <div className="text-sm text-slate-500 mt-2">
            <div className="flex items-center">
              <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                <FormattedMessage id={`enums.datasetType.${dataset.type}`} />
              </span>
              {isPositiveNumber(counts?.literatureCount) && (
                <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                  <FormattedMessage id="tableHeaders.citations" />:{' '}
                  <FormattedNumber value={counts.literatureCount} />
                </span>
              )}
              {isPositiveNumber(counts?.occurrenceCount) && (
                <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                  <FormattedMessage id="tableHeaders.occurrences" />:{' '}
                  <FormattedNumber value={counts.occurrenceCount} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
