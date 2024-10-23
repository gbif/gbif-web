import { DynamicLink } from '@/components/dynamicLink';
import { LiteratureResultFragment, LiteratureStubResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { FormattedMessage } from 'react-intl';
import { MapThumbnail, MapTypes } from '@/components/mapThumbnail';
import { CountTag, Tag } from '@/components/resultCards';
import { Card } from '@/components/ui/largeCard';

fragmentManager.register(/* GraphQL */ `
  fragment LiteratureStubResult on LiteratureSearchStub {
    key
    title
    excerpt
    type
    publishingOrganizationTitle
  }
`);
// TODO: seems silly but we need to register the same fragment twice with different names and we also need to call the function twice as it only extracts the first fragment
fragmentManager.register(/* GraphQL */ `
  fragment LiteratureResult on Literature {
    key
    title
    excerpt
    type
    publishingOrganizationTitle
  }
`);

export function LiteratureResult({
  literature,
}: {
  literature: LiteratureStubResultFragment | LiteratureResultFragment;
}) {
  return (
    <Card className='g-mb-4'>
      <article className='g-p-8'>
        <div className='g-flex g-flex-col md:g-flex-row g-gap-4'>
          <div className='g-flex-grow'>
            <h3 className='g-text-base g-font-semibold g-mb-2'>
              <DynamicLink to={`/literature/${literature.key}`}>{literature.title}</DynamicLink>
            </h3>
            {literature.excerpt && (
              <p className='g-font-normal g-text-slate-700 g-text-sm'>{literature.excerpt}</p>
            )}
            {!literature.excerpt && (
              <p className='g-font-normal g-text-slate-400 g-text-sm'>
                <FormattedMessage id="phrases.noDescriptionProvided" />
              </p>
            )}

            <p className='g-font-normal g-text-slate-500 g-text-sm g-mt-2'>
              <FormattedMessage id="literature.publishedBy" />{' '}
              <span>{literature.publishingOrganizationTitle}</span>
            </p>
          </div>
          <div className='g-max-w-48 md:g-max-w-64 '>
            <MapThumbnail
              type={MapTypes.LiteratureKey}
              identifier={literature.key}
              overlayStyle="classic-noborder.poly"
              className='g-rounded'
            />
          </div>
        </div>
        <div className='-g-m-1 g-mt-2 g-flex g-flex-row g-items-center g-flex-wrap'>
          <Tag>
            <FormattedMessage id={`literature.longType.${literature.type}`} />
          </Tag>
          <div className='g-flex-grow'></div>
          <CountTag
            v1Endpoint="/occurrence/search"
            params={{ literatureKey: literature.key }}
            message="counts.nOccurrences"
          />
          <CountTag
            v1Endpoint="/species/search"
            params={{ literatureKey: literature.key, origin: 'SOURCE' }}
            message="counts.nRecords"
          />
          <CountTag
            v1Endpoint="/literature/search"
            params={{ gbifLiteratureKey: literature.key }}
            message="counts.nCitations"
          />
        </div>
      </article>
    </Card>
  );
}
