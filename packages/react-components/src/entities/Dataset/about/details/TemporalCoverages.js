import { jsx } from '@emotion/react';
import React from "react";
import { Properties } from "../../../../components";
import { FormattedMessage, FormattedDate } from "react-intl";

const { Term: T, Value: V } = Properties;

export function TemporalCoverages({
  temporalCoverages,
  ...props
}) {
  return <>
    <Properties horizontal>
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
    <T>{period['@type']}</T>
    {period['@type'] == 'range' && <V>
      <Date value={period.start} /> - <Date value={period.end} />
    </V>}
    {period['@type'] == 'single' && <V>
      <Date value={period.date} />
    </V>}
    {period['@type'] == 'verbatim' && <V>
      {period.period}
    </V>}
  </>
}