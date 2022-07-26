import React from 'react';
import { Properties } from "../../../components";
import * as css from "../styles";
import {Group} from "./Groups";
import {Tree} from "./Tree/Tree";
import {FacetList, FacetListInline} from "./properties";
import {Measurements} from "./Measurements";

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

  let hasEventType = false;
  if (data.results.documents.results
      && data.results.documents.results.length > 0
      && data.results.documents.results[0].eventType
      && data.results.documents.results[0].eventType.concept)
  {
    hasEventType = true;
  }

  // get the hierarchy from
  const eventHierarchy = data?.results.facet.eventTypeHierarchyJoined;
  // get the hierarchy from
  const occurrenceHierarchy = data?.results.occurrenceFacet.eventTypeHierarchyJoined;

  let combinedHierarchy = [];

  if (eventHierarchy && occurrenceHierarchy) {
    eventHierarchy.forEach(h => combinedHierarchy.push(h));
    occurrenceHierarchy.forEach(h => {
      combinedHierarchy.push({
        key: h.key + " / Occurrence",
        count: h.count
      })
    });
  }

  return <>
    <Group label="Occurrences">
      <Properties css={css.properties} breakpoint={800}>
        <FacetListInline term={termMap.basisOfRecord} showDetails={showAll}/>
      </Properties>
    </Group>

    <Group label="eventDetails.groups.dataStructure">
      {hasEventType &&
          <Tree data={combinedHierarchy} selected={data.results.documents.results[0].eventType.concept}/>
      }
    </Group>
    <Methodology             {...{ showAll, termMap }} />
    <TaxonomicCoverage       {...{ showAll, termMap }} />
    <Measurements             data={data}  />
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
      <FacetListInline term={termMap.class} showDetails={showAll}/>
      <FacetListInline term={termMap.order} showDetails={showAll}/>
      <FacetListInline term={termMap.family} showDetails={showAll}/>
      <FacetListInline term={termMap.genus} showDetails={showAll}/>
    </Properties>
  </Group>
}

function Methodology({ showAll, termMap }) {
  const hasContent = [
    'recordedBy',
    'samplingProtocol'
  ].find(x => termMap[x]);
  if (!hasContent) return null;
  return <Group label="eventDetails.groups.methodology">
    <Properties css={css.properties} breakpoint={800}>
      <FacetList term={termMap.samplingProtocol} showDetails={showAll} />
      <FacetList term={termMap.recordedBy} showDetails={showAll} />
    </Properties>
  </Group>
}
