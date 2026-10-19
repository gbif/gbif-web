import Properties, { Term, Value } from '@/components/properties';
import { LongDate } from '@/components/dateFormats';
import { DatasetQuery } from '@/gql/graphql';

export function TemporalCoverages({
  temporalCoverages,
}: {
  temporalCoverages: NonNullable<DatasetQuery['dataset']>['temporalCoverages'];
}) {
  return (
    <>
      <Properties useDefaultTermWidths>
        {(temporalCoverages ?? []).map((period, idx) => (
          <TemporalCoverage period={period} key={idx} />
        ))}
      </Properties>
    </>
  );
}

// the schema exposes temporal coverages as untyped JSON
function TemporalCoverage({ period }: { period: any }) {
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
