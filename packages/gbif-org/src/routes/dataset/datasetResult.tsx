import { MapThumbnail, MapTypes } from '@/components/maps/mapThumbnail';
import { CountTag, Tag } from '@/components/resultCards';
import { Card } from '@/components/ui/largeCard';
import { DatasetResultFragment, DatasetStubResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { FormattedMessage } from 'react-intl';

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
  hidePublisher,
}: {
  dataset: DatasetStubResultFragment | DatasetResultFragment;
  hidePublisher?: boolean;
}) {
  return (
    <Card className="g-mb-4">
      <MapThumbnail
        blend
        type={MapTypes.DatasetKey}
        identifier={dataset.key}
        overlayStyle="classic-noborder.poly"
        className="min-[500px]:g-hidden"
      />
      <article className="g-p-4">
        <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
          <div className="g-flex-grow">
            <h3 className="g-text-base g-font-semibold">
              <DynamicLink
                className="hover:g-text-primary-500"
                pageId="datasetKey"
                variables={{ key: dataset.key }}
              >
                {dataset.title}
              </DynamicLink>
            </h3>
            {dataset.excerpt && (
              <p className="g-font-normal g-text-slate-700 g-text-sm g-break-words">
                {dataset.excerpt}
              </p>
            )}
            {!dataset.excerpt && (
              <p className="g-font-normal g-text-slate-400 g-text-sm">
                <FormattedMessage id="phrases.noDescriptionProvided" />
              </p>
            )}
            {!hidePublisher && dataset.publishingOrganizationTitle && (
              <p className="g-font-normal g-text-slate-500 g-text-sm g-mt-2">
                <FormattedMessage id="dataset.publishedBy" />{' '}
                <span>{dataset.publishingOrganizationTitle}</span>
              </p>
            )}
          </div>
          <div className="g-max-w-48 md:g-max-w-64 g-flex-none">
            <MapThumbnail
              blend
              type={MapTypes.DatasetKey}
              identifier={dataset.key}
              overlayStyle="classic-noborder.poly"
              className="g-rounded g-hidden min-[500px]:g-block"
            />
          </div>
        </div>
        <div className="-g-m-1 g-mt-2 g-flex g-flex-row g-items-center g-flex-wrap">
          <Tag>
            <FormattedMessage id={`dataset.longType.${dataset.type}`} />
          </Tag>
          <div className="g-flex-grow g-hidden sm:g-block"></div>
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
