import { cn } from '@/utils/shadcn';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { ErrorMessage } from './errorMessage';

type DateType = string | number | Date | null | undefined;

/**
 * Returns a message that the record was deleted on the provided date. If no date is provided it will return null
 */
export function DeletedMessage({
  date,
  ...props
}: {
  date: DateType;
} & React.ComponentProps<typeof ErrorMessage>) {
  if (!date) return null;
  return (
    <ErrorMessage {...props}>
      <FormattedMessage
        id="phrases.deletedOnDate"
        values={{
          date: <FormattedDate value={date} {...defaultDateFormatProps} />,
        }}
      />
    </ErrorMessage>
  );
}

export const defaultDateFormatProps = {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
} as const;

export function Hostname({
  href,
  className,
  ...props
}: {
  href: string;
  className?: string;
} & React.ComponentProps<'a'>) {
  const link = href.startsWith('http') ? href : `http://${href}`;
  try {
    const hostname = new URL(link).hostname;
    return (
      <a
        href={link}
        {...props}
        rel="noopener noreferrer"
        className={cn('hover:g-underline g-text-inherit', className)}
      >
        {hostname}
      </a>
    );
  } catch (err) {
    return (
      <a href={href} className="g-text-red-400" rel="noopener noreferrer" {...props}>
        {href}
      </a>
    );
  }
}

export function HeaderInfoMain({
  children,
  className,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<'div'>) {
  return (
    <div className={cn('g-flex-grow', className)} {...props}>
      {children}
    </div>
  );
}

export function HeaderInfoEdit({
  className,
  ...props
}: {
  className?: string;
} & React.ComponentProps<'div'>) {
  return <div className={cn('g-flex-shrink', className)} {...props} />;
}

export function HeaderInfo({
  children,
  className,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<'div'>) {
  return (
    <div className={cn('g-mt-4 g-block md:g-flex g-items-end', className)} {...props}>
      {children}
    </div>
  );
}
