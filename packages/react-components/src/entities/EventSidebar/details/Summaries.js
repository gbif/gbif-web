import React, {useContext} from 'react';
import { Properties } from "../../../components";
import * as css from "../styles";
import {Group} from "./Groups";
import {EnumFacetListInline, FacetList, FacetListInline} from "./properties";
import {Measurements} from "./Measurements";
import {SingleTree} from "./Tree/SingleTree";

const { Term: T, Value: V } = Properties;

export function Summaries({ event, data, showAll }) {

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
      && data.results.documents.results[0].eventType.concept) {
    hasEventType = true;
  }

  let combinedHierarchy = [];

  if (hasEventType) {

    const eventHierarchy = event.eventHierarchy;
    const eventTypeHierarchy = event.eventTypeHierarchy;

    for (let i = 0; i < eventHierarchy.length; i++) {
      combinedHierarchy.push({
        key: eventHierarchy[i],
        name: eventTypeHierarchy[i],
        isSelected: eventTypeHierarchy[i] == event.eventType.concept,
        count: 1
      });
    }

    // complete the hierarchy
    const eventHierarchyJoined = data?.results.facet.eventTypeHierarchyJoined.sort(function (a, b) {
      return a.key.length - b.key.length
    });

    let completeEventHierarchyAsStr = combinedHierarchy.map(node => node.name).join(" / ");

    eventHierarchyJoined.forEach(h => {
      if (h.key.startsWith(completeEventHierarchyAsStr + " / ")) {
        let restOfHierarchy = h.key.substring((completeEventHierarchyAsStr + " / ").length)
        let verticies = restOfHierarchy.split('/').map(s => s.trim());
        if (verticies && verticies.length > 0) {
          let v = verticies[0];
          combinedHierarchy.push({
            key: v,
            name: v,
            isSelected: false,
            count: h.count
          });
        }
        completeEventHierarchyAsStr = combinedHierarchy.map(node => node.name).join(" / ");
      }
    });

    // add occurrences hierarchy
    const occurrenceHierarchyJoined = data?.results.occurrenceFacet.eventTypeHierarchyJoined;

    occurrenceHierarchyJoined.forEach(h => {
      if (h.key.startsWith(completeEventHierarchyAsStr)) {
        combinedHierarchy.push({
          key: "Occurrence",
          name: "Occurrence",
          count: h.count,
          isSelected: false,
        });
        completeEventHierarchyAsStr = combinedHierarchy.map(node => node.name).join(" / ");
      }
    });
  }

  return <>
    <Group label="eventDetails.groups.occurrence">
      <Properties css={css.properties} breakpoint={800}>
        <EnumFacetListInline term={termMap.basisOfRecord} showDetails={showAll}  getEnum={value => `enums.basisOfRecord.${value}`}/>
      </Properties>
    </Group>
    <Group label="eventDetails.groups.dataStructure">
      {hasEventType &&
          <SingleTree hierarchy={combinedHierarchy} />
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
  ].find(x => termMap[x] && (Array.isArray(termMap[x]) ? termMap[x].length > 0 : true));
  if (!hasContent) return null;
  return <Group label="eventDetails.groups.methodology">
    <Properties css={css.properties} breakpoint={800}>
      <FacetList term={termMap.recordedBy} showDetails={showAll} />
      <FacetList term={termMap.samplingProtocol} showDetails={showAll} />
    </Properties>
  </Group>
}
