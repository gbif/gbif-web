import { ClientImage as Image } from '@/components/image';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { MdImage } from 'react-icons/md';
import { FormattedNumber } from 'react-intl';
import styles from './images.module.css';

export function Images({ dataset, className, images = [], link, ...props }) {
  if (!(images?.documents?.total > 0)) return null;
  return (
    <div className={cn(`galleryBar ${styles.galleryBar}`, className)} {...props}>
      <div>
        {images.documents.results.map((occurrence) => {
          return (
            <Image
              key={occurrence.key}
              src={occurrence.stillImages[0].identifier}
              defaultSize={{ height: 200, width: 200 }}
            />
          );
        })}
      </div>

      <Button asChild>
        {link ? (
          link
        ) : (
          <DynamicLink to={`./occurrences?view=GALLERY`}>
            <SimpleTooltip title={<span>Records with images</span>} placement="auto">
              <div className="g-flex g-place-items-center">
                <MdImage style={{ marginRight: 8 }} />{' '}
                <span>
                  <FormattedNumber value={images?.documents?.total} />
                </span>
              </div>
            </SimpleTooltip>
          </DynamicLink>
        )}
      </Button>
    </div>
  );
}
