import { DynamicLink } from '@/components/dynamicLink';
import { DatasetResultFragment, DatasetStubResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { FormattedMessage } from 'react-intl';
import { MapThumbnail, MapTypes } from '@/components/mapThumbnail';
import { CountTag, Tag } from '@/components/resultCards';
import { Card } from '@/components/ui/largeCard';

fragmentManager.register(/* GraphQL */ `
  fragment DatasetStubResult on DatasetSearchStub {
    key
    title
    excerpt
    type
    publishingOrganizationTitle
  }
`);
// TODO: seems silly but we need to register the same fragment twice with different names and we also need to call the function twice as it only extracts the first fragment
fragmentManager.register(/* GraphQL */ `
  fragment DatasetResult on Dataset {
    key
    title
    excerpt
    type
    publishingOrganizationTitle
  }
`);

export function DatasetResult({
  dataset,
}: {
  dataset: DatasetStubResultFragment | DatasetResultFragment;
}) {
  return (
    <Card className="mb-4">
      <article className="p-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <h3 className="text-base font-semibold mb-2">
              <DynamicLink to={`/dataset/${dataset.key}`}>{dataset.title}</DynamicLink>
            </h3>
            {dataset.excerpt && (
              <p className="font-normal text-slate-700 text-sm">{dataset.excerpt}</p>
            )}
            {!dataset.excerpt && (
              <p className="font-normal text-slate-400 text-sm">
                <FormattedMessage id="phrases.noDescriptionProvided" />
              </p>
            )}

            <p className="font-normal text-slate-500 text-sm mt-2">
              <FormattedMessage id="dataset.publishedBy" />{' '}
              <span>{dataset.publishingOrganizationTitle}</span>
            </p>
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
            <FormattedMessage id={`dataset.longType.${dataset.type}`} />
          </Tag>
          <div className="flex-grow"></div>
          <CountTag
            v1Endpoint="/occurrence/search"
            params={{ datasetKey: dataset.key }}
            message="counts.nOccurrences"
          />
          <CountTag
            v1Endpoint="/species/search"
            params={{ datasetKey: dataset.key, origin: 'SOURCE' }}
            message="counts.nRecords"
          />
          <CountTag
            v1Endpoint="/literature/search"
            params={{ gbifDatasetKey: dataset.key }}
            message="counts.nCitations"
          />
        </div>
      </article>
    </Card>
  );
}
