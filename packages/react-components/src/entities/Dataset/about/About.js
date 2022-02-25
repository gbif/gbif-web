
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Prose, Row, Col, Properties, HyperText, Button, Toc } from "../../../components";
import RouteContext from '../../../dataManagement/RouteContext';
import { TaxonomicCoverages, GeographicCoverages, TemporalCoverages, Intro, BibliographicCitations, SamplingDescription, Contacts, Citation } from './details';
// import {Toc} from "./Toc"
const { Term: T, Value: V } = Properties;

export function About({
  data = {},
  loading,
  error,
  tocState,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const routeContext = useContext(RouteContext);
  const [tocRefs, setTocRefs] = useState({})
  // if (loading || !occurrence) return <h1>Loading</h1>;
  const { dataset } = data;
  // collect all refs to headlines for the TOC, e.g. ref={node => { tocRefs["description"] = node; }}
  //let tocRefs = {};
  
  return <>
    <div css={css.withSideBar({ theme })}>
      <div css={css.sideBar({ theme })}>
        <nav css={css.sideBarNav({ theme })}>
          <Toc refs={tocRefs}/>
        </nav>
      </div>
      <div style={{ width: '100%', marginLeft: 12 }}>
        {dataset.description && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["description"] = node; }}>Description</h2>
          <HyperText text={dataset.description} />
        </Prose>}
        {dataset.purpose && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["purpose"] = node; }}>Purpose</h2>
          <HyperText text={dataset.purpose} />
        </Prose>}
        {dataset.temporalCoverages && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["temporal-scope"] = node; }}>Temporal scope</h2>
          <TemporalCoverages temporalCoverages={dataset.temporalCoverages} />
        </Prose>}
        {dataset.geographicCoverages && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["geographic-scope"] = node; }}>Geographic scope</h2>
          <GeographicCoverages geographicCoverages={dataset.geographicCoverages} />
        </Prose>}
        {dataset.taxonomicCoverages && <Prose css={css.paper({ theme })}>
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
          <Contacts data={data}  />
        </Prose>}
        {dataset?.bibliographicCitations && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["bibliographic-citations"] = node; }}>Bibliographic citations</h2>
          <BibliographicCitations bibliographicCitations={dataset?.bibliographicCitations} />
        </Prose>}
        {dataset?.citation && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["citation"] = node; }}>Citation</h2>
          <Citation data={data} />
        </Prose>}
      </div>
    </div>
  </>
};


