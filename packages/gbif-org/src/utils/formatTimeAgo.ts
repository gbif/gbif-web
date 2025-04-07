import type { IntlFormatters } from 'react-intl';

type Args = {
  date: string | Date;
  formatRelativeTime: IntlFormatters['formatRelativeTime'];
};

export function formatTimeAgo({ date: rawDate, formatRelativeTime }: Args): string | undefined {
  // Make sure the date is a Date object
  const date = typeof rawDate === 'string' ? new Date(rawDate) : rawDate;

  // Make sure the date is valid
  if (isNaN(date.getTime())) {
    console.warn('Invalid date provided to formatTimeAgo', rawDate);
    return;
  }

  const referenceDate = new Date();

  // Calculate the time difference in milliseconds
  const diffMs = date.getTime() - referenceDate.getTime();

  // Define time constants in milliseconds
  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;

  // Special handling for months, quarters, and years due to variable length
  const diffMonths =
    (date.getFullYear() - referenceDate.getFullYear()) * 12 +
    (date.getMonth() - referenceDate.getMonth());
  const diffQuarters = Math.floor(Math.abs(diffMonths) / 3) * Math.sign(diffMonths);
  const diffYears = Math.floor(Math.abs(diffMonths) / 12) * Math.sign(diffMonths);

  // Determine the most appropriate unit based on the time difference
  let value: number;
  let unit: Parameters<Intl.RelativeTimeFormat['format']>[1];

  if (Math.abs(diffMs) < MINUTE) {
    value = Math.round(diffMs / SECOND);
    unit = 'second';
  } else if (Math.abs(diffMs) < HOUR) {
    value = Math.round(diffMs / MINUTE);
    unit = 'minute';
  } else if (Math.abs(diffMs) < DAY) {
    value = Math.round(diffMs / HOUR);
    unit = 'hour';
  } else if (Math.abs(diffMs) < WEEK) {
    value = Math.round(diffMs / DAY);
    unit = 'day';
  } else if (Math.abs(diffMonths) < 1) {
    value = Math.round(diffMs / WEEK);
    unit = 'week';
  } else if (Math.abs(diffMonths) < 3) {
    value = diffMonths;
    unit = 'month';
  } else if (Math.abs(diffYears) < 1) {
    value = diffQuarters;
    unit = 'quarter';
  } else {
    value = diffYears;
    unit = 'year';
  }

  // Return the formatted string
  return formatRelativeTime(value, unit);
}
