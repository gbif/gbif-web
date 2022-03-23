
import { jsx } from '@emotion/react';
import React from 'react';
import { Properties, HyperText } from '../../../../components'
import { FormattedMessage, FormattedDate } from "react-intl";

const { Term: T, Value: V } = Properties;

export function Registration({
  dataset = {},
  ...props
}) {
  const { machineTags = [], doi, endpoints = [], identifiers = [], created, modified, pubDate, installation } = dataset;
  const { organization: hostingOrganization } = installation;
  const urlEndpoints = endpoints.filter(x => x.url);
  const visibleIdentifiers = identifiers.filter(x => ['DOI', 'URL', 'LSID', 'FTP', 'UNKNOWN'].indexOf(x.type) > -1);

  const orphanMachineTag = machineTags.find(machineTag => machineTag.namespace === 'orphans.gbif.org' && name === 'status');
  const hostingStatus = orphanMachineTag ? orphanMachineTag.value : undefined;

  return <div style={{ paddingBottom: 12, marginBottom: 12 }}>
    <Properties style={{ marginBottom: 12 }} horizontal={true}>
      {created && <>
        <T><FormattedMessage id="dataset.registry.registrationDate" /></T>
        <V><FormattedDate value={created}
          year="numeric"
          month="long"
          day="2-digit" /></V>
      </>}

      {modified && <>
        <T><FormattedMessage id="dataset.registry.metdataLastModified" /></T>
        <V><FormattedDate value={modified}
          year="numeric"
          month="long"
          day="2-digit" /></V>
      </>}

      {pubDate && <>
        <T><FormattedMessage id="dataset.registry.pubDate" /></T>
        <V><FormattedDate value={pubDate}
          year="numeric"
          month="long"
          day="2-digit" /></V>
      </>}

      {hostingOrganization && <>
        <T><FormattedMessage id="dataset.registry.hostedBy" /></T>
        <V>{hostingOrganization?.title}</V>
      </>}

      {installation && <>
        <T><FormattedMessage id="dataset.registry.installation" /></T>
        <V>{installation?.title}</V>
      </>}

      {urlEndpoints.length > 0 && <>
        <T><FormattedMessage id="dataset.registry.endpoints" /></T>
        <V>
          <Properties breakpoint={800} horizontal={false}>
            {urlEndpoints.map(endpoint => <React.Fragment key={endpoint.key}>
              <T><FormattedMessage id={`enums.endpointType.${endpoint.type}`} /></T>
              <V><a>{endpoint.url} {endpoint.type}</a></V>
            </React.Fragment>)}
          </Properties>
        </V>
      </>}


      {hostingStatus && <>
        <T><FormattedMessage id="dataset.registry.hostingStatus" /></T>
        <V><FormattedMessage id={`dataset.registry.${hostingStatus}`} /></V>
      </>}

      <T><FormattedMessage id="dataset.registry.preferredIdentifier" /></T>
      <V>
        {doi}
      </V>

      {visibleIdentifiers.length > 0 && <>
        <T><FormattedMessage id="dataset.registry.alternativeIdentifier" /></T>
        <V>
          <Properties breakpoint={800} horizontal={false}>
            {visibleIdentifiers.map(identifier => <React.Fragment key={identifier.key}>
              {/* <T>{ identifier.type }</T> */}
              <V><HyperText text={identifier.identifier} /></V>
            </React.Fragment>)}
          </Properties>
        </V>
      </>}
    </Properties>

    <p><a href={`https://registry.gbif.org/dataset/${dataset.key}/ingestion-history`}><FormattedMessage id="dataset.registry.registrationDetails" /></a></p>

  </div >;
};