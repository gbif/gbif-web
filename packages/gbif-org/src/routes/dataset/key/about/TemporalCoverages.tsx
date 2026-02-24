import Properties, { Term, Value } from '@/components/properties';
import { LongDate } from '@/components/dateFormats';

export function TemporalCoverages({ temporalCoverages, ...props }) {
  return (
    <>
      <Properties useDefaultTermWidths>
        {temporalCoverages.map((period, idx) => (
          <TemporalCoverage period={period} key={idx} />
        ))}
      </Properties>
    </>
  );
}

function TemporalCoverage({ period }) {
  return (
    <>
      <Term>{period['@type']}</Term>
      {period['@type'] == 'range' && (
        <Value>
          <LongDate value={period.start} /> - <LongDate value={period.end} />
        </Value>
      )}
      {period['@type'] == 'single' && (
        <Value>
          <LongDate value={period.date} />
        </Value>
      )}
      {period['@type'] == 'verbatim' && <Value>{period.period}</Value>}
    </>
  );
}
