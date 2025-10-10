import { SearchInput } from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import { CardHeader } from '@/components/ui/largeCard';
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
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { HelpItemResult } from './HelpItemResult';
import { FeedbackPopover } from '@/gbif/header/feedback/feedback';

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
            ...HelpResult
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
  /*  const [searchQuery, setSearchQuery] = useStringParam({
    key: 'q',
  });
  const [question, setQuestion] = useStringParam({
    key: 'question',
  }); */
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams?.get('question')
      ? `question:${searchParams.get('question')}`
      : searchParams?.get('q') || ''
  );

  useEffect(() => {
    if (searchParams?.get('question')) {
      setSearchTerm(`question:${searchParams.get('question')}`);
    } else {
      setSearchTerm(searchParams?.get('q') || '');
    }
  }, [searchParams]);

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
            defaultValue={
              searchParams?.get('question')
                ? `question:${searchParams.get('question')}`
                : searchParams?.get('q') || ''
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.currentTarget.value);
              /* if (!e.currentTarget.value?.startsWith('question:')) {
                setQuestion("");
              } */
            }}
            className={cn(
              'g-h-8 g-px-2 g-py-2 g-rounded-md g-border g-border-solid g-border-primary-500 g-text-sm g-w-full'
            )}
            onKeyDown={(e) => {
              // if user press enter, then update the value
              if (e.key === 'Enter') {
                // setSearchTerm(e.currentTarget.value);
                setSearchParams((prev) => {
                  if (e.currentTarget.value?.startsWith('question:')) {
                    prev.set('question', e.currentTarget.value.split('question:')[1]);
                    prev.delete('q');
                  } else {
                    prev.set('q', e.currentTarget.value);
                    prev.delete('question');
                  }
                  return prev;
                });
              }
            }}
            onSearch={(value) => {
              // setSearchTerm(value);
              setSearchParams((prev) => {
                if (value?.startsWith('question:')) {
                  prev.set('question', value.split('question:')[1]);
                  prev.delete('q');
                } else {
                  prev.set('q', value);
                  prev.delete('question');
                }
                return prev;
              });
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
                    if (searchParams?.get('question')) {
                      return item?.identifier === searchParams.get('question');
                    } else {
                      return searchParams?.get('q')
                        ? item?.title
                            ?.toLowerCase()
                            .includes(searchParams.get('q')?.toLowerCase()) ||
                            item?.body?.toLowerCase().includes(searchParams.get('q')?.toLowerCase())
                        : true;
                    }
                  })
                  .map((item) => <HelpItemResult key={item.id} item={item} className="g-mb-4" />)}
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
