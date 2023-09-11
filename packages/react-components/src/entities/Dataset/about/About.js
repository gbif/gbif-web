
import { jsx, css as css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as styles from './styles';
import * as sharedStyles from '../../shared/styles';
import { Prose, Properties, HyperText, Toc, ContactList, OccurrenceMap, ResourceSearchLink, Alert, Button } from "../../../components";
import RouteContext from '../../../dataManagement/RouteContext';
import { Images, ThumbnailMap, TaxonomicCoverages, GeographicCoverages, TemporalCoverages, Registration, BibliographicCitations, SamplingDescription, Citation } from './details';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Link, useRouteMatch } from 'react-router-dom';
import { join } from '../../../utils/util';
import useBelow from '../../../utils/useBelow';
import env from '../../../../.env.json';

import { MdFormatQuote, MdGridOn, MdPlaylistAddCheck, MdPinDrop as OccurrenceIcon } from 'react-icons/md';
import { GiDna1 } from 'react-icons/gi';
import { Dashboard } from './Dashboard';
import { Card, CardHeader2, SideBarCard } from '../../shared';

export function About({
  data = {},
  insights,
  loading,
  error,
  tocState,
  className,
  ...props
}) {
  const isBelowSidebar = useBelow(1000);
  const isBelowHorisontal = useBelow(700);
  let { url } = useRouteMatch();
  const theme = useContext(ThemeContext);
  const [tocRefs] = useState({})
  const { dataset, occurrenceSearch, literatureSearch, totalTaxa, accepted, synonyms, siteOccurrences } = data;
  // collect all refs to headlines for the TOC, e.g. ref={node => { tocRefs["description"] = {node, index: 0}; }}

  const isGridded = dataset?.gridded?.[0]?.percent > 0.5; // threshold decided in https://github.com/gbif/gridded-datasets/issues/3
  const hasDna = (insights?.data?.unfiltered?.facet?.dwcaExtension || []).find(ext => ext.key === 'http://rs.gbif.org/terms/1.0/DNADerivedData');

  const withCoordinates = insights?.data?.withCoordinates?.documents?.total;
  const withYear = insights?.data?.withYear?.documents?.total;
  const withTaxonMatch = occurrenceSearch?.documents?.total - insights?.data?.withTaxonMatch?.documents?.total;

  const total = occurrenceSearch?.documents?.total;
  const withCoordinatesPercentage = asPercentage(withCoordinates / total);
  const withYearPercentage = asPercentage(withYear / total);
  const withTaxonMatchPercentage = asPercentage(withTaxonMatch / total);

  const synonymsPercentage = asPercentage(synonyms.count / totalTaxa.count);
  const acceptedPercentage = asPercentage(accepted.count / totalTaxa.count);
  const gbifOverlap = dataset.metrics?.nubCoveragePct;
  const colOverlap = dataset.metrics?.colCoveragePct;

  const withEventId = insights?.data?.unfiltered?.cardinality?.eventId;
  const labelAsEventDataset = dataset.type === 'SAMPLING_EVENT' || withEventId > 1 && withEventId / total < 0.99; // Threshold chosen somewhat randomly. The issue is that some datasets assign random unique eventIds to all their occurrences. Those aren't really event datasets, it is a misunderstanding.

  const hasSamplingDescription = dataset?.samplingDescription?.studyExtent || dataset?.samplingDescription?.sampling || dataset?.samplingDescription?.qualityControl || (dataset?.samplingDescription?.methodSteps && dataset?.samplingDescription?.methodSteps?.length > 0);

  const citationArea = literatureSearch.documents.total > 0 ? <SideBarCard>
    <div css={styles.sidebarCard}>
      <div css={styles.sidebarIcon}>
        <div><MdFormatQuote /></div>
      </div>
      <div css={styles.sidebarCardContent}>
        <h5>
          <Link to={join(url, 'citations')}>
            <FormattedMessage id="counts.nCitations" values={{ total: literatureSearch.documents.total }} />
          </Link>
        </h5>
      </div>
    </div>
  </SideBarCard> : null;

  const sideBarMetrics = <div>
    {citationArea}

    {(dataset.type === 'CHECKLIST') && <SideBarCard>
      <div css={styles.sidebarCardWrapper}>
        <div css={styles.sidebarCard}>
          <div css={styles.sidebarIcon}>
            <div><MdPlaylistAddCheck /></div>
          </div>
          <div css={styles.sidebarCardContent}>
            <a href={`${env.CHECKLIST_BANK_WEBSITE}/dataset/gbif-${dataset.key}/imports`}>
              <h5>
                <FormattedMessage id="counts.nNames" values={{ total: totalTaxa.count }} />
              </h5>
            </a>
            <>
              <p><FormattedMessage id="counts.nAcceptedNames" values={{ total: accepted.count }} /></p>
              <div css={styles.progress}><div style={{ width: `${acceptedPercentage}%` }}></div></div>

              <p><FormattedMessage id="counts.nSynonyms" values={{ total: synonyms.count }} /></p>
              <div css={styles.progress}><div style={{ width: `${synonymsPercentage}%` }}></div></div>

              <p><FormattedMessage id="counts.gbifOverlapPercent" values={{ percent: gbifOverlap }} /></p>
              <div css={styles.progress}><div style={{ width: `${gbifOverlap}%` }}></div></div>

              <p><FormattedMessage id="counts.colOverlapPercent" values={{ percent: colOverlap }} /></p>
              <div css={styles.progress}><div style={{ width: `${colOverlap}%` }}></div></div>
            </>
          </div>
        </div>
      </div>
    </SideBarCard>}

    {(total > 0 || dataset.type === 'OCCURRENCE') && <SideBarCard>
      <div css={styles.sidebarOccurrenceCardWrapper({isHorisontal: isBelowSidebar && !isBelowHorisontal})}>
        {total > 0 && <ResourceSearchLink type="occurrenceSearch" queryString={`datasetKey=${dataset.key}&view=MAP`} discreet >
          <ThumbnailMap dataset={dataset} />
        </ResourceSearchLink>}
        <div css={styles.sidebarCard}>
          <div css={styles.sidebarIcon}>
            <div><OccurrenceIcon /></div>
          </div>
          <div css={styles.sidebarCardContent}>
            <ResourceSearchLink type="occurrenceSearch" queryString={`datasetKey=${dataset.key}`} discreet >
              <h5>
                <FormattedMessage id="counts.nOccurrences" values={{ total }} />
              </h5>
            </ResourceSearchLink>
            {total > 0 && <>
              <p><FormattedMessage id="counts.percentWithCoordinates" values={{ percent: withCoordinatesPercentage }} /></p>
              <div css={styles.progress}><div style={{ width: `${withCoordinatesPercentage}%` }}></div></div>

              <p><FormattedMessage id="counts.percentWithYear" values={{ percent: withYearPercentage }} /></p>
              <div css={styles.progress}><div style={{ width: `${withYearPercentage}%` }}></div></div>

              <p><FormattedMessage id="counts.percentWithTaxonMatch" values={{ percent: withTaxonMatchPercentage }} /></p>
              <div css={styles.progress}><div style={{ width: `${withTaxonMatchPercentage}%` }}></div></div>
            </>}
          </div>
        </div>
      </div>

      {hasDna && <div css={styles.sidebarCard}>
        <div css={styles.sidebarIcon}>
          <div><GiDna1 /></div>
        </div>
        <div css={styles.sidebarCardContent}>
          <h5>Includes DNA</h5>
          <p>There are records in this dataset that contain sequence data.</p>
        </div>
      </div>}

      {labelAsEventDataset && <div css={styles.sidebarCard}>
        <div css={styles.sidebarIcon}>
          <div><MdGridOn /></div>
        </div>
        <div css={styles.sidebarCardContent}>
          <h5>Contains sampling events</h5>
          <p>This dataset contains sampling data. The details of how the sampling took place should be in a methodology section.</p>
        </div>
      </div>}

      {isGridded && <div css={styles.sidebarCard}>
        <div css={styles.sidebarIcon}>
          <div><MdGridOn /></div>
        </div>
        <div css={styles.sidebarCardContent}>
          <h5>Gridded data</h5>
          <p>Based on out analysis of the points it looks like this dataset contains gridden data.</p>
        </div>
      </div>}
    </SideBarCard>}
  </div>;

  return <>
    <div css={sharedStyles.withSideBar({ hasSidebar: !isBelowSidebar })}>
      <div style={{ width: '100%', overflow: 'auto' }}>

        {siteOccurrences.documents.total - total < 0 && <Alert style={{ width: '100%', marginTop: 12 }} as="a" href={`https://www.gbif.org/dataset/${dataset.key}`} tagText="Info" tagType="info">Not all records from the dataset is included on this site. Visit GBIF.org to learn more.</Alert>}

        {isBelowSidebar && <div>
          {sideBarMetrics}
        </div>}

        {/* {false && isBelowSidebar && <div css={css`
          display: flex;
          flex-wrap: wrap;
          margin-top: 12px;
          font-size: 15px;
        `}>
          {total > 0 && <ResourceSearchLink type="occurrenceSearch" queryString={`datasetKey=${dataset.key}`} discreet >
            <Button look="primary" style={{ marginRight: 12 }}>
              <OccurrenceIcon style={{ marginRight: 12 }} /> <FormattedMessage id="counts.nOccurrences" values={{ total }} />
            </Button>
          </ResourceSearchLink>}

          {totalTaxa?.count > 0 && <ResourceSearchLink type="speciesSearch" queryString={`origin=SOURCE&advanced=1&dataset_key=${dataset.key}`} discreet >
            <Button look="primary" style={{ marginRight: 12 }}>
              <MdPlaylistAddCheck style={{ marginRight: 12 }} /> <FormattedMessage id="counts.nTaxa" values={{ total: totalTaxa?.count }} />
            </Button>
          </ResourceSearchLink>}

          {literatureSearch.documents.total > 0 && <Button as={Link} to={join(url, 'dashboard')} look="primary" style={{ marginRight: 12 }}>
            <MdFormatQuote style={{ marginRight: 12 }} /> <FormattedMessage id="counts.nCitations" values={{ total: literatureSearch.documents.total }} />
          </Button>}
        </div>} */}

        {/* <OccurrenceMap rootPredicate={{
          type: 'equals',
          key: 'datasetKey',
          value: dataset.key
        }}/> */}

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
          <Prose css={styles.paper({ theme, transparent: true })} style={{ paddingTop: 0, paddingBottom: 0 }}>
            <CardHeader2 ref={node => { tocRefs["metrics"] = { node, index: 6, title: <FormattedMessage id="dataset.metrics" /> }; }}>
              <FormattedMessage id="dataset.metrics" />
            </CardHeader2>
          </Prose>
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
      {!isBelowSidebar && <div css={sharedStyles.sideBar({ theme })}>
        {sideBarMetrics}
        <nav css={sharedStyles.sideBarNav({ theme })}>
          <SideBarCard>
            <Toc refs={tocRefs} />
          </SideBarCard>
        </nav>
      </div>}
    </div>
  </>
};

function asPercentage(fraction, max = 100) {
  var formatedPercentage = 0;
  if (Number.isNaN(fraction)) {
    return 0;
  }
  if (!isFinite(fraction)) {
    return fraction;
  }
  fraction = 100 * fraction;
  if (fraction > 101) {
    formatedPercentage = fraction.toFixed();
  } else if (fraction > 100.1) {
    formatedPercentage = fraction.toFixed(1);
  } else if (fraction > 100) {
    formatedPercentage = 100.1;
  } else if (fraction == 100) {
    formatedPercentage = 100;
  } else if (fraction >= 99.9) {
    formatedPercentage = 99.9;
  } else if (fraction > 99) {
    formatedPercentage = fraction.toFixed(1);
  } else if (fraction >= 1) {
    formatedPercentage = fraction.toFixed();
  } else if (fraction >= 0.01) {
    formatedPercentage = fraction.toFixed(2);
  } else if (fraction < 0.01 && fraction != 0) {
    formatedPercentage = 0.01;
  }
  if (formatedPercentage > max) {
    formatedPercentage = max;
  }
  return formatedPercentage;
}
