import { cn } from '@/utils/shadcn';
import { AiFillTag as NameTagIcon } from 'react-icons/ai';
import { FaGlobeAfrica as GlobeIcon } from 'react-icons/fa';
import { GiDna1 as DnaIcon } from 'react-icons/gi';
import { MdLink, MdGridOn as SamplingEventIcon, MdStar as TypeStatusIcon } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import {
  Classification,
  GadmClassification as GadmClassificationList,
  TaxonClassification as TaxonClassificationList,
} from './classification';
import { ConceptValue } from './conceptValue';
import { Hostname } from './headerComponents';
import { IIIFLogoIcon } from './icons/icons';
import { Skeleton } from './ui/skeleton';
export { IoPinSharp as OccurrenceIcon } from 'react-icons/io5';
export {
  MdOutlineScreenSearchDesktop as CatalogIcon,
  MdFormatQuote as CitationIcon,
  MdPeople as PeopleIcon,
} from 'react-icons/md';

export { DnaIcon, GlobeIcon, IIIFLogoIcon, SamplingEventIcon, TypeStatusIcon };

export function GenericFeatureSkeleton() {
  return (
    <GenericFeature>
      <Skeleton className="g-w-32">Loading</Skeleton>
    </GenericFeature>
  );
}

export function GenericFeature({
  className,
  children,
  testId,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  testId?: string;
} & React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'g-my-0.5 g-me-12 [&>svg]:g-me-2 [&>svg]:g-leading-2 [&>svg]:g-h-6 [&>svg]:g-flex-none g-inline-flex g-items-start',
        className
      )}
      data-cy={testId}
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
    <div className={cn('g-flex g-flex-wrap g-items-center -g-my-1 g-mt-3', className)} {...props}>
      {children}
    </div>
  );
}

export function Homepage({
  url,
  ...props
}: {
  url?: string;
  testId?: string;
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

export function Coordinates({
  str,
  children,
}: {
  str?: string | null;
  children?: React.ReactNode;
}) {
  if (!str) return null;
  return (
    <GenericFeature>
      <GlobeIcon />
      {str}
    </GenericFeature>
  );
}

export function TaxonClassification({
  classification,
  majorOnly,
  className,
  showIcon = true,
}: {
  classification: { rank?: string | null; name?: string | null }[];
  majorOnly?: boolean;
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <GenericFeature className={className}>
      {showIcon && <NameTagIcon />}
      <TaxonClassificationList classification={classification} majorOnly={majorOnly} />
    </GenericFeature>
  );
}

export function GadmClassification({
  gadm,
  className,
  children,
  ...props
}: {
  gadm: {
    level1: { name: string };
    level0: { name: string };
    level2: { name: string };
    level3: { name: string };
    level4: { name: string };
  };
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <GenericFeature className={className}>
      <GlobeIcon />
      <div>
        <GadmClassificationList gadm={gadm} className="g-inline-block g-me-2" /> {children}
      </div>
    </GenericFeature>
  );
}

export function SamplingEvent({ className }: { className?: string }) {
  return (
    <GenericFeature className={className}>
      <SamplingEventIcon />{' '}
      <span>
        <FormattedMessage id="occurrenceDetails.features.isSamplingEvent" />
      </span>
    </GenericFeature>
  );
}

export function Sequenced({ className }: { className?: string }) {
  return (
    <GenericFeature className={className}>
      <DnaIcon />{' '}
      <span>
        <FormattedMessage id="occurrenceDetails.features.isSequenced" />
      </span>
    </GenericFeature>
  );
}

export function TypeStatus({ types, className }: { className?: string; types?: [string] | null }) {
  if (!types) return null;
  const typeStatus = types?.[0];
  // if the list of types is empty or a single value `NOTATYPE` then return null
  if (!typeStatus || typeStatus === 'NotAType') return null;

  // now we need to select a style for the label based on the type. We are just going to select the first one
  let typeStyle = {};
  if (['Holotype', 'Lectotype', 'Neotype'].includes(typeStatus))
    typeStyle = { background: '#e2614a', color: 'white', padding: '0 8px', borderRadius: 2 };
  if (['Paratype', 'Paralectotype', 'Syntype'].includes(typeStatus))
    typeStyle = { background: '#f1eb0b', padding: '0 8px', borderRadius: 2 };
  if (['Allotype'].includes(typeStatus))
    typeStyle = { background: '#7edaff', color: 'white', padding: '0 8px', borderRadius: 2 };

  return (
    <GenericFeature className={className}>
      <TypeStatusIcon />{' '}
      <span style={typeStyle}>
        <ConceptValue vocabulary="TypeStatus" name={typeStatus} />
      </span>
    </GenericFeature>
  );
}

export function IIIF({ url }: { url: string }) {
  return (
    <GenericFeature>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <IIIFLogoIcon />
      </a>
    </GenericFeature>
  );
}
