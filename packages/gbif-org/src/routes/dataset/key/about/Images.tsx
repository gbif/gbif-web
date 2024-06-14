import { FormattedNumber } from 'react-intl';
import { MdImage } from 'react-icons/md';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { DynamicLink } from '@/components/dynamicLink';
import { Button } from '@/components/ui/button';
import { ClientImage as Image } from '@/components/image';
import styles from './images.module.css';
import { cn } from '@/utils/shadcn';

export function Images({ dataset, className, images = [], ...props }) {
  if (!(images?.documents?.total > 0)) return null;
  return (
    <div className={cn(`galleryBar ${styles.galleryBar}`, className)} {...props}>
      <div>
        {images.documents.results.map((occurrence) => {
          return (
            <div key={occurrence.key}>
              <Image
                src={occurrence.stillImages[0].identifier}
                defaultSize={{ height: 200, width: 200 }}
              />
            </div>
          );
        })}
      </div>

      <Button asChild>
        <DynamicLink to={`/dataset/${dataset.key}/occurrences?view=GALLERY`}>
          <SimpleTooltip title={<span>Records with images</span>} placement="auto">
            <div className="g-flex g-place-items-center">
              <MdImage style={{ marginRight: 8 }} />{' '}
              <span>
                <FormattedNumber value={images?.documents?.total} />
              </span>
            </div>
          </SimpleTooltip>
        </DynamicLink>
      </Button>
    </div>
  );
}
