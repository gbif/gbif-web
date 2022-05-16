import React from 'react';
import { Properties } from "../../../components";
import { PlainTextField } from './properties';
import * as css from "../styles";
import {Group} from "./Groups";

const { Term: T, Value: V } = Properties;

export function Summaries({ data, showAll }) {
  let termMap = {}
  Object.entries(data.results.facet).forEach(item => {
    var valueAsString = "";
    if (item[1]){
      item[1].forEach((x, i) => {
        if (i>0){
          valueAsString = valueAsString + ", "
        }
        valueAsString = valueAsString + x.key + " (" + x.count +")";
      })
    }
    termMap[item[0]] = {
      "simpleName": item[0],
      "value": valueAsString
    }
  })

  return <>
    <Methodology             {...{ showAll, termMap }} />
    <TaxonomicCoverage        {...{ showAll, termMap }} />
  </>
}

function TaxonomicCoverage({ showAll, termMap }) {
  const hasContent = [
    'kingdoms',
    'phyla',
    'orders',
    'classes',
    'families',
    'genera'
  ].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="eventDetails.groups.taxonomicCoverage">
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField term={termMap.kingdoms} showDetails={showAll}/>
      <PlainTextField term={termMap.phyla} showDetails={showAll}/>
      <PlainTextField term={termMap.orders} showDetails={showAll}/>
      <PlainTextField term={termMap.classes} showDetails={showAll}/>
      <PlainTextField term={termMap.families} showDetails={showAll}/>
      <PlainTextField term={termMap.genera} showDetails={showAll}/>
    </Properties>
  </Group>
}

function Methodology({ showAll, termMap }) {
  const hasContent = [
    'eventTypeHierarchy',
    'eventHierarchy',
    'eventTypeHierarchyJoined',
    'eventHierarchyJoined',
    'samplingProtocol'
  ].find(x => termMap[x]);
  if (!hasContent) return null;
  return <Group label="eventDetails.groups.methodology">
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField term={termMap.eventTypeHierarchyJoined} showDetails={showAll} />
      <PlainTextField term={termMap.samplingProtocol} showDetails={showAll} />
    </Properties>
  </Group>
}
