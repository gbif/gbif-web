import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { HomePageQuery, HomePageQueryVariables } from '@/gql/graphql';
import { DynamicLink, LoaderArgs, RouteObjectWithPlugins, useI18n } from '@/reactRouterPlugins';
import { interopDefault } from '@/utils/interopDefault';
import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import _useLocalStorage from 'use-local-storage';
import { MapWidget } from '@/components/maps/mapWidget';
import { ArticleTextContainer } from '../resource/key/components/articleTextContainer';
import { PageContainer } from '../resource/key/components/pageContainer';
import { BlockItem } from '../resource/key/composition/blockItem';
import { HomePageCounts } from './counts';
import { FormattedMessage, useIntl } from 'react-intl';
import { DynamicLinkProps } from '@/reactRouterPlugins/dynamicLink';
import { cn } from '@/utils/shadcn';
import { MdSearch } from 'react-icons/md';
// Used to import commonjs module as es6 module
const useLocalStorage = interopDefault(_useLocalStorage);

const HOMEPAGE_QUERY = /* GraphQL */ `
  query HomePage {
    gbifHome {
      title
      summary
      primaryImage {
        file {
          url
          thumbor
        }
        title
        description
      }
      ...HomePageCountIcons
      blocks {
        ...BlockItemDetails
      }
    }
  }
`;

function homepageLoader({ graphql }: LoaderArgs) {
  return graphql.query<HomePageQuery, HomePageQueryVariables>(HOMEPAGE_QUERY, {});
}

function HomePage(): React.ReactElement {
  const { data } = useLoaderData() as { data: HomePageQuery };
  const home = data?.gbifHome;
  const userInfo = useUserInfo();
  const primaryImage = home?.primaryImage?.[0];

  return (
    <ErrorBoundary>
      <main className="">
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
                    <div className="g-bg-slate-950/50 g-overflow-hidden g-inline-block g-float-left">
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

        <ClientSideOnly>
          <TmpOverview />
        </ClientSideOnly>

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
      </main>
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
        action="search"
        className="g-flex g-justify-center g-items-center g-w-full g-shadow-lg g-bg-white g-rounded-none focus-within:g-outline g-outline-2 g-outline-primary/70 -g-outline-offset-2"
      >
        <input
          name="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={intl.formatMessage({ id: 'homepage.search' })}
          className="g-p-4 g-flex-1 g-outline-none remove-search-clear-icon"
        />
        <DynamicLink className="g-p-4" to={`/search?q=${q}`}>
          <MdSearch size={24} />
        </DynamicLink>
      </form>
    </>
  );
}

