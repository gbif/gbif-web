
import { jsx } from '@emotion/react';
import React from 'react';
import { Properties, HyperText } from '../../../../components'

const { Term: T, Value: V } = Properties;

export function Registration({
  dataset = {},
  ...props
}) {
  const { machineTags = [], doi, endpoints = [], identifiers = [], created, modified, pubDate, installation } = dataset;
  const { organization: hostingOrganization } = installation;
  const urlEndpoints = endpoints.filter(x => x.url);
  const visibleIdentifiers = identifiers.filter(x => ['DOI', 'URL', 'LSID', 'FTP', 'UNKNOWN'].indexOf(x.type) > -1);

  const orphanMachineTag = machineTags.find(machineTag =>  namespace === 'orphans.gbif.org' && name === 'status');
  const hostingStatus = orphanMachineTag ? orphanMachineTag.value : undefined;

  return <div style={{ paddingBottom: 12, marginBottom: 12 }}>
    <Properties style={{ marginBottom: 12 }} horizontal={true}>
      <T>created</T>
      <V>{created}</V>

      <T>modified</T>
      <V>{modified}</V>

      <T>pubDate</T>
      <V>{pubDate}</V>

      <T>hostingOrganization</T>
      <V>{hostingOrganization?.title}</V>

      <T>installation</T>
      <V>{installation?.title}</V>

      <T>Endpoints</T>
      <V>
        <Properties breakpoint={800} horizontal={false}>
          {urlEndpoints.map(endpoint => <>
            <T>{endpoint.type}</T>
            <V><a key={endpoint.key}>{endpoint.url} {endpoint.type}</a></V>
          </>)}
        </Properties>
      </V>

      <T>hostingStatus</T>
      <V>{hostingStatus}</V>

      <T>Preferred identifier</T>
      <V>
        {doi}
      </V>

      <T>Alternative identifiers</T>
      <V>
        <Properties breakpoint={800} horizontal={false}>
          {visibleIdentifiers.map(identifier => <>
            <T>{identifier.type}</T>
            <V><HyperText text={identifier.identifier} key={identifier.key} /></V>
          </>)}
        </Properties>
      </V>
    </Properties>

    <p>See details in the <a href={`https://registry.gbif.org/dataset/${ dataset.key }/ingestion-history`}>GBIF Registry</a></p>

  </div>;
};