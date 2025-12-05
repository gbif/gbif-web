import { jsx, css } from '@emotion/react';
import React, { useState } from "react";
import { Properties, Button, HyperText } from "../../../../components";
import { FormattedMessage } from 'react-intl';
import * as sharedStyles from '../../../shared/styles';

const { Term: T, Value: V } = Properties;

export function TaxonomicCoverages({
  dataset,
  taxonomicCoverages,
  ...props
}) {
  return <>
    {taxonomicCoverages.map((coverage, idx) => <TaxonomicCoverage coverage={coverage} key={idx} />)}
  </>
}

function TaxonomicCoverage({coverage}) {
  // I really dislike "show all"-buttons that only show me one more item. Just show the damn item to begin with then. It is such a disappointing experience.
  // So instead we do: if less than 10 items then show them all. If above 10, then show 5 + expand button.
  // then it feels like you are rewarded for your action
  const [threshold, setThreshold] = useState(5);
  const coverages = coverage.coverages.length < 10 ? coverage.coverages : coverage.coverages.slice(0,threshold);
  const hasHidden = coverage.coverages.length > coverages.length;
  
  return <Properties css={sharedStyles.cardProperties}>
    <T><FormattedMessage id="dataset.description" /></T>
    <V><HyperText text={coverage.description} /></V>
    
    <T><FormattedMessage id="dataset.coverage" /></T>
    <V>
      {coverages.map((c, i) => <CoverageItem key={i} item={c} lastItem={coverage.coverages[i-1]} />)}
      {hasHidden && <><br /><Button onClick={() => setThreshold(500)}><FormattedMessage id="phrases.showAll" /></Button></>}
    </V>
  </Properties>
}

function CoverageItem({item, lastItem}) {
  return <>
    {/* Assuming that taxa is ordered by rank, then a simple way to add some ordering is to add a line break when rank changes */}
    {lastItem && lastItem?.rank?.interpreted !== item?.rank?.interpreted && <br />}
    <span css={coverageItem}>
      <span>{item.scientificName}</span>
      <span css={coverageItem_common}>{item.commonName}</span>
    </span>
  </>
}

const coverageItem_common = ({ ...props }) => css`
  color: #888;
  margin-left: 4px;
`;

const coverageItem = ({ ...props }) => css`
  margin: 3px;
  padding: 1px 3px;
  border: 1px solid #ddd;
  display: inline-block;
  background: #efefef;
`;