
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Prose, Row, Col, Properties, HyperText, Button } from "../../../components";
import RouteContext from '../../../dataManagement/RouteContext';
import { TaxonomicCoverages, GeographicCoverages, TemporalCoverages, Registration, BibliographicCitations, SamplingDescription, Contacts, Citation } from './details';
// import {Toc} from "./Toc"
const { Term: T, Value: V } = Properties;

export function About({
  data = {},
  loading,
  error,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const routeContext = useContext(RouteContext);
  // if (loading || !occurrence) return <h1>Loading</h1>;

  const { dataset } = data;

  return <>
    <div css={css.withSideBar({ theme })}>
      <div css={css.sideBar({ theme })}>
        <nav css={css.sideBarNav({ theme })}>
          <ul>
            <li>
              <Button appearance="text" activeClassName="isActive" css={css.navItem({ theme })}>TODO: table of content should go here</Button>
            </li>
            <li>
              <a onClick={e => { window.location.href = "#contacts"; }} className="isActive" css={css.navItem({ theme })}>Contacts</a>
            </li>
          </ul>
        </nav>
      </div>
      <div style={{ width: '100%', marginLeft: 12 }}>

        <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["registration"] = node; }}>Registration</h2>
          <Registration dataset={dataset} />
        </Prose>

        {dataset.description && <Prose css={css.paper({ theme })}>
          <h2>Description</h2>
          <HyperText text={dataset.description} />
        </Prose>}
        {dataset.purpose && <Prose css={css.paper({ theme })}>
          <h2>Purpose</h2>
          <HyperText text={dataset.purpose} />
        </Prose>}
        {dataset?.temporalCoverages?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["temporal-scope"] = node; }}>Temporal scope</h2>
          <TemporalCoverages temporalCoverages={dataset.temporalCoverages} />
        </Prose>}
        {dataset?.geographicCoverages?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["geographic-scope"] = node; }}>Geographic scope</h2>
          <GeographicCoverages geographicCoverages={dataset.geographicCoverages} />
        </Prose>}
        {dataset?.taxonomicCoverages?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["taxonomic-scope"] = node; }}>Taxonomic scope</h2>
          <TaxonomicCoverages taxonomicCoverages={dataset.taxonomicCoverages} />
        </Prose>}
        {dataset.samplingDescription && <Prose css={css.paper({ theme })}>
          <h2>Methodology</h2>
          <SamplingDescription dataset={dataset} />
        </Prose>}
        {dataset.additionalInfo && <Prose css={css.paper({ theme })}>
          <h2>Additional info</h2>
          <HyperText text={dataset.additionalInfo} />
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
        
        {dataset?.citation && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["citation"] = node; }}>Citation</h2>
          <Citation data={data} />
        </Prose>}
      </div>
    </div>
  </>
};


