import React from 'react';
import { Properties } from "../../../components";
import {FacetList, FacetListInline, PlainTextField} from './properties';
import * as css from "../styles";
import {Group} from "./Groups";
import {Tree} from "./Tree/Tree";

const { Term: T, Value: V } = Properties;

export function Summaries({ data, showAll }) {
  let termMap = {}
  Object.entries(data.results.facet).forEach(item => {
    termMap[item[0]] = {
      "simpleName": item[0],
      "value": item[1]
    }
  })

  Object.entries(data.results.occurrenceFacet).forEach(item => {
    termMap[item[0]] = {
      "simpleName": item[0],
      "value": item[1]
    }
  })

  return <>
    <Group label="eventDetails.groups.dataStructure">
      <Tree data={termMap.eventTypeHierarchyJoined?.value}/>
    </Group>
    <Methodology             {...{ showAll, termMap }} />
    <TaxonomicCoverage       {...{ showAll, termMap }} />
  </>
}

function TaxonomicCoverage({ showAll, termMap }) {
  const hasContent = [
    'kingdom',
    'phylum',
    'order',
    'class',
    'family',
    'genus'
  ].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="eventDetails.groups.taxonomicCoverage">
    <Properties css={css.properties} breakpoint={800}>
      <FacetListInline term={termMap.kingdom} showDetails={showAll}/>
      <FacetListInline term={termMap.phylum} showDetails={showAll}/>
      <FacetListInline term={termMap.order} showDetails={showAll}/>
      <FacetListInline term={termMap.class} showDetails={showAll}/>
      <FacetListInline term={termMap.family} showDetails={showAll}/>
      <FacetListInline term={termMap.genus} showDetails={showAll}/>
    </Properties>
  </Group>
}

function Methodology({ showAll, termMap }) {
  const hasContent = [
    'eventTypeHierarchy',
    'eventHierarchy',
    'eventTypeHierarchyJoined',
    'eventHierarchyJoined',
    'samplingProtocol',
    'measurementOrFactTypes'
  ].find(x => termMap[x]);
  if (!hasContent) return null;
  return <Group label="eventDetails.groups.methodology">
    <Properties css={css.properties} breakpoint={800}>
      <FacetList term={termMap.samplingProtocol} showDetails={showAll} />
      <FacetList term={termMap.measurementOrFactTypes} showDetails={showAll} />
    </Properties>
  </Group>
}
