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
              className="g-underline g-text-inherit"
              pageId="publisherKey"
              variables={{ key: entity.masterSourceMetadata.sourceId }}
            >
              GBIF publisher
            </DynamicLink>
          )}
          {entity.masterSourceMetadata.source === 'DATASET' && (
            <DynamicLink
              className="g-underline g-text-inherit"
              pageId="datasetKey"
              variables={{ key: entity.masterSourceMetadata.sourceId }}
            >
              GBIF Dataset
            </DynamicLink>
          )}
          {entity.masterSourceMetadata.source === 'IH_IRN' && (
            <a
              className="g-underline g-text-inherit"
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
