import { ResultCard } from '@/components/resultCards/index';
import { NewsResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { MdCalendarToday } from 'react-icons/md';
import { FormattedDate, FormattedMessage } from 'react-intl';

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

  return (
    <ResultCard.Container className={className}>
      <ResultCard.Header title={news.title} link={link} contentType="cms.contentType.news" />
      <div className="g-flex g-gap-4">
        <ResultCard.Content>
          {news.excerpt}
          <ResultCard.Metadata className="g-flex g-items-center">
            <MdCalendarToday className="g-me-2" /> <FormattedMessage id="cms.resource.published" />{' '}
            <FormattedDate value={news.createdAt} year="numeric" month="short" day="numeric" />
          </ResultCard.Metadata>
        </ResultCard.Content>
        {news.primaryImage && (
          <ResultCard.Image image={news.primaryImage} link={link} hideOnSmall />
        )}
      </div>
    </ResultCard.Container>
  );
}