function TmpOverview() {
  const [open, setOpen] = useLocalStorage('homepage_tmp_open', false);
  return (
    <section>
      <div
        className="g-text-center g-text-sm g-font-bold g-bg-sky-500 g-text-white g-p-2 g-px-4 g-rounded-full g-cursor-pointer g-bottom-0 g-right-0 g-fixed g-m-8 g-z-10"
        onClick={() => setOpen(!open)}
      >
        Development site (click to toggle overview)
      </div>
      {open && (
        <div className="g-p-4 g-pt-8 md:g-p-8 md:g-pt-16 g-prose g-max-w-full g-justify-between">
          <div className="g-grid lg:g-grid-cols-2 2xl:g-grid-cols-3 g-gap-4">
            <section className="g-inline-block g-p-4 g-shadow-lg g-bg-slate-100 g-rounded-lg">
              <h2>Pages with a Contentful ID</h2>
              <p>Mostly done and should be reviewed by the content team.</p>
              <ul>
                <li>
                  <DynamicLink className="g-me-4" to="/news/6qTuv5Xf1qa05arROvx7Y1">
                    News
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/data-use/2NcRzaklrkf5X1mvyOvg5V">
                    Data use
                  </DynamicLink>
                </li>
                <li>
                  Articles:{' '}
                  <DynamicLink className="g-me-4" to="/article/ExNixkGbYWCsgcWE4YScw">
                    Data papers{' '}
                    <small className="g-font-normal">(will be redirected to urlAlias)</small>
                  </DynamicLink>
                  <DynamicLink className="g-me-4" to="/standards">
                    Data standards{' '}
                    <small className="g-font-normal">(links directly to the urlAlias)</small>
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/event/NVM72rVLfCkY4oyFEnGmq">
                    Event
                  </DynamicLink>
                </li>
                <li>
                  Tools:{' '}
                  <DynamicLink className="g-me-4" to="/tool/XHl9BhJPvhn9jNKVPH6oG">
                    GeoPick (basic)
                  </DynamicLink>
                  <DynamicLink className="g-me-4" to="/tool/82599">
                    CAPFITOGEN (w small image)
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/project/82750">
                    Project
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/programme/82243">
                    Programme BID
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/composition/3fvWSwDCj8tZBpRFiWC8QQ">
                    Composition test page
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/document/80667">
                    Document test page
                  </DynamicLink>
                </li>
                <li>
                  The home page is essentially like a composition page, but with a special header
                </li>
                <li>
                  <DynamicLink
                    className="me-4"
                    to="/composition/7zgSnALNuD1OvzanAUPG4z/hosted-portals-application-form"
                  >
                    Hosted portals application form
                  </DynamicLink>
                </li>
              </ul>
            </section>

            <section className="g-inline-block g-p-4 g-shadow-lg g-bg-slate-100 g-rounded-lg">
              <h2>API v1 driven pages (primary ID in the GBIF API)</h2>
              <p>Work in progress</p>
              <ul>
                <li>
                  <DynamicLink
                    className="g-me-4"
                    to="/network/2b7c7b4f-4d4f-40d3-94de-c28b6fa054a6"
                  >
                    Network
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink
                    className="g-me-4"
                    to="/dataset/84d26682-f762-11e1-a439-00145eb45e9a"
                  >
                    Dataset
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink
                    className="g-me-4"
                    to="/publisher/4b44524a-3f31-47e4-a5d2-a4dc15a5dd07"
                  >
                    Publisher
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink
                    className="g-me-4"
                    to="/installation/dbc06549-1795-4167-a247-9dcf90228ae7"
                  >
                    Installation
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink
                    className="g-me-4"
                    to="/institution/955b0e63-c3b5-4d74-8dfa-15b384b9ae77"
                  >
                    Institution
                  </DynamicLink>
                </li>
                <li>
                  {/* <DynamicLink className='g-me-4' to="/collection/e9d2c520-d9fc-4331-9ed8-73bea2b22af0"> */}
                  <DynamicLink
                    className="g-me-4"
                    to="/collection/03a64ffd-34d0-432c-a152-0d41d41c028f"
                  >
                    Collection
                  </DynamicLink>
                </li>
                <li>
                  Occurrences:{' '}
                  <DynamicLink className="g-me-4" to="/occurrence/4126243325">
                    Images
                  </DynamicLink>
                  <DynamicLink className="g-me-4" to="/occurrence/4045885848">
                    Video
                  </DynamicLink>
                  <DynamicLink className="g-me-4" to="/occurrence/2434542261">
                    RecordedBy ID
                  </DynamicLink>
                  <DynamicLink className="g-me-4" to="/occurrence/1934869005">
                    Fossil
                  </DynamicLink>
                  <DynamicLink className="g-me-4" to="/occurrence/3013940180">
                    iNat
                  </DynamicLink>
                  <DynamicLink className="g-me-4" to="/occurrence/4527469336">
                    Phylogeny
                  </DynamicLink>
                  <DynamicLink className="g-me-4" to="/occurrence/4517957661">
                    Extensions
                  </DynamicLink>
                  <DynamicLink className="g-me-4" to="/occurrence/4129776625">
                    Oceanic
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/occurrence/1087520255">
                    Occurrence tombstone (prod id)
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/occurrence/download/0041327-241126133413365">
                    Download page
                  </DynamicLink>
                </li>
                <li>
                  Download, species, participant, country and profile pages have not been started
                </li>
              </ul>
            </section>
            <section className="g-inline-block g-p-4 g-shadow-lg g-bg-slate-100 g-rounded-lg">
              <h2>Custom one-off pages</h2>
              <p>
                This is pages like, contact directory, network, suggest a dataset, ipt, blast tool,
                occ snapshots, etc. Some have been implemented, but there is alot of these.
              </p>
              <ul>
                <li>
                  <DynamicLink className="g-me-4" to="/become-a-publisher">
                    Become a publisher
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/suggest-dataset">
                    Suggest a dataset
                  </DynamicLink>
                </li>
              </ul>
            </section>
            <section className="g-inline-block g-p-4 g-shadow-lg g-bg-slate-100 g-rounded-lg">
              <h2>Search</h2>
              <p>
                This hasn't started yet. But it is search for occurrences, species, datasets,
                publishers, literature, news etc.
              </p>
              <ul>
                <li>
                  <DynamicLink className="g-me-4" to="/dataset/search">
                    Datasets - started
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/literature/search">
                    Literature - started
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/publisher/search">
                    Publishers - started
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/occurrence/search">
                    Occurrences - stub
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/collection/search">
                    Collections - stub
                  </DynamicLink>
                </li>
                <li>
                  <DynamicLink className="g-me-4" to="/institution/search">
                    Institutions - stub
                  </DynamicLink>
                </li>
              </ul>
            </section>
            <section className="g-inline-block g-p-4 g-shadow-lg g-bg-slate-100 g-rounded-lg">
              <h2>Site wide features</h2>
              <p>Not implemented, but is menu, login, feedback, footer, gdpr notice, popups, ...</p>
            </section>
          </div>
        </div>
      )}
    </section>
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
