import { FormattedDate } from 'react-intl';

type DateValue = string | number | Date;

/** Long form: "24 February 2026" - for detail pages, article headers */
export const longDateFormatProps = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
} as const;

/** Medium form: "24 Feb 2026" - for result cards, lists */
export const mediumDateFormatProps = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
} as const;

/** "24 February 2026" */
export function LongDate({ value }: { value: DateValue }) {
  return <FormattedDate value={value} {...longDateFormatProps} />;
}

/** "24 Feb 2026" */
export function MediumDate({ value }: { value: DateValue }) {
  return <FormattedDate value={value} {...mediumDateFormatProps} />;
}

/** "2026" */
export function YearDate({ value }: { value: DateValue }) {
  return <FormattedDate value={value} year="numeric" />;
}

/** Short form: "2026-02-24" - for tables (locale-independent ISO format) */
export function ShortDate({ value }: { value: string | number | Date }) {
  const date = new Date(value);
  return <>{date.toISOString().slice(0, 10)}</>;
}
