import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MapWidget } from '@/components/maps/mapWidget';
import { HomePageQuery, HomePageQueryVariables } from '@/gql/graphql';
import { DynamicLink, LoaderArgs, RouteObjectWithPlugins, useI18n } from '@/reactRouterPlugins';
import { DynamicLinkProps, useDynamicNavigate } from '@/reactRouterPlugins/dynamicLink';
import { cn } from '@/utils/shadcn';
import React, { useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { json, Link, useLoaderData, useLocation } from 'react-router-dom';
import { ArticleTextContainer } from '../resource/key/components/articleTextContainer';
import { PageContainer } from '../resource/key/components/pageContainer';
import { BlockItem } from '../resource/key/composition/blockItem';
import { HomePageCounts } from './counts';
// eslint-disable-next-line
import { HOMEPAGE_QUERY } from './query.mjs'; // only imported to generate types
import { usePartialDataNotification } from '../rootErrorPage';
import PageMetaData from '@/components/PageMetaData';

async function homepageLoader({ locale }: LoaderArgs) {
  const apiUrl = `${import.meta.env.PUBLIC_BASE_URL}/unstable-api/cached-response/home?locale=${
    locale.cmsLocale ?? 'en'
  }`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    // just swallow errors here and let the page render with partial data
    return json(
      { error: 'Failed to load homepage data' },
      {
        headers: {
          'GBIF-Cache-Control': 'NONE', // option are listed in gbif/entry.server but vite builds fails if trying to export/import things into the server file or vica versa
        },
      }
    ) as HomePageQuery;
  }

  return { data: await response.json() };
}

function HomePage(): React.ReactElement {
  const { data, error } = useLoaderData() as { data: HomePageQuery; error?: string };
  const notifyOfPartialData = usePartialDataNotification();
  useEffect(() => {
    if (error) {
      notifyOfPartialData();
    }
  }, [error, notifyOfPartialData]);

  const home = data?.gbifHome;
  const userInfo = useUserInfo();
  const primaryImage = home?.primaryImage?.[0];
  const intl = useIntl();
  const location = useLocation();

  return (
    <ErrorBoundary>
      <PageMetaData
        title={intl.formatMessage({ id: 'phrases.defaultPageTitle' })}
        description={intl.formatMessage({ id: 'phrases.defaultPageDescription' })}
        path={location.pathname}
      />
      <div className="">
        {/* A background image with title and a search bar */}
        <section className="g-relative">
          <div
            className="g-bg-cover g-bg-center g-bg-no-repeat g-py-48"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0)), linear-gradient(to bottom, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), url('${primaryImage?.file?.thumbor}')`,
            }}
          >
            <PageContainer>
              <ArticleTextContainer className="g-max-w-6xl">
                <div className="g-max-w-[800px]">
                  <div className="g-text-white">
                    <div className="g-mb-8 g-text-lg">{home?.title}</div>
                    <h1
                      data-cy="heading"
                      className="g-text-4xl md:g-text-5xl g-font-semibold g-text-white"
                    >
                      {home?.summary}
                    </h1>
                  </div>
                  <div className="g-mt-4">
                    <SearchBar />
                    <div className="g-bg-slate-950/50 g-overflow-hidden g-inline-block g-float-start">
                      <HeaderLink to="/what-is-gbif">
                        <FormattedMessage id="homepage.whatIsGbif" />
                      </HeaderLink>
                      {userInfo && userInfo.country && userInfo.countryName && (
                        <HeaderLink to={`/country/${userInfo.country}`}>
                          <FormattedMessage
                            id="homepage.aboutGbifCountry"
                            values={{ COUNTRY: userInfo.countryName }}
                          />
                        </HeaderLink>
                      )}
                    </div>
                  </div>
                </div>
              </ArticleTextContainer>
            </PageContainer>
          </div>
          {primaryImage?.description && (
            <span
              className="g-absolute g-right-0 g-bottom-0 g-text-xs g-text-white g-p-1.5 g-font-medium underlineLinks hover:g-bg-gray-900/30"
              dangerouslySetInnerHTML={{ __html: primaryImage?.description }}
            />
          )}
        </section>

        {/* <section>
          <PageContainer>
            <ArticleTextContainer className="g-max-w-6xl">sdæflk sdfj</ArticleTextContainer>
          </PageContainer>
        </section> */}

        <HomePageCounts iconData={home} />

        {home?.blocks?.map((block, idx) => (
          <BlockItem resource={block} key={idx} />
        ))}

        {/* It might make sense to only render this component if the user scrolls close to it */}
        <MapWidget />
      </div>
    </ErrorBoundary>
  );
}

function HeaderLink(props: DynamicLinkProps<typeof Link>) {
  return (
    <DynamicLink
      {...props}
      className={cn(
        'g-inline-block g-p-2 g-px-4 g-text-white g-whitespace-nowrap',
        props.className
      )}
    />
  );
}

function SearchBar() {
  const [q, setQ] = useState('');
  const intl = useIntl();
  const dynamicNavigate = useDynamicNavigate();

  return (
    <>
      <div className="g-bg-slate-950/50 g-overflow-auto g-inline-flex g-max-w-full">
        <HeaderLink pageId="occurrenceSearch" searchParams={{ occurrenceStatus: 'PRESENT', q }}>
          <FormattedMessage id="catalogues.occurrences" />
        </HeaderLink>
        <HeaderLink pageId="speciesSearch" searchParams={{ q }}>
          <FormattedMessage id="catalogues.species" />
        </HeaderLink>
        <HeaderLink pageId="datasetSearch" searchParams={{ q }}>
          <FormattedMessage id="catalogues.datasets" />
        </HeaderLink>
        <HeaderLink pageId="publisherSearch" searchParams={{ q }}>
          <FormattedMessage id="catalogues.publishers" />
        </HeaderLink>
        <HeaderLink pageId="resourceSearch" searchParams={{ q }}>
          <FormattedMessage id="catalogues.resources" />
        </HeaderLink>
      </div>
      <form
        action="/search"
        method="get"
        onSubmit={(e) => {
          e.preventDefault();
          dynamicNavigate({
            pageId: 'omniSearch',
            searchParams: { q },
          });
        }}
        className="g-flex g-justify-center g-items-center g-w-full g-shadow-lg g-bg-white g-rounded-none focus-within:g-outline g-outline-2 g-outline-primary/70 -g-outline-offset-2"
      >
        <input
          name="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={intl.formatMessage({ id: 'homepage.search' })}
          className="g-p-4 g-flex-1 g-outline-none remove-search-clear-icon g-bg-white"
        />
        <DynamicLink className="g-p-4" pageId="omniSearch" searchParams={{ q }}>
          <MdSearch size={24} />
        </DynamicLink>
      </form>
    </>
  );
}

type UserInfo = {
  country?: string;
  countryName?: string;
};

export function useUserInfo() {
  const { locale } = useI18n();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // call endpoint to get users location
  useEffect(() => {
    fetch(`${import.meta.env.PUBLIC_WEB_UTILS}/user-info?lang=${locale.localeCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserInfo(data);
      })
      .catch(() => {
        setUserInfo(null);
      });
  }, [locale.localeCode]);

  return userInfo;
}

export const homePageRoute: RouteObjectWithPlugins = {
  index: true,
  id: 'home',
  element: <HomePage />,
  loader: homepageLoader,
};
