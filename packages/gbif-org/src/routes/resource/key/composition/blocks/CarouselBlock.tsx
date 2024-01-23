import { fragmentManager } from '@/services/fragmentManager';
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
import { ArticleContainer } from '../../components/ArticleContainer';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { ArticleTitle } from '../../components/ArticleTitle';
import { cn } from '@/utils/shadcn';

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
  backgroundColorMap: Record<string, string>;
};

export function CarouselBlock({ resource }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <ArticleContainer>
      <ArticleTextContainer>
        <ArticleTitle>{resource.title}</ArticleTitle>
      </ArticleTextContainer>
      <div className="flex justify-center">
        <div className="max-w-6xl">
          <Carousel opts={{ loop: true, align: 'center' }} setApi={setApi}>
            <CarouselContent>
              {resource.features?.map((feature) => (
                <CarouselItem key={feature.id}>
                  <BlockItem resource={feature} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="flex justify-center items-center gap-2">
            {Array.from({ length: count }).map((_, idx) => (
              <button
                key={idx}
                className={cn('bg-gray-100 border rounded-full h-4 w-4', {
                  'bg-gray-300': idx === current,
                })}
                disabled={idx === current}
                onClick={() => api?.scrollTo(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </ArticleContainer>
  );
}
