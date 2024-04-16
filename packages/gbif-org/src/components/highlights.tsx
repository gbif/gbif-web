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
import { AiFillTag as NameTagIcon } from 'react-icons/ai';
import { MdGridOn as SamplingEventIcon, MdStar as TypeStatusIcon } from 'react-icons/md';

import {
  Classification,
  TaxonClassification as TaxonClassificationList,
  GadmClassification as GadmClassificationList,
} from './classification';
import { TypeStatus as TypeStatusEnums } from '@/gql/graphql';
export { GlobeIcon as GlobeIcon };
export { SamplingEventIcon, TypeStatusIcon };

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

export function TaxonClassification({
  classification,
  majorOnly,
  className,
}: {
  classification: { rank: string; name?: string }[];
  majorOnly?: boolean;
  className?: string;
}) {
  return (
    <GenericFeature className={className}>
      <NameTagIcon />
      <TaxonClassificationList classification={classification} majorOnly={majorOnly} />
    </GenericFeature>
  );
}

export function GadmClassification({
  gadm,
  className,
  ...props
}: {
  gadm: {
    level1: { name: string };
    level0: { name: string };
    level2: { name: string };
    level3: { name: string };
    level4: { name: string };
  };
  className?: string;
}) {
  return (
    <GenericFeature className={className}>
      <GlobeIcon />
      <GadmClassificationList gadm={gadm} />
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

export function TypeStatus({ types, className }: { className?: string; types: [TypeStatusEnums?] }) {
  const typeStatus = types?.[0];
  // if the list of types is empty or a single value `NOTATYPE` then return null
  if (!typeStatus || typeStatus === TypeStatusEnums.Notatype) return null;

  // now we need to select a style for the label based on the type. We are just going to select the first one
  let typeStyle = {};
  if ([TypeStatusEnums.Holotype, TypeStatusEnums.Lectotype, TypeStatusEnums.Neotype].includes(typeStatus))
    typeStyle = { background: '#e2614a', color: 'white', padding: '0 8px', borderRadius: 2 };
  if ([TypeStatusEnums.Paratype, TypeStatusEnums.Paralectotype, TypeStatusEnums.Syntype].includes(typeStatus))
    typeStyle = { background: '#f1eb0b', padding: '0 8px', borderRadius: 2 };
  if ([TypeStatusEnums.Allotype].includes(typeStatus))
    typeStyle = { background: '#7edaff', color: 'white', padding: '0 8px', borderRadius: 2 };

  return (
    <GenericFeature className={className}>
      <TypeStatusIcon />{' '}
      <span style={typeStyle}>
        <FormattedMessage id={`enums.typeStatus.${typeStatus}`} />
      </span>
    </GenericFeature>
  );
}
