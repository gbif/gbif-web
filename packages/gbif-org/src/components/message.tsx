import { FormattedDate, FormattedDateTimeRange, FormattedMessage, useIntl } from 'react-intl';
import { HyperText } from './hyperText';

export function Message({
  id,
  defaultMessage,
  values,
  className,
  ...props
}: {
  id: string;
  defaultMessage?: string;
  values?: Record<string, string | number>;
  className?: string;
}) {
  const { formatMessage } = useIntl();
  const dirty = formatMessage({ ...{ id, defaultMessage, values } });
  return <HyperText text={dirty} className={className} {...props} />;
}

export function Unknown({ id = 'phrases.unknown', ...props }) {
  return (
    <span style={{ color: 'var(--color200)' }}>
      <FormattedMessage id={id} {...props} />
    </span>
  );
}

export function FormattedDateRange({
  start,
  end,
  date,
  format,
}: {
  start?: string;
  end?: string;
  date?: string;
  format?: Intl.DateTimeFormatOptions;
}) {
  if (!start && !date) return null;
  // split the event date into 2 parts, start date and end date (if applicable). split by /
  let [startDate, endDate] = date?.split('/') ?? [start, end];
  if (!startDate) return null;

  // if there is no end date, just show the start date
  // but first get the resolution of the start date (year, month, day) seperated by -
  const startDateParts = startDate.split('-');
  const hasTime = startDate.includes('T');
  const resolution = format ?? {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }; // if we need it timeZoneName: 'short'
  if (startDateParts.length < 3) {
    delete resolution.day;
  }
  if (startDateParts.length < 2) {
    delete resolution.month;
  }

  if (!hasTime) {
    delete resolution.hour;
    delete resolution.minute;
    // add a time zone to the date if it doesn't have one
    startDate = startDate + 'T00:00:00Z';
  } else if (!startDate.includes('Z')) {
    // add a time zone to the date if it doesn't have one
    startDate = startDate + 'Z';
  }

  let diplayDate = <FormattedDate value={startDate} {...resolution} timeZone="UTC" />;

  if (endDate) {
    // if there is an end date, show the start date and end date
    diplayDate = (
      <FormattedDateTimeRange
        from={new Date(startDate)}
        to={new Date(endDate)}
        {...resolution}
        timeZone="UTC"
      />
    );
  }
  return diplayDate;
}
