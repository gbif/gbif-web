import { MdCalendarToday } from 'react-icons/md';
import { FormattedDate } from 'react-intl';
import { NewsResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/FragmentManager';

fragmentManager.register(/* GraphQL */ `
  fragment NewsResult on News {
    id
    title
    excerpt
    primaryImage {
      file {
        url: thumbor(width: 300, height: 150)
      }
    }
    createdAt
  }
`);

type Props = {
  news: NewsResultFragment;
};

export function NewsResult({ news }: Props) {
  const link = `/news/${news.id}`;
  return (
    <article className="bg-slate-50 p-4 rounded border mb-4">
      <h3 className="flex-auto text-base font-semibold mb-2">
        <a href={link}>{news.title}</a>
      </h3>
      <div className="font-normal text-slate-500 text-sm flex">
        <div className="flex-auto">
          {news.excerpt}
          <div className="text-sm text-slate-500 mt-2">
            <div className="flex items-center">
              <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                News
              </span>
              <MdCalendarToday className="me-2" /> Published{' '}
              <FormattedDate value={news.createdAt} year="numeric" month="short" day="numeric" />
            </div>
          </div>
        </div>
        {news?.primaryImage?.file?.url && (
          <div className="flex-none">
            <a href={link} tabIndex={-1}>
              <img
                className="w-32 border border-slate-200/50 rounded ms-4"
                src={news.primaryImage.file.url}
              />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
