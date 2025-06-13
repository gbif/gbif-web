import { DynamicLink } from '@/reactRouterPlugins';
import { BoundingBox } from '@/types';
import { boundingBoxToWKT } from '@/utils/boundingBoxToWKT';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import { Params } from '../../options';

type Props = {
  className?: string;
  boundingBox?: BoundingBox;
  projection: string;
  filterParams?: Params;
};

export function ExploreLink({ className, projection, boundingBox, filterParams = {} }: Props) {
  const exploreAreaEnabled =
    ['EPSG_4326', 'EPSG_3857'].includes(projection) &&
    boundingBox &&
    boundingBox.right - boundingBox.left < 180;

  const searchParams = { ...filterParams };
  if (exploreAreaEnabled) {
    searchParams.geometry = boundingBoxToWKT(boundingBox);
  }

  return (
    <DynamicLink
      className={cn(
        'g-underline-offset-4 g-text-gray-500 hover:g-text-gray-600 g-underline g-text-sm',
        className
      )}
      pageId="occurrenceSearch"
      searchParams={searchParams}
    >
      <FormattedMessage id={exploreAreaEnabled ? 'map.exploreArea' : 'map.explore'} />
    </DynamicLink>
  );
}
