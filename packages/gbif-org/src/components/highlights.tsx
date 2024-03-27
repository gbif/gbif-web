import { cn } from '@/utils/shadcn';
import { MdLink } from 'react-icons/md';
import { Hostname } from './headerComponents';
import { FormattedMessage } from 'react-intl';
export { IoPinSharp as OccurrenceIcon } from 'react-icons/io5';
export {
  MdFormatQuote as CitationIcon,
  MdOutlineScreenSearchDesktop as CatalogIcon,
  MdPeople as PeopleIcon,
} from 'react-icons/md';
import { FaGlobeAfrica as GlobeIcon } from 'react-icons/fa';
import { Classification } from './classification';
export { GlobeIcon as GlobeIcon };

export function GenericFeature({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'my-0.5 me-6 [&>svg]:me-2 [&>svg]:leading-2 [&>svg]:h-6 inline-flex items-start',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function FeatureList({
  children,
  className,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-wrap items-center -my-1 mt-3', className)} {...props}>
      {children}
    </div>
  );
}

export function Homepage({
  url,
  ...props
}: {
  url?: string;
} & Omit<React.ComponentProps<typeof GenericFeature>, 'children'>) {
  if (!url) return null;
  return (
    <GenericFeature {...props}>
      <MdLink />
      <span>
        <Hostname href={url} />
      </span>
    </GenericFeature>
  );
}

export function Location({
  countryCode,
  city,
  locality,
  children,
}: {
  countryCode?: string | null;
  city?: string | null;
  locality?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <GenericFeature>
      <GlobeIcon />
      <Classification>
        {countryCode && (
          <span>
            <FormattedMessage id={`enums.countryCode.${countryCode}`} />
          </span>
        )}
        {city && <span>{city}</span>}
        {locality && <span>{locality}</span>}
        {children}
      </Classification>
    </GenericFeature>
  );
}
