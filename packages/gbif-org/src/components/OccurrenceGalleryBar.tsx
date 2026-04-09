import { ClientImage as Image } from '@/components/image';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { MdImage } from 'react-icons/md';
import { FormattedNumber } from 'react-intl';
import styles from './occurrenceGalleryBar.module.css';
import { ParamQuery } from '@/utils/querystring';

export function OccurrenceGalleryBar({
  className,
  images = [],
  link,
  total,
  searchParams,
  ...props
}: {
  className?: string;
  images?: { occurrenceKey: string; thumbor?: string | null }[];
  link?: React.ReactNode;
  total: number;
  searchParams: ParamQuery;
}) {
  if (!(total > 0)) return null;
  return (
    <div className={cn(`galleryBar ${styles.galleryBar}`, className)} {...props}>
      <div>
        {images.map((image) => {
          return (
            <DynamicLink
              key={image.occurrenceKey + image.thumbor}
              pageId="occurrenceSearch"
              searchParams={{ ...searchParams, entity: `o_${image.occurrenceKey}` }}
            >
              <Image
                src={image.thumbor ?? '/missing-image-url'}
                defaultSize={{ height: 200, width: 200 }}
                className="g-rounded g-image"
              />
            </DynamicLink>
          );
        })}
      </div>

      <Button asChild>
        {link ? (
          link
        ) : (
          <DynamicLink pageId="occurrenceSearch" searchParams={searchParams}>
            <SimpleTooltip title={<span>Records with images</span>} placement="auto">
              <div className="g-flex g-place-items-center">
                <MdImage style={{ marginRight: 8 }} />{' '}
                <span>
                  <FormattedNumber value={total} />
                </span>
              </div>
            </SimpleTooltip>
          </DynamicLink>
        )}
      </Button>
    </div>
  );
}
