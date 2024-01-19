import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import {
  ProgrammeQuery,
  ProgrammeQueryVariables,
  HeaderBlock as HeaderBlockType,
  FeatureBlock as FeatureBlockType,
  FeaturedTextBlock as FeaturedTextBlockType,
  CarouselBlock as CarouselBlockType,
  MediaBlock as MediaBlockType,
  MediaCountBlock as MediaCountBlockBlock,
  CustomComponentBlock as CustomComponentBlockType,
  TextBlock as TextBlockType,
  AssetImage,
} from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import {
  ArticleBanner
} from '@/routes/resource/key/components/ArticleBanner';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { ArticleTitle } from '../components/ArticleTitle';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { ArticleSkeleton } from '../components/ArticleSkeleton';

export const ProgrammeSkeleton = ArticleSkeleton;

const { load, useTypedLoaderData } = createGraphQLHelpers<
  ProgrammeQuery,
  ProgrammeQueryVariables
>(/* GraphQL */ `
  query Programme($key: String!) {
    programme(id: $key, preview: true) {
      title
      excerpt
      blocks {
        __typename
        ... on HeaderBlock {
          title
          __typename
          summary
          primaryImage {
            file {
              url
              normal: thumbor(width: 1200, height: 500)
              mobile: thumbor(width: 800, height: 400)
            }
            description
            title
          }
        }
        ... on FeatureBlock {
          __typename
          maxPerRow
          title
          body
          backgroundColour
          features {
            __typename
            ... on Feature {
              id
              title
              url
              primaryImage {
                file {
                  mobile: thumbor(width: 500, height: 400)
                }
              }
            }
            ... on News {
              id
              title
              excerpt
              optionalImg: primaryImage {
                file {
                  mobile: thumbor(width: 500, height: 400)
                }
              }
            }
            ... on DataUse {
              id
              title
              excerpt
              optionalImg: primaryImage {
                file {
                  mobile: thumbor(width: 500, height: 400)
                }
              }
            }
            ... on Event {
              id
              title
              excerpt
              start
              end
              optionalImg: primaryImage {
                file {
                  mobile: thumbor(width: 500, height: 400)
                }
              }
            }
          }
        }
        ... on FeaturedTextBlock {
          __typename
          id
          title
          body
          backgroundColour
        }
        ... on CarouselBlock {
          __typename
          id
          title
          body
          backgroundColour
          features {
            __typename
            ... on MediaBlock {
              ...mediaFields
            }
            ... on MediaCountBlock {
              ...mediaCountFields
            }
          }
        }
        ... on MediaBlock {
          ...mediaFields
        }
        ... on MediaCountBlock {
          ...mediaCountFields
        }
        ... on CustomComponentBlock {
          id
          componentType
          title
          width
          backgroundColour
          settings
        }
        ... on TextBlock {
          title
          body
          hideTitle
          id
          backgroundColour
        }
      }
    }
  }

  fragment mediaFields on MediaBlock {
    __typename
    id
    mediaTitle: title
    body
    reverse
    subtitle
    backgroundColour
    roundImage
    callToAction {
      label
      url
    }
    optionalImg: primaryImage {
      file {
        mobile: thumbor(width: 500, height: 400)
      }
    }
  }

  fragment mediaCountFields on MediaCountBlock {
    __typename
    id
    mediaTitle: title
    body
    optionalImg: primaryImage {
      file {
        mobile: thumbor(width: 500, height: 400)
      }
    }
    reverse
    subtitle
    titleCountPart
    backgroundColour
    roundImage
    callToAction {
      label
      url
    }
  }
`);

export function Programme() {
  const { data } = useTypedLoaderData();

  if (data.programme == null) throw new Error('404');
  const resource = data.programme;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      {resource?.blocks?.map((block, index) => {
        // for each of the block types, we need to render a component, fo rnow just assume that we will have a components that takes the block as a prop
        switch (block.__typename) {
          case 'HeaderBlock':
            return <HeaderBlock key={index} resource={block} />;
          case 'FeatureBlock':
            return <FeatureBlock key={index} resource={block} />;
          case 'FeaturedTextBlock':
            return <FeaturedTextBlock key={index} resource={block} />;
          case 'CarouselBlock':
            return <CarouselBlock key={index} resource={block} />;
          case 'MediaBlock':
            return <MediaBlock key={index} resource={block} />;
          case 'MediaCountBlock':
            return <MediaCountBlock key={index} resource={block} />;
          case 'CustomComponentBlock':
            return <CustomComponentBlock key={index} resource={block} />;
          case 'TextBlock':
            return <TextBlock key={index} resource={block} />;
          default:
            return null;
        }
      })}

      <ArticleContainer>Funding should go here, similar to project pages</ArticleContainer>
    </>
  );
}

