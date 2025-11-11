
import { jsx } from '@emotion/react';
import React from "react";
import { Properties, Accordion } from "../../../components";
import { HyperText } from "../../../components";

const { Term: T, Value: V } = Properties;

export function Citation({
  data = {},
  loading,
  error,
  ...props
}) {

  const { dataset } = data;

  return dataset?.citation?.text ? (
    <Accordion summary="Citation" defaultOpen={true}>
      <Properties
      style={{ fontSize: 13, marginBottom: 12 }}
      horizontal={true}
    >
      <T></T>

      <V>
       {<HyperText text={dataset.citation.text} />}
      </V>
    </Properties>
    </Accordion>
  ) : null;
}

