import { jsx } from '@emotion/react';
import React from "react";
import { Properties, Accordion, HyperText } from "../../../../components";
import { FormattedMessage, FormattedDate } from "react-intl";

const { Term: T, Value: V } = Properties;

export function Project({
  project,
  ...props
}) {
  return <Properties style={{ marginBottom: 12 }} horizontal={true}>
    {dataset.samplingDescription?.sampling && <>
      <T><FormattedMessage id={`dataset.sampling`} defaultMessage="Sampling" /></T>
      <V><HyperText text={dataset.samplingDescription.sampling} /></V></>}
    {dataset.samplingDescription?.studyExtent && <>
      <T><FormattedMessage id={`dataset.studyExtent`} defaultMessage="Study extent" /></T>
      <V><HyperText text={dataset.samplingDescription.studyExtent} /></V></>
    }
    {dataset.samplingDescription?.qualityControl && <>
      <T><FormattedMessage id={`dataset.qualityControl`} defaultMessage="Quality control" /></T>
      <V><HyperText text={dataset.samplingDescription.qualityControl} /></V></>
    }
    {dataset.samplingDescription?.methodSteps && dataset.samplingDescription?.methodSteps?.length > 0 && <>
      <T><FormattedMessage id={`dataset.methodSteps`} defaultMessage="Method steps" /></T>
      <V>
        <ol style={{ padding: "0px", margin: 0 }}>
          {dataset.samplingDescription.methodSteps.map((s, i) => <li key={s} style={i < dataset.samplingDescription.methodSteps.length - 1 ? { marginBottom: "12px" } : null}><HyperText text={s} /></li>)}
        </ol>
      </V></>
    }
  </Properties>
}


