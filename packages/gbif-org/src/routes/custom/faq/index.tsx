import { SearchInput } from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import { CardHeader } from '@/components/ui/largeCard';
import { FeedbackPopover } from '@/gbif/header/feedback';
import { FaqQuery, FaqQueryVariables, HelpItemQuery, HelpItemQueryVariables } from '@/gql/graphql';
import { useStringParam } from '@/hooks/useParam';
import { LoaderArgs, RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { ArticleBody } from '@/routes/resource/key/components/articleBody';
import { ArticleIntro } from '@/routes/resource/key/components/articleIntro';
import { ArticleOpenGraph } from '@/routes/resource/key/components/articleOpenGraph';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { cn } from '@/utils/shadcn';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { HelpItemResult } from './HelpItemResult';
const FAQ_QUERY = /* GraphQL */ `
  query Faq($urlAlias: String) {
    resourceSearch(urlAlias: $urlAlias, contentType: [ARTICLE]) {
      documents {
        total
        results {
          ... on Article {
            __typename
            id
            title
            body
            summary
          }
        }
      }
    }
  }
`;

const HELP_ITEM_QUERY = /* GraphQL */ `
  query HelpItem($size: Int, $from: Int) {
    resourceSearch(contentType: [HELP], size: $size, from: $from, searchable: true) {
      documents {
        total
        results {
          __typename
          ... on Help {
            id
            identifier
            title
            body
            excerpt
          }
        }
      }
    }
  }
`;

async function faqPageLoader({ graphql }: LoaderArgs) {
  const response = await graphql.query<FaqQuery, FaqQueryVariables>(FAQ_QUERY, {
    urlAlias: '/faq',
  });
  const { errors, data } = await response.json();

  const helpResponse = await graphql.query<HelpItemQuery, HelpItemQueryVariables>(HELP_ITEM_QUERY, {
    size: 500,
    from: 0,
  });
  const { errors: helpErrors, data: helpData } = await helpResponse.json();

  throwCriticalErrors({
    path404: ['resource'],
    errors,
    requiredObjects: [data?.resourceSearch?.documents.results[0]],
  });
  throwCriticalErrors({
    path404: ['resource'],
    errors,
    requiredObjects: [helpData?.resourceSearch?.documents.results[0]],
  });

  return { errors, data, helpData, helpErrors };
}

function FAQ() {
  const { data, helpData } = useLoaderData() as { data: FaqQuery; helpData: HelpItemQuery };

  const resource = data?.resourceSearch?.documents.results[0];
  const ref = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useStringParam({
    key: 'q',
    defaultValue: '',
    hideDefault: true,
  });
  const { formatMessage } = useIntl();

  return (
    <article>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <PageContainer topPadded className="g-bg-white g-pb-10">
        <ArticleTextContainer className="g-mb-10">
          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />

          {resource.summary && (
            <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="g-mt-2" />
          )}
        </ArticleTextContainer>
        <ArticleTextContainer className="g-mb-8">
          <SearchInput
            ref={ref}
            defaultValue={searchQuery}
            className={cn(
              'g-h-8 g-px-2 g-py-2 g-rounded-md g-border g-border-solid g-border-primary-500 g-text-sm g-w-full'
            )}
            onKeyDown={(e) => {
              // if user press enter, then update the value
              if (e.key === 'Enter') {
                setSearchTerm(e.currentTarget.value);
                setSearchQuery(e.currentTarget.value);
              }
            }}
            onSearch={(value) => {
              setSearchTerm(value);
              setSearchQuery(value);
            }}
            placeholder={formatMessage({
              id: 'search.placeholders.default',
              defaultMessage: 'Search',
            })}
          />

          {helpData?.resourceSearch?.documents.total > 0 && (
            <>
              <CardHeader>
                {/* <CardTitle>
                  <FormattedMessage
                    id="counts.nHostedDatasets"
                    values={{ total: installation.dataset.count }}
                  />
                </CardTitle> */}
              </CardHeader>
              {helpData?.resourceSearch?.documents?.results &&
                helpData.resourceSearch.documents.results
                  .filter((item) => {
                    if (searchQuery && searchQuery.startsWith('question:')) {
                      const questionId = searchQuery.split(':')[1];
                      return item?.identifier === questionId;
                    } else {
                      return searchQuery
                        ? item?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item?.body?.toLowerCase().includes(searchQuery.toLowerCase())
                        : true;
                    }
                  })
                  .map((item) => <HelpItemResult key={item.id} item={item} />)}
            </>
          )}
        </ArticleTextContainer>
        <ArticleTextContainer className="g-mb-8">
          {resource?.body && (
            <ArticleBody dangerouslySetBody={{ __html: resource?.body }} className="g-mt-2" />
          )}
        </ArticleTextContainer>
        <div className="g-flex g-flex-col md:g-flex-row g-gap-4 g-mb-2">
          <div className="g-flex-grow"></div>
          <div>
            <FeedbackPopover
              trigger={
                <Button>
                  <FormattedMessage id="cms.resource.contactHelpdesk" />
                </Button>
              }
            />
          </div>
          <div className="g-flex-grow"></div>
        </div>
      </PageContainer>
    </article>
  );
}

export const faqRoute: RouteObjectWithPlugins = {
  id: 'faq',
  element: <FAQ />,
  loader: faqPageLoader,
  loadingElement: <div>Loading...</div>,
  path: 'faq',
};
