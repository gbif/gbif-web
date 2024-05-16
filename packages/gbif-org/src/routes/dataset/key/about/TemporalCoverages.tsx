import Properties, { Term, Value } from "@/components/Properties";
import { FormattedDate } from "react-intl";

export function TemporalCoverages({
  temporalCoverages,
  ...props
}) {
  return <>
    <Properties useDefaultTermWidths>
      {temporalCoverages.map((period, idx) => <TemporalCoverage period={period} key={idx} />)}
    </Properties>
  </>
}

function Date({ value }) {
  return <FormattedDate value={value}
    year="numeric"
    month="long"
    day="2-digit" />
}

function TemporalCoverage({ period }) {
  return <>
    <Term>{period['@type']}</Term>
    {period['@type'] == 'range' && <Value>
      <Date value={period.start} /> - <Date value={period.end} />
    </Value>}
    {period['@type'] == 'single' && <Value>
      <Date value={period.date} />
    </Value>}
    {period['@type'] == 'verbatim' && <Value>
      {period.period}
    </Value>}
  </>
}