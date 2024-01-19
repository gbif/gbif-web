import {
  HeaderBlock as HeaderBlockType,
  FeatureBlock as FeatureBlockType,
  FeaturedTextBlock as FeaturedTextBlockType,
  CarouselBlock as CarouselBlockType,
  MediaBlock as MediaBlockType,
  MediaCountBlock as MediaCountBlockBlock,
  CustomComponentBlock as CustomComponentBlockType,
  TextBlock as TextBlockType,
} from '@/gql/graphql';
import { ArticleBanner } from '../components/ArticleBanner';
import { ArticleBody } from '../components/ArticleBody';
import { ArticleContainer } from '../components/ArticleContainer';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleTitle } from '../components/ArticleTitle';
import { ProseCard } from './proseCard';

const backgroundColorMap: { [key: string]: string } = {
  white: 'bg-white',
  light: 'bg-slate-50',
  gray: 'bg-slate-100',
};

export function Blocks({ blocks }: { blocks: [any] }) {
  if (!blocks) return null;

  return <>
    {blocks?.map((block, index) => {
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
  </>;
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
