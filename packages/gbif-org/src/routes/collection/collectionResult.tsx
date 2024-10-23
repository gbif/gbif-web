import { fragmentManager } from '@/services/fragmentManager';
import { FormattedMessage } from 'react-intl';
import { CountTag } from '@/components/resultCards';
import { Card } from '@/components/ui/largeCard';
import { DynamicLink } from '@/reactRouterPlugins';

fragmentManager.register(/* GraphQL */ `
  fragment CollectionResult on CollectionSearchEntity {
    key
    name
    excerpt
    numberSpecimens
    institutionName
    institutionKey
    featuredImageUrl: thumbor(width: 300, height: 200)
    featuredImageLicense
  }
`);

export function CollectionResult({ collection }: { collection: CollectionResultFragment }) {
  return (
    <Card className="g-mb-4">
      <article className="g-p-8">
        <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
          <div className="g-flex-grow">
            <h3 className="g-text-base g-font-semibold g-mb-2">
              <DynamicLink to={`/collection/${collection.key}`}>{collection.name}</DynamicLink>
            </h3>
            {collection.excerpt && (
              <p className="g-font-normal g-text-slate-700 g-text-sm">{collection.excerpt}</p>
            )}
            {!collection.excerpt && (
              <p className="g-font-normal g-text-slate-400 g-text-sm">
                <FormattedMessage id="phrases.noDescriptionProvided" />
              </p>
            )}

            <p className="g-font-normal g-text-slate-500 g-text-sm g-mt-2">
              <FormattedMessage
                id="grscicoll.fromInstitution"
                values={{
                  institution: (
                    <DynamicLink
                      className="g-underline"
                      to={`/institution/${collection.institutionKey}`}
                    >
                      {collection.institutionName}
                    </DynamicLink>
                  ),
                }}
              />
            </p>
          </div>
          <div className="g-flex-none g-max-w-48 md:g-max-w-64 ">
            {collection.featuredImageUrl && (
              <img
                src={collection.featuredImageUrl}
                className="g-rounded-lg g-bg-slate-100 g-border g-border-slate-200"
              />
            )}
          </div>
        </div>
        <div className="-g-m-1 g-mt-2 g-flex g-flex-row g-items-center g-flex-wrap">
          {/* <Tag>
            <FormattedMessage id={`collection.longType.${collection.type}`} />
          </Tag> */}
          <div className="g-flex-grow"></div>
          <CountTag
            v1Endpoint="/occurrence/search"
            params={{ collectionKey: collection.key }}
            message="counts.nOccurrences"
          />
        </div>
      </article>
    </Card>
  );
}
