import { DynamicLink } from '@/components/dynamicLink';
import { LiteratureResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { FormattedMessage } from 'react-intl';
import { MapThumbnail, MapTypes } from '@/components/mapThumbnail';
import { CountTag, Tag } from '@/components/resultCards';
import { Card } from '@/components/ui/largeCard';


fragmentManager.register(/* GraphQL */ `
  fragment LiteratureResult on Literature {
    id
    title
    literatureType
    year
    relevance
    topics
    excerpt
  }
`);

export function LiteratureResult({
  literature,
}: {
  literature: LiteratureResultFragment;
}) {
  return (
    <Card className='g-mb-4'>
      <article className='g-p-8'>
        <div className='g-flex g-flex-col md:g-flex-row g-gap-4'>
          <div className='g-flex-grow'>
            <h3 className='g-text-base g-font-semibold g-mb-2'>
              <DynamicLink to={`/literature/${literature.id}`}>{literature.title}</DynamicLink>
            </h3>
            {literature.excerpt && (
              <p className='g-font-normal g-text-slate-700 g-text-sm'>{literature.excerpt}</p>
            )}
            {!literature.excerpt && (
              <p className='g-font-normal g-text-slate-400 g-text-sm'>
                <FormattedMessage id="phrases.noDescriptionProvided" />
              </p>
            )}
          </div>
        </div>
        <div className='-g-m-1 g-mt-2 g-flex g-flex-row g-items-center g-flex-wrap'>
          <Tag>
            <FormattedMessage id={`literature.longType.${literature.literatureType}`} />
          </Tag>
          <div className='g-flex-grow'></div>
        </div>
      </article>
    </Card>
  );
}
