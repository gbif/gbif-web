
import { jsx, css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import * as sharedStyles from '../../shared/styles';
import { Prose, HyperText, Toc, ContactList, ResourceSearchLink, Alert, Tooltip, Progress, Message } from "../../../components";
import { Images, ThumbnailMap, TaxonomicCoverages, GeographicCoverages, TemporalCoverages, Registration, BibliographicCitations, SamplingDescription, Citation } from './details';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useRouteMatch } from 'react-router-dom';
import { formatAsPercentage, join } from '../../../utils/util';
import useBelow from '../../../utils/useBelow';
import env from '../../../../.env.json';

import { MdFormatQuote, MdGridOn, MdInfoOutline, MdLink, MdPlaylistAddCheck, MdPinDrop as OccurrenceIcon } from 'react-icons/md';
import { GiDna1 } from 'react-icons/gi';
import { Dashboard } from './Dashboard';
import { Card, CardHeader2, SideBarCard, SideBarCardContentWrap, paddedCardContent } from '../../shared';
import SiteContext from '../../../dataManagement/SiteContext';

const { NavItem } = Toc;
export function About({
  data = {},
  insights,
  loading,
  error,
  tocState,
  className,
  ...props
}) {
  const { formatMessage } = useIntl();
  const isBelowSidebar = useBelow(1000);
  const isBelowHorisontal = useBelow(700);
  let { url } = useRouteMatch();
  const siteContext = useContext(SiteContext);
  const [tocRefs] = useState({})
  const { dataset, occurrenceSearch, literatureSearch, totalTaxa, accepted, synonyms, siteOccurrences } = data;
  // collect all refs to headlines for the TOC, e.g. ref={node => { tocRefs["description"] = {node, index: 0}; }}

  const scopeSmallerThanDatasetMessage = formatMessage({ id: "dataset.siteScopeSmallerThanDataset", defaultMessage: "Visit [GBIF.org]({datasetUrl}) to explore the full dataset." }, { datasetUrl: `https://www.gbif.org/dataset/${dataset.key}` });
  const isGridded = dataset?.gridded?.[0]?.percent > 0.5; // threshold decided in https://github.com/gbif/gridded-datasets/issues/3
  const hasDna = (insights?.data?.unfiltered?.facet?.dwcaExtension || []).find(ext => ext.key === 'http://rs.gbif.org/terms/1.0/DNADerivedData');

  const withCoordinates = insights?.data?.withCoordinates?.documents?.total;
  const withYear = insights?.data?.withYear?.documents?.total;
  const withTaxonMatch = occurrenceSearch?.documents?.total - insights?.data?.withTaxonMatch?.documents?.total;

  const total = occurrenceSearch?.documents?.total;
  const withCoordinatesPercentage = formatAsPercentage(withCoordinates / total);
  const withYearPercentage = formatAsPercentage(withYear / total);
  const withTaxonMatchPercentage = formatAsPercentage(withTaxonMatch / total);

  const synonymsPercentage = formatAsPercentage(synonyms.count / totalTaxa.count);
  const acceptedPercentage = formatAsPercentage(accepted.count / totalTaxa.count);
  const gbifOverlap = dataset.metrics?.nubCoveragePct;
  const colOverlap = dataset.metrics?.colCoveragePct;

  const withEventId = insights?.data?.unfiltered?.cardinality?.eventId;
  const labelAsEventDataset = dataset.type === 'SAMPLING_EVENT' || withEventId > 1 && withEventId / total < 0.99; // Threshold chosen somewhat randomly. The issue is that some datasets assign random unique eventIds to all their occurrences. Those aren't really event datasets, it is a misunderstanding.

  const hasSamplingDescription = dataset?.samplingDescription?.studyExtent || dataset?.samplingDescription?.sampling || dataset?.samplingDescription?.qualityControl || (dataset?.samplingDescription?.methodSteps && dataset?.samplingDescription?.methodSteps?.length > 0);

  const citationArea = literatureSearch.documents.total > 0 ? <SideBarCard>
    <SideBarCardContentWrap>
      <div css={sharedStyles.sidebarIcon}>
        <div><MdFormatQuote /></div>
      </div>
      <div css={sharedStyles.sidebarCardContent}>
        <h5>
          <Link to={join(url, 'citations')}>
            <FormattedMessage id="counts.nCitations" values={{ total: literatureSearch.documents.total }} />
          </Link>
        </h5>
      </div>
    </SideBarCardContentWrap>
  </SideBarCard> : null;

  const sideBarMetrics = <div>
    {citationArea}

    {(dataset.type === 'CHECKLIST') && <SideBarCard>
        <SideBarCardContentWrap>
          <div css={sharedStyles.sidebarIcon}>
            <div><MdPlaylistAddCheck /></div>
          </div>
          <div css={sharedStyles.sidebarCardContent}>
            <a href={`${env.CHECKLIST_BANK_WEBSITE}/dataset/gbif-${dataset.key}/imports`}>
              <h5>
                <FormattedMessage id="counts.nNames" values={{ total: totalTaxa.count }} />
              </h5>
            </a>
            <>
              <p><FormattedMessage id="counts.nAcceptedNames" values={{ total: accepted.count }} /></p>
              <Progress percent={acceptedPercentage} />

              <p><FormattedMessage id="counts.nSynonyms" values={{ total: synonyms.count }} /></p>
              <Progress percent={synonymsPercentage} />

              <p><FormattedMessage id="counts.gbifOverlapPercent" values={{ percent: gbifOverlap }} /></p>
              <Progress percent={gbifOverlap} />

              <p><FormattedMessage id="counts.colOverlapPercent" values={{ percent: colOverlap }} /></p>
              <Progress percent={colOverlap} />
            </>
          </div>
        </SideBarCardContentWrap>
    </SideBarCard>}

    {(total > 0 || dataset.type === 'OCCURRENCE') && <SideBarCard>
      <div css={sharedStyles.sidebarOccurrenceCardWrapper({isHorisontal: isBelowSidebar && !isBelowHorisontal})}>
        {total > 0 && <ResourceSearchLink type="occurrenceSearch" queryString={`datasetKey=${dataset.key}&view=MAP`} discreet >
          <ThumbnailMap dataset={dataset} />
        </ResourceSearchLink>}
        <SideBarCardContentWrap>
          <div css={sharedStyles.sidebarIcon}>
            <div><OccurrenceIcon /></div>
          </div>
          <div css={sharedStyles.sidebarCardContent}>
            <ResourceSearchLink type="occurrenceSearch" queryString={`datasetKey=${dataset.key}`} >
              <h5>
                <FormattedMessage id="counts.nOccurrences" values={{ total }} />
              </h5>
            </ResourceSearchLink>
            {total > 0 && <>
              <p><FormattedMessage id="counts.percentWithCoordinates" values={{ percent: withCoordinatesPercentage }} /></p>
              <Progress percent={100 * withCoordinates / total} />

              <p><FormattedMessage id="counts.percentWithYear" values={{ percent: withYearPercentage }} /></p>
              <Progress percent={100 * withYear / total} />

              <p><FormattedMessage id="counts.percentWithTaxonMatch" values={{ percent: withTaxonMatchPercentage }} /></p>
              <Progress percent={100 * withTaxonMatch / total} />
            </>}
          </div>
        </SideBarCardContentWrap>
      </div>

      {hasDna && <SideBarCardContentWrap>
        <div css={sharedStyles.sidebarIcon}>
          <div><GiDna1 /></div>
        </div>
        <div css={sharedStyles.sidebarCardContent}>
          <h5><FormattedMessage id="dataset.includesDna" /></h5>
          <div><Message id="dataset.includesDnaDescription" /></div>
        </div>
      </SideBarCardContentWrap>}

      {labelAsEventDataset && <SideBarCardContentWrap>
        <div css={sharedStyles.sidebarIcon}>
          <div><MdGridOn /></div>
        </div>
        <div css={sharedStyles.sidebarCardContent}>
          <h5><FormattedMessage id="dataset.containsSamplingEvents" /></h5>
          <div><Message id="dataset.containsSamplingEventsDescription" /></div>
        </div>
      </SideBarCardContentWrap>}

      {isGridded && <SideBarCardContentWrap>
        <div css={sharedStyles.sidebarIcon}>
          <div><MdGridOn /></div>
        </div>
        <div css={sharedStyles.sidebarCardContent}>
          <h5><FormattedMessage id="dataset.griddedData" /></h5>
          <div><Message id="dataset.griddedDataDescription" /></div>
        </div>
      </SideBarCardContentWrap>}
    </SideBarCard>}
  </div>;

  return <>
    <div css={sharedStyles.withSideBar({ hasSidebar: !isBelowSidebar })}>
      <div style={{ width: '100%', overflow: 'auto' }}>

        {siteOccurrences.documents.total - total < 0 && <Alert css={css`width: 100%; margin-top: 12px; a { color: inherit!important; text-decoration: underline!important;}`} tagText="Info" tagType="info">
          <HyperText inline text={scopeSmallerThanDatasetMessage} sanitizeOptions={{ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br']}} />
          </Alert>}

        {isBelowSidebar && <div>
          {sideBarMetrics}
        </div>}

        {dataset.description && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["description"] = { node, index: 0, title: <FormattedMessage id="dataset.description" /> } }}>
            <FormattedMessage id="dataset.description" />
          </CardHeader2>
          <Prose css={sharedStyles.cardProse}>
            <HyperText text={dataset.description} />
          </Prose>
        </Card>}
        {insights?.data?.images?.documents?.total > 0 && <>
          {/* We cannot register the images, because the TOC component puts it in the end - consider creating an issue for Thomas*/}
          <Images images={insights?.data?.images} dataset={dataset} />
        </>}
        {dataset.purpose && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["purpose"] = { node, index: 1, title: <FormattedMessage id="dataset.purpose" /> } }}>
            <FormattedMessage id="dataset.purpose" />
          </CardHeader2>
          <Prose css={sharedStyles.cardProse}>
            <HyperText text={dataset.purpose} />
          </Prose>
        </Card>}
        {dataset?.geographicCoverages?.length > 0 && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["geographic-scope"] = { node, index: 2, title: <FormattedMessage id="dataset.geographicCoverages" /> } }}>
            <FormattedMessage id="dataset.geographicCoverages" />
          </CardHeader2>
          <GeographicCoverages geographicCoverages={dataset.geographicCoverages} />
        </Card>}
        {/* <OccurrenceMap css={sharedStyles.cardMargins} rootPredicate={{
          type: 'equals',
          key: 'datasetKey',
          value: dataset.key
        }}/> */}
        {dataset?.temporalCoverages?.length > 0 && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["temporal-scope"] = { node, index: 3, title: <FormattedMessage id="dataset.temporalCoverages" /> } }}>
            <FormattedMessage id="dataset.temporalCoverages" />
          </CardHeader2>
          <TemporalCoverages temporalCoverages={dataset.temporalCoverages} />
        </Card>}
        {dataset?.taxonomicCoverages?.length > 0 && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["taxonomic-scope"] = { node, index: 4, title: <FormattedMessage id="dataset.taxonomicCoverages" /> }; }}>
            <FormattedMessage id="dataset.taxonomicCoverages" />
          </CardHeader2>
          <TaxonomicCoverages taxonomicCoverages={dataset.taxonomicCoverages} />
        </Card>}
        {hasSamplingDescription && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["methodology"] = { node, index: 5, title: <FormattedMessage id="dataset.methodology" /> }; }}>
            <FormattedMessage id="dataset.methodology" />
          </CardHeader2>
          <SamplingDescription dataset={dataset} />
        </Card>}
        {total > 1 && <>
          <div css={paddedCardContent} style={{ paddingTop: 0, paddingBottom: 0 }}>
            <CardHeader2 ref={node => { tocRefs["metrics"] = { node, index: 6, title: <FormattedMessage id="dataset.metrics" /> }; }}>
              <FormattedMessage id="dataset.metrics" />
              <Tooltip title={<FormattedMessage id="dataset.metricsOccurrenceHelpText" />}>
                <span>
                  <MdInfoOutline style={{ verticalAlign: 'middle' }} />
                </span>
              </Tooltip>
            </CardHeader2>
          </div>
          <Dashboard dataset={dataset} loading={loading} error={error} />
        </>}
        {dataset.additionalInfo && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["additional-info"] = { node, index: 7, title: <FormattedMessage id="dataset.additionalInfo" /> }; }}>
            <FormattedMessage id="dataset.additionalInfo" />
          </CardHeader2>
          <Prose css={sharedStyles.cardProse}>
            <HyperText text={dataset.additionalInfo} />
          </Prose>
        </Card>}
        {dataset?.volatileContributors?.length > 0 && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["contacts"] = { node, index: 8, title: <FormattedMessage id="dataset.contacts" /> }; }}>
            <FormattedMessage id="dataset.contacts" />
          </CardHeader2>
          <ContactList contacts={dataset.volatileContributors} style={{ paddingInlineStart: 0 }} />
        </Card>}
        {dataset?.bibliographicCitations?.length > 0 && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["bibliography"] = { node, index: 9, title: <FormattedMessage id="dataset.bibliography" /> }; }}>
            <FormattedMessage id="dataset.bibliography" />
          </CardHeader2>
          <BibliographicCitations bibliographicCitations={dataset?.bibliographicCitations} />
        </Card>}

        {/* It isn't clear that this section really has much value for users of the website */}
        {/* {dataset?.dataDescriptions?.length > 0 && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["data-descriptions"] = {node, index: 0}; }}>Data descriptions</CardHeader2>
          <DataDescriptions dataDescriptions={dataset?.dataDescriptions} />
        </Card>} */}

        <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["registration"] = { node, index: 10, title: <FormattedMessage id="dataset.registration" /> }; }}>
            <FormattedMessage id="dataset.registration" />
          </CardHeader2>
          <Registration dataset={dataset} />
        </Card>

        {dataset?.citation && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["citation"] = { node, index: 11, title: <FormattedMessage id="dataset.citation" /> }; }}>
            <FormattedMessage id="dataset.citation" />
          </CardHeader2>
          <Citation data={data} />
        </Card>}
      </div>
      {!isBelowSidebar && <div css={sharedStyles.sideBar}>
        {sideBarMetrics}
        <nav css={sharedStyles.sideBarNav}>
          <SideBarCard>
            <Toc refs={tocRefs} />
            {!siteContext?.dataset?.disableGbifTocLink && <ul style={{borderTop: '1px solid #eee', paddingTop: 12}}>
              <li>
                <NavItem href={`${env.GBIF_ORG}/dataset/${dataset.key}`}>View on GBIF.org <MdLink /></NavItem>
              </li>
            </ul>}
          </SideBarCard>
        </nav>
      </div>}
    </div>
  </>
};