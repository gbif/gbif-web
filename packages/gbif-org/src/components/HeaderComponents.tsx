import { FormattedMessage, FormattedDate } from 'react-intl';
import { cn } from '@/utils/shadcn';
import { ErrorMessage } from './ErrorMessage';

type DateType = string | number | Date | null;

/**
 * Returns a message that the record was deleted on the provided date. If no date is provided it will return null
 */
export function DeletedMessage({
  date,
  ...props
}: {
  date?: DateType;
  props?: React.ComponentProps<typeof ErrorMessage>;
}) {
  if (!date) return null;
  return (
    <ErrorMessage {...props}>
      <FormattedMessage
        id="phrases.deletedOnDate"
        values={{
          date: <FormattedDate value={date} {...defaultDateFormatProps} />, // TODO - typescript complains. it works as expected and the documentation says this is the props https://formatjs.io/docs/react-intl/components/#formatteddate, but alas i get errors. What am I doing wrong?
        }}
      />
    </ErrorMessage>
  );
}

export const defaultDateFormatProps = {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
}

export function Hostname({
  href,
  className,
  ...props
}: {
  href: string;
  className?: String;
  props?: React.ComponentProps<'a'>;
}) {
  // TODO daniel what is the correct typescrpit type for spread props? I just want to send whatever is passed on to the a tag, thinking that is agnostic. But I guess i could take the trouble og specifying which props are allowed
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