export async function programmeLoader({ request, params, config, locale }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return load({
    endpoint: config.graphqlEndpoint,
    signal: request.signal,
    variables: {
      key,
    },
    locale: locale.cmsLocale || locale.code,
  });
}

export function HeaderBlock({ resource }: { resource: Partial<HeaderBlockType> }) {
  return (
    <ArticleContainer>
      <ArticleTextContainer>
        {resource.type && <ArticlePreTitle>{resource.type} - needs translating</ArticlePreTitle>}

        <ArticleTitle>{resource.title}</ArticleTitle>

        {resource.summary && (
          <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
        )}
      </ArticleTextContainer>

      <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage ?? null} />
    </ArticleContainer>
  );
}

const backgroundColorMap: { [key: string]: string } = {
  white: 'bg-white',
  light: 'bg-slate-50',
  gray: 'bg-slate-100',
};

export function FeatureBlock({ resource }: { resource: Partial<FeatureBlockType> }) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];
  return (
    <ArticleContainer className={backgroundColor}>
      <ArticleTextContainer>
        <ArticleTitle>{resource.title}</ArticleTitle>
      </ArticleTextContainer>
      <ArticleTextContainer>
        {resource.body && (
          <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
        )}
      </ArticleTextContainer>
      <div className="max-w-6xl m-auto p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {resource.features?.map((feature, index) => {
          const cardProps = {
            title: feature.title,
            // excerpt: feature.excerpt,
            url: feature.url,
            image: feature.primaryImage ?? feature.optionalImg,
          };
          return <ProseCard key={index} {...cardProps} />;
        })}
      </div>
    </ArticleContainer>
  );
}

export function FeaturedTextBlock({ resource }: { resource: Partial<FeaturedTextBlockType> }) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];
  return (
    <ArticleContainer className={backgroundColor}>
      {resource.title && (
        <ArticleTextContainer className="mb-16">
          <ArticleTitle title={resource.title}></ArticleTitle>
        </ArticleTextContainer>
      )}
      <ArticleTextContainer>
        {resource.body && (
          <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
        )}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

export function CarouselBlock({ resource }: { resource: Partial<CarouselBlockType> }) {
  return <>{resource.__typename}</>;
}

export function MediaBlock({ resource }: { resource: Partial<MediaBlockType> }) {
  return <>{resource.__typename}</>;
}

export function MediaCountBlock({ resource }: { resource: Partial<MediaCountBlockBlock> }) {
  return <>{resource.__typename}</>;
}

export function CustomComponentBlock({
  resource,
}: {
  resource: Partial<CustomComponentBlockType>;
}) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];
  return (
    <ArticleContainer className={backgroundColor}>
      <ArticleTextContainer>{resource.__typename} - not implemented yet</ArticleTextContainer>
    </ArticleContainer>
  );
}

export function TextBlock({ resource }: { resource: Partial<TextBlockType> }) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];
  return (
    <ArticleContainer className={backgroundColor}>
      <ArticleTextContainer>
        {resource.body && (
          <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
        )}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

export function ProseCard({
  title,
  excerpt,
  url,
  image,
}: {
  title: string;
  excerpt?: string;
  url: string;
  image?: AssetImage;
}) {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {image && (
        <a href={url}>
          <img className="rounded-t-lg" src={image.file.mobile} alt="" />
        </a>
      )}
      <div className="p-5">
        <a href={url}>
          <h5
            className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white"
            dangerouslySetInnerHTML={{ __html: title }}
          ></h5>
        </a>
        {excerpt && (
          <p
            className="mb-3 font-normal text-gray-700 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          ></p>
        )}
      </div>
    </div>
  );
}
