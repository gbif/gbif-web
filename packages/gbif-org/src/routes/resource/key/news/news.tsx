import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { NewsQuery, NewsQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import styles from './resource.module.css';
import { FormattedMessage } from 'react-intl';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  NewsQuery,
  NewsQueryVariables
>(/* GraphQL */ `
  query News($key: String!) {
    news(id: $key) {
      id
      title
      summary
      body
      primaryImage {
        file {
          url
          normal: thumbor(width: 1200, height: 500)
          mobile: thumbor(width: 800, height: 400)
        }
        description
        title
      }
      primaryLink {
        label
        url
      }
      secondaryLinks {
        label
        url
      }
      countriesOfCoverage
      topics
      purposes
      audiences
      citation
      createdAt
    }
  }
`);

export function News() {
  const { data } = useTypedLoaderData();

  if (data.news == null) throw new Error('404');
  const resource = data.news;

  const { normal, mobile } = resource?.primaryImage?.file || {};
  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <div className="p-8 pt-16">
        <div className="max-w-3xl m-auto mt-2 mb-10">
          <div>
            {/* I need a way to access a theme color here */}
            <p className="mb-2 text-sm leading-6 font-semibold text-sky-500 dark:text-sky-400">
              News
            </p>
            <h1 className="text-3xl inline-block sm:text-4xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
              {resource.title}
            </h1>

            <div className="mt-2">
              <p className="text-gray-600 text-sm">Published {new Date(resource.createdAt).toLocaleDateString('en')}</p>
            </div>
            
            {resource.summary && (
              <div
                className="mt-2 text-lg text-slate-600"
                dangerouslySetInnerHTML={{ __html: resource.summary }}
              ></div>
            )}
          </div>
        </div>
        <div className="max-w-6xl m-auto mt-8 mb-6">
          {normal && mobile && (
            <figure className="m-auto">
              <picture className="rounded-md">
                <source srcSet={normal} media="(min-width: 800px)" width="1200" height="500"/>
                <img src={mobile} alt={resource?.primaryImage?.description ?? 'No image description provided'} className="rounded-md bg-slate-200" width="800" height="400"/>
              </picture>
              {resource.primaryImage?.description && (
                <figcaption
                  className="text-slate-600 [&>a]:underline-offset-1 [&>a]:underline"
                  dangerouslySetInnerHTML={{ __html: resource.primaryImage.description }}
                ></figcaption>
              )}
            </figure>
          )}
        </div>
        {resource.body && (
          <div className={`max-w-3xl m-auto mt-2 prose ${styles.resourceProse}`}>
            <div dangerouslySetInnerHTML={{ __html: resource.body }}></div>
          </div>
        )}
        <hr className="max-w-3xl m-auto mt-8" />
        <div className="max-w-3xl m-auto mt-8 text-sm text-slate-500">
          {resource.countriesOfCoverage && <div className="mb-4">
            <span className="me-4"><FormattedMessage id="filters.country.name"/></span>
            {resource.countriesOfCoverage.map(x => <span key={x} className="bg-slate-200 text-slate-800 py-1 px-2 rounded-full mx-1">
              <FormattedMessage id={`enums.countryCode.${x}`} />
            </span>)}
          </div>}
          {resource.topics && <div className="mb-4">
          <span className="me-4"><FormattedMessage id="filters.topics.name"/></span>
            {resource.topics.map(x => <span key={x} className="bg-slate-200 text-slate-800 py-1 px-2 rounded-full mx-1">
              <FormattedMessage id={`enums.topics.${x}`} />
            </span>)}
          </div>}
        </div>
      </div>
    </>
  );
}

export async function newsLoader({ request, params, config, locale }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return load({
    endpoint: config.graphqlEndpoint,
    request,
    variables: {
      key,
    },
    locale: locale.cmsLocale || locale.code,
  });
}