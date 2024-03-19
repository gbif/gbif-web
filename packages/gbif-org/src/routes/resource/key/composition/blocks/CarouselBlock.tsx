import { fragmentManager } from '@/services/FragmentManager';
import { CarouselBlockDetailsFragment } from '@/gql/graphql';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { BlockItem } from '../BlockItem';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/shadcn';
import { useI18n } from '@/contexts/i18n';
import { BlockContainer, BlockHeading, backgroundColorMap } from './_shared';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { ArticleBody } from '../../components/ArticleBody';

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
    <BlockContainer className={backgroundColor}>
      {resource.title && <BlockHeading dangerouslySetHeading={{ __html: resource.title }} />}
      {resource.body && (
        <ArticleTextContainer className="mt-2 mb-10">
          <ArticleBody dangerouslySetBody={{ __html: resource.body }} />
        </ArticleTextContainer>
      )}
      <div className="max-w-6xl w-full px-10 my-10 m-auto">
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
          <div className="flex justify-center items-center gap-2 pt-8">
            {Array.from({ length: count }).map((_, idx) => (
              <button
                key={idx}
                className={cn('border-gray-600 border rounded-full h-3 w-3', {
                  'bg-gray-600': idx === current,
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
