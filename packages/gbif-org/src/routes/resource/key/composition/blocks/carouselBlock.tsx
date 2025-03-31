import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { CarouselBlockDetailsFragment } from '@/gql/graphql';
import { useI18n } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';
import { useEffect, useState } from 'react';
import { ArticleBody } from '../../components/articleBody';
import { ArticleTextContainer } from '../../components/articleTextContainer';
import { BlockItem } from '../blockItem';
import { backgroundColorMap, BlockContainer, BlockHeading } from './_shared';

fragmentManager.register(/* GraphQL */ `
  fragment CarouselBlockDetails on CarouselBlock {
    __typename
    id
    title
    body
    backgroundColour
    features {
      __typename
      ... on MediaBlock {
        ...MediaBlockDetails
      }
      ... on MediaCountBlock {
        ...MediaCountBlockDetails
      }
    }
  }
`);

type Props = {
  resource: CarouselBlockDetailsFragment;
};

export function CarouselBlock({ resource }: Props) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const { locale } = useI18n();

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <BlockContainer className={cn(backgroundColor, 'g-p-4 md:g-p-8')}>
      {resource.title && (
        <BlockHeading
          className="g-pl-4 md:g-pl-0"
          dangerouslySetHeading={{ __html: resource.title }}
        />
      )}
      {resource.body && (
        <ArticleTextContainer className="g-mt-2 g-mb-10 g-pl-4 md:g-pl-0">
          <ArticleBody dangerouslySetBody={{ __html: resource.body }} />
        </ArticleTextContainer>
      )}
      <div className="g-max-w-6xl g-w-full g-px-10 g-my-10 g-m-auto">
        <Carousel
          opts={{ loop: true, align: 'center', direction: locale.textDirection }}
          setApi={setApi}
        >
          <CarouselContent>
            {resource.features?.map((feature) => (
              <CarouselItem key={feature.id}>
                <BlockItem resource={feature} insideCarousel />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
          <div className="g-flex g-justify-center g-items-center g-gap-2 g-pt-8">
            {Array.from({ length: count }).map((_, idx) => (
              <button
                key={idx}
                className={cn('g-border-gray-600 g-border g-rounded-full g-h-3 g-w-3', {
                  'g-bg-gray-600': idx === current,
                })}
                disabled={idx === current}
                onClick={() => api?.scrollTo(idx)}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </BlockContainer>
  );
}
