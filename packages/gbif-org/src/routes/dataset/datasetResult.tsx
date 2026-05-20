import { MapThumbnail } from '@/components/maps/mapThumbnail';
import { CountTag, Tag } from '@/components/resultCards';
import { Card } from '@/components/ui/largeCard';
import { apiConstants } from '@/config/apiConstants';
import { DatasetResultFragment, DatasetStubResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { getTextDirection } from '@/utils/textDirection';
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
        capabilitiesParams={{ datasetKey: dataset.key }} // Pass datasetKey to check if there is data to show on the map for this dataset
        overlayStyle="classic-noborder.poly"
        className="min-[500px]:g-hidden"
      />
      <article className="g-p-4">
        <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
          <div className="g-flex-grow">
            <h3 className="g-text-base g-font-semibold g-text-site-dir-start">
              <DynamicLink
                className="hover:g-text-primary-500"
                pageId="datasetKey"
                variables={{ key: dataset.key }}
                dir="auto"
              >
                {dataset.title}
              </DynamicLink>
            </h3>
            {dataset.excerpt && (
              <div>
                <p
                  dir="auto"
                  className="g-font-normal g-text-slate-700 g-text-sm g-text-site-dir-start"
                  style={{
                    overflowWrap: 'anywhere',
                  }}
                >
                  {dataset.excerpt}
                </p>
              </div>
            )}
            {!dataset.excerpt && (
              <p className="g-font-normal g-text-slate-400 g-text-sm g-text-site-dir-start">
                <FormattedMessage id="phrases.noDescriptionProvided" />
              </p>
            )}
            {!hidePublisher && dataset.publishingOrganizationTitle && (
              <p className="g-font-normal g-text-slate-500 g-text-sm g-mt-2 g-text-site-dir-start">
                <span>
                  <FormattedMessage id="dataset.publishedBy" />{' '}
                </span>
                <span>{dataset.publishingOrganizationTitle}</span>
              </p>
            )}
          </div>
          <div className="g-max-w-48 md:g-max-w-64 g-flex-none">
            <MapThumbnail
              blend
              capabilitiesParams={{ datasetKey: dataset.key }} // Pass datasetKey to check if there is data to show on the map for this dataset
              overlayStyle="classic-noborder.poly"
              className="g-rounded g-hidden min-[500px]:g-block"
            />
          </div>
        </div>
        <div dir="auto" className="-g-m-1 g-mt-2 g-flex g-flex-row g-items-center g-flex-wrap">
          <DynamicLink pageId="datasetSearch" searchParams={{ type: [dataset.type] }}>
            <Tag className="hover:g-bg-primary-200 g-m-1 g-mb-0">
              <FormattedMessage id={`dataset.longType.${dataset.type}`} />
            </Tag>
          </DynamicLink>
          <div className="g-flex-grow g-hidden sm:g-block"></div>
          <DynamicLink pageId="occurrenceSearch" searchParams={{ datasetKey: [dataset.key] }}>
            <CountTag
              className="hover:g-bg-primary-200 g-m-1 g-mb-0"
              apiEndpoint={apiConstants.occurrenceSearch}
              params={{ datasetKey: dataset.key }}
              message="counts.nOccurrences"
            />
          </DynamicLink>
          <CountTag
            className="g-m-1 g-mb-0"
            apiEndpoint={`${apiConstants.taxonApi}/search/${dataset.key}`}
            params={{ origin: 'SOURCE' }}
            message="counts.nRecords"
          />
          <DynamicLink pageId="literatureSearch" searchParams={{ gbifDatasetKey: [dataset.key] }}>
            <CountTag
              className="hover:g-bg-primary-200 g-m-1 g-mb-0"
              apiEndpoint={apiConstants.literatureSearch}
              params={{ gbifDatasetKey: dataset.key }}
              message="counts.nCitations"
            />
          </DynamicLink>
        </div>
      </article>
    </Card>
  );
}
