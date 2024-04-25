import { FormattedMessage, FormattedDate } from 'react-intl';
import { cn } from '@/utils/shadcn';
import { ErrorMessage } from './ErrorMessage';

type DateType = string | number | Date | null | undefined;

/**
 * Returns a message that the record was deleted on the provided date. If no date is provided it will return null
 */
export function DeletedMessage({
  date,
  ...props
}: {
  date: DateType;
  props?: React.ComponentProps<typeof ErrorMessage>;
}) {
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
  props?: React.ComponentProps<'a'>;
}) {
  try {
    const hostname = new URL(href).hostname;
    return (
      <a href={href} {...props} className={cn('hover:underline', className)}>
        {hostname}
      </a>
    );
  } catch (err) {
    return (
      <a href={href} className="text-red-400" {...props}>
        {href}
      </a>
    );
  }
}

export function GenericFeature({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  props?: React.ComponentProps<'div'>;
}) {
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
