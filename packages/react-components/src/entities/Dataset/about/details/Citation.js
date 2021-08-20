
import { jsx } from '@emotion/react';
import React from "react";
import { Properties, Accordion } from "../../../../components";
import { HyperText } from "../../../../components";

const { Term: T, Value: V } = Properties;

export function Citation({
  data = {},
  loading,
  error,
  ...props
}) {

  const { dataset } = data;

  return dataset?.citation?.text ? (
    <HyperText text={dataset.citation.text} />
  ) : null;
}

