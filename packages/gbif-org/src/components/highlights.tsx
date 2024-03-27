import { cn } from '@/utils/shadcn';
import { MdLink } from 'react-icons/md';
import { Hostname } from './headerComponents';
export { IoPinSharp as OccurrenceIcon } from 'react-icons/io5';
export { MdFormatQuote as CitationIcon } from 'react-icons/md';

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
  children,
  ...props
}: {
  url?: string;
  children?: React.ReactNode;
} & React.ComponentProps<typeof GenericFeature>) {
  // todo daniel - i get typescript errors again here. Since now it becomes a requirement to provide children.
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
