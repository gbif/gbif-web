import { ResultCard } from '@/components/resultCards/index';
import { NewsResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { MdCalendarToday } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { MediumDate } from '@/components/dateFormats';
import { getTextDirection } from '@/utils/textDirection';

fragmentManager.register(/* GraphQL */ `
  fragment NewsResult on News {
    id
    title
    excerpt
    primaryImage {
      ...ResultCardImage
    }
    createdAt
  }
`);

type Props = {
  news: NewsResultFragment;
  className?: string;
};

export function NewsResult({ news, className }: Props) {
  const link = `/news/${news.id}`;
  const dir = getTextDirection(news.title);

  return (
    <ResultCard.Container className={className} dir={dir}>
      <ResultCard.Header title={news.title} link={link} contentType="cms.contentType.news" />
      <div className="g-flex g-gap-4">
        <ResultCard.Content>
          {news.excerpt}
          <ResultCard.Metadata className="g-flex g-items-center">
            <MdCalendarToday className="g-me-2" /> <FormattedMessage id="cms.resource.published" />{' '}
            <MediumDate value={news.createdAt} />
          </ResultCard.Metadata>
        </ResultCard.Content>
        {news.primaryImage && (
          <ResultCard.Image image={news.primaryImage} link={link} hideOnSmall />
        )}
      </div>
    </ResultCard.Container>
  );
}
