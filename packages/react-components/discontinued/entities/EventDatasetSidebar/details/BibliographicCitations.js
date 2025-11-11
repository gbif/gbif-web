import React from "react";
import { jsx } from '@emotion/react';
import { Properties, Accordion } from "../../../components";
import { HyperText } from "../../../components";

const { Term: T, Value: V } = Properties;

export function BibliographicCitations({
  data = {},
  loading,
  error,
  ...props
}) {

  const { dataset } = data;

  return dataset?.bibliographicCitations?.length > 0 ? (
    <Accordion summary="Bibliography" defaultOpen={true}>
      {dataset.bibliographicCitations.map(bibiliographicCitation)}
    </Accordion>
  ) : null;
}

function bibiliographicCitation(citation) {
  return (
    <Properties
      style={{ fontSize: 13, marginBottom: 12 }}
      horizontal={true}
      key={citation.text}
    >
      <T></T>

      <V>
        {citation.text && (
          <div>
            <HyperText text={citation.text} />
          </div>
        )}
        {citation.identifier && (
          <div>
            <HyperText text={citation.identifier} />
          </div>
        )}
      </V>
    </Properties>
  );
}
