import { createIntl, FormattedDate } from 'react-intl';

type DateValue = string | number | Date;

const enIntl = createIntl({ locale: 'en-GB', messages: {} });

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

/**
 * Contentful event dates carry the offset of the place the event was authored for, e.g.
 * "2026-05-18T00:00+01:00". Formatting the instant in UTC would show 17 May, so we shift the
 * instant by the authored offset. The returned Date must be formatted with timeZone="UTC"
 * (the IntlProvider default), which yields the authored wall-clock time on server and client alike.
 */
export function toWallClock(value: string): { date: Date; offsetLabel: string } {
  const match = /([+-])(\d{2}):?(\d{2})$/.exec(value);
  const instant = new Date(value);
  if (!match) return { date: instant, offsetLabel: 'UTC' };
  const sign = match[1] === '-' ? -1 : 1;
  const minutes = sign * (Number(match[2]) * 60 + Number(match[3]));
  const hh = Number(match[2]);
  const mm = match[3] === '00' ? '' : `:${match[3]}`;
  return {
    date: new Date(instant.getTime() + minutes * 60_000),
    offsetLabel: `UTC${sign < 0 ? '-' : '+'}${hh}${mm}`,
  };
}

/** "24 February 2026" in English regardless of user locale - for citations */
export function EnglishLongDate({ value }: { value: DateValue }) {
  return <>{enIntl.formatDate(value, longDateFormatProps)}</>;
}
