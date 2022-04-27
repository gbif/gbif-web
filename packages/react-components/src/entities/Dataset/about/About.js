
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Prose, Properties, HyperText, Toc, ContactList, OccurrenceMap } from "../../../components";
import RouteContext from '../../../dataManagement/RouteContext';
import { Images, ThumbnailMap, TaxonomicCoverages, GeographicCoverages, TemporalCoverages, Registration, BibliographicCitations, SamplingDescription, Citation } from './details';

import { FormattedNumber } from 'react-intl';
import { Link, useRouteMatch } from 'react-router-dom';
import { join } from '../../../utils/util';
import useBelow from '../../../utils/useBelow';

import { MdLockClock, MdFormatQuote, MdGridOn, MdPhotoLibrary } from 'react-icons/md';
import { GiDna1 } from 'react-icons/gi';

// import {Toc} from "./Toc"
const { Term: T, Value: V } = Properties;

export function About({
  data = {},
  insights,
  loading,
  error,
  tocState,
  className,
  ...props
}) {
  const isBelowTOC = useBelow(1200);
  let { url, path } = useRouteMatch();
  const theme = useContext(ThemeContext);
  const routeContext = useContext(RouteContext);
  const [tocRefs, setTocRefs] = useState({})
  // if (loading || !occurrence) return <h1>Loading</h1>;
  const { dataset, occurrenceSearch, literatureSearch } = data;
  // collect all refs to headlines for the TOC, e.g. ref={node => { tocRefs["description"] = node; }}
  //let tocRefs = {};

  const isGridded = dataset?.gridded?.[0]?.percent > 0.5; // threshold decided in https://github.com/gbif/gridded-datasets/issues/3
  const hasDna = (insights?.data?.unfiltered?.facet?.dwcaExtension || []).find(ext => ext.key === 'http://rs.gbif.org/terms/1.0/DNADerivedData');
  
  const withCoordinates = insights?.data?.withCoordinates?.documents?.total;
  const withYear = insights?.data?.withYear?.documents?.total;
  const withTaxonMatch = occurrenceSearch?.documents?.total - insights?.data?.withTaxonMatch?.documents?.total;

  const total = occurrenceSearch?.documents?.total;
  const withCoordinatesPercentage = asPercentage( withCoordinates / total)
  const withYearPercentage = asPercentage( withYear / total)
  const withTaxonMatchPercentage = asPercentage( withTaxonMatch / total)

  const withEventId = insights?.data?.unfiltered?.cardinality?.eventId;
  const labelAsEventDataset = dataset.type === 'SAMPLING_EVENT_DATASET' || withEventId > 1 && withEventId/total < 0.99; // Threshold chosen somewhat randomly. The issue is that some datasets assign random unique eventIds to all their occurrences. Those aren't really event datasets, it is a misunderstanding.

  return <>
    <div css={css.withSideBar({ theme })}>
      {!isBelowTOC && <div css={css.sideBar({ theme })}>
        <nav css={css.sideBarNav({ theme })}>
          <Toc refs={tocRefs} />
        </nav>
      </div>}
      <div style={{ width: '100%', marginLeft: 12, overflow: 'hidden' }}>

        <OccurrenceMap rootPredicate={{
          type: 'equals',
          key: 'datasetKey',
          value: dataset.key
        }}/>
        {dataset.description && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["description"] = node; }}>Description</h2>
          <HyperText text={dataset.description} />
        </Prose>}
        <Images images={insights?.data?.images} />
        {dataset.purpose && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["purpose"] = node; }}>Purpose</h2>
          <HyperText text={dataset.purpose} />
        </Prose>}
        {dataset?.geographicCoverages?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["geographic-scope"] = node; }}>Geographic scope</h2>
          <GeographicCoverages geographicCoverages={dataset.geographicCoverages} />
        </Prose>}
        {dataset?.temporalCoverages?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["temporal-scope"] = node; }}>Temporal scope</h2>
          <TemporalCoverages temporalCoverages={dataset.temporalCoverages} />
        </Prose>}
        {dataset?.taxonomicCoverages?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["taxonomic-scope"] = node; }}>Taxonomic scope</h2>
          <TaxonomicCoverages taxonomicCoverages={dataset.taxonomicCoverages} />
        </Prose>}
        {dataset.samplingDescription && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["methodology"] = node; }}>Methodology</h2>
          <SamplingDescription dataset={dataset} />
        </Prose>}
        {dataset.additionalInfo && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["additional-info"] = node; }}>Additional info</h2>
          <HyperText text={dataset.additionalInfo} />
        </Prose>}
        {dataset?.volatileContributors && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["contacts"] = node; }}>Contacts</h2>
          <ContactList contacts={dataset.volatileContributors} style={{ paddingInlineStart: 0 }} />
        </Prose>}
        {dataset?.bibliographicCitations?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["bibliographic-citations"] = node; }}>Bibliographic citations</h2>
          <BibliographicCitations bibliographicCitations={dataset?.bibliographicCitations} />
        </Prose>}

        {/* It isn't clear that this section really has much value for users of the website */}
        {/* {dataset?.dataDescriptions?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["data-descriptions"] = node; }}>Data descriptions</h2>
          <DataDescriptions dataDescriptions={dataset?.dataDescriptions} />
        </Prose>} */}

        <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["registration"] = node; }}>Registration</h2>
          <Registration dataset={dataset} />
        </Prose>

        {dataset?.citation && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["citation"] = node; }}>Citation</h2>
          <Citation data={data} />
        </Prose>}
      </div>
      <div css={css.sideBar({ theme })} style={{ margin: '0 0 0 12px', position: 'relative' }}>
        <div>
          <div css={css.area}>
            <div css={css.testcard}>
              <div css={css.testicon}>
                <div><MdFormatQuote /></div>
              </div>
              <div css={css.testcontent}>
                <h5>
                  <Link to={join(url, 'citations')}><FormattedNumber value={literatureSearch.documents.count} /> citations</Link>
                </h5>
              </div>
            </div>
          </div>
          <div css={css.area}>
            <div css={css.testcardWrapper}>
              {/* <ThumbnailMap dataset={dataset}/> */}
              <div css={css.testcard}>
                <div css={css.testcontent}>
                  <h5><FormattedNumber value={occurrenceSearch?.documents?.total} /> occurrences</h5>

                  <p>{withCoordinatesPercentage}% with coordinates</p>
                  <div css={css.progress}><div style={{ width: `${withCoordinatesPercentage}%` }}></div></div>

                  <p>{withYearPercentage}% with year</p>
                  <div css={css.progress}><div style={{ width: `${withYearPercentage}%` }}></div></div>

                  <p>{withTaxonMatchPercentage}% with taxon match</p>
                  <div css={css.progress}><div style={{ width: `${withTaxonMatchPercentage}%` }}></div></div>
                </div>
              </div>
            </div>

            {hasDna && <div css={css.testcard}>
              <div css={css.testicon}>
                <div><GiDna1 /></div>
              </div>
              <div css={css.testcontent}>
                <h5>Includes DNA</h5>
                <p>Lorem ipsum sfhkjh sfhlksduf bksk sdkh sdfg </p>
              </div>
            </div>}

            {/* <div css={css.testcard}>
              <div css={css.testicon}>
                <div><MdLockClock /></div>
              </div>
              <div css={css.testcontent}>
                <h5>History of stable IDs</h5>
                <p>Lorem ipsum sfhkjh sfhlksduf bksk sdkh sdfg </p>
              </div>
            </div> */}

            {labelAsEventDataset && <div css={css.testcard}>
              <div css={css.testicon}>
                <div><MdGridOn /></div>
              </div>
              <div css={css.testcontent}>
                <h5>Contains sampling events</h5>
                <p>Lorem ipsum sfhkjh sfhlksduf bksk sdkh sdfg </p>
              </div>
            </div>}

            {/* <div css={css.testcard}>
              <div css={css.testicon}>
                <div><MdPhotoLibrary /></div>
              </div>
              <div css={css.testcontent}>
                <h5>80% has images</h5>
                <p>Lorem ipsum sfhkjh sfhlksduf bksk sdkh sdfg </p>
              </div>
            </div> */}

            {isGridded && <div css={css.testcard}>
              <div css={css.testicon}>
                <div><MdGridOn /></div>
              </div>
              <div css={css.testcontent}>
                <h5>Gridded data</h5>
                <p>This dataset looks like it is gridded.</p>
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  </>
};


function asPercentage(fraction, max = 100) {
  var formatedPercentage = 0;
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
