import { DynamicLink } from '@/components/DynamicLink';
import { DatasetResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/FragmentManager';
import { FormattedMessage } from 'react-intl';
import { MapThumbnail, MapTypes } from '../../components/MapThumbnail';
import { CountProps, getCount } from '@/components/Count';

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

export function DatasetResult({ dataset }: { dataset: DatasetResultFragment }) {
  return (
    <article className="bg-slate-50 p-4 rounded border mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <h3 className="text-base font-semibold mb-2">
            <DynamicLink to={`/dataset/${dataset.key}`}>{dataset.title}</DynamicLink>
          </h3>
          {dataset.excerpt && <p className="font-normal text-slate-500 text-sm">{dataset.excerpt}</p>}
          {!dataset.excerpt && <p className="font-normal text-slate-400 text-sm"><FormattedMessage id="phrases.noDescriptionProvided" /></p>}

          {/* <p className="font-normal text-slate-500 text-sm mt-2">Publisher by <span>{dataset.publishingOrganizationTitle}</span></p> */}
        </div>
        <div className="max-w-48 md:max-w-64 ">
          <MapThumbnail
            type={MapTypes.DatasetKey}
            identifier={dataset.key}
            overlayStyle="classic-noborder.poly"
            className="rounded"
          />
        </div>
      </div>
      <div className="-m-1 mt-2 flex flex-row items-center flex-wrap">
        <Tag>
          <FormattedMessage id={`enums.datasetType.${dataset.type}`} />
        </Tag>
        <div className="flex-grow"></div>
        <CountTag
          v1Endpoint="/occurrence/search"
          params={{ datasetKey: dataset.key }}
          message="counts.nOccurrences"
        />
        <CountTag
          v1Endpoint="/literature/search"
          params={{ gbifDatasetKey: dataset.key }}
          message="counts.nCitations"
        />
      </div>
    </article>
  );
}

type CountTagProps = CountProps & {
  message?: string;
};

export function CountTag({
  v1Endpoint,
  params,
  message = 'counts.nRecords',
  property,
}: CountTagProps) {
  const { count } = getCount({ v1Endpoint, params, property });

  if (typeof count === 'number' && count > 1) {
    return <Tag>
    <FormattedMessage id={message} values={{ total: count }} />
  </Tag>
  }

  return false
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium px-2.5 py-0.5 m-1 mb-0 rounded dark:bg-red-900 dark:text-red-300">
      {children}
    </span>
  );
}
