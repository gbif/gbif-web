import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedDate, FormattedMessage } from 'react-intl';

export function GrSciCollMetadata({
  entity,
  ...props
}: {
  entity: {
    created: string;
    modified: string;
    modifiedBy: string;
    masterSourceMetadata: { source: string; sourceId: string };
  };
}) {
  if (!entity) return null;
  return (
    <div className="g-text-slate-500 g-flex g-flex-wrap g-items-center g-gap-8" {...props}>
      <div>
        <FormattedMessage id="grscicoll.entryCreated" defaultMessage="Entry created" />:{' '}
        <FormattedDate value={entity.created} year="numeric" month="long" day="2-digit" />
      </div>
      <div>
        <FormattedMessage id="grscicoll.lastModified" defaultMessage="Last modified" />:{' '}
        <FormattedDate value={entity.modified} year="numeric" month="long" day="2-digit" />
      </div>
      <div>
        <FormattedMessage id="grscicoll.modifiedBy" defaultMessage="Modified by" />:{' '}
        {entity.modifiedBy}
      </div>
      {entity.masterSourceMetadata && (
        <div>
          <span>
            <FormattedMessage id="grscicoll.masterSource" defaultMessage="Master source" />:{' '}
          </span>
          {entity.masterSourceMetadata.source === 'ORGANIZATION' && (
            <DynamicLink
              pageId="publisherKey"
              variables={{ key: entity.masterSourceMetadata.sourceId }}
              className="g-underline"
            >
              GBIF publisher
            </DynamicLink>
          )}
          {entity.masterSourceMetadata.source === 'DATASET' && (
            <DynamicLink
              pageId="datasetKey"
              variables={{ key: entity.masterSourceMetadata.sourceId }}
              className="g-underline"
            >
              GBIF Dataset
            </DynamicLink>
          )}
          {entity.masterSourceMetadata.source === 'IH_IRN' && (
            <a
              className="g-underline"
              href={`http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=${entity.masterSourceMetadata.sourceId}`}
            >
              Index Herbariorum
            </a>
          )}
        </div>
      )}
    </div>
  );
}
