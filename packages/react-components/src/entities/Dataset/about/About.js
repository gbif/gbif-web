
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Prose, Row, Col, Properties, HyperText, Button } from "../../../components";
import RouteContext from '../../../dataManagement/RouteContext';
import { TaxonomicCoverages, GeographicCoverages, TemporalCoverages, Intro, BibliographicCitations, SamplingDescription, Contacts, Citation } from './details';
import {Toc} from "./Toc"
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
          <Toc data={dataset} selector="h2"/>
        </nav>
      </div>
      <div style={{ width: '100%', marginLeft: 12 }}>
        {dataset.description && <Prose css={css.paper({ theme })}>
          <h2 id="description">Description</h2>
          <HyperText text={dataset.description} />
        </Prose>}
        {dataset.purpose && <Prose css={css.paper({ theme })}>
          <h2 id="purpose">Purpose</h2>
          <HyperText text={dataset.purpose} />
        </Prose>}
        {dataset.temporalCoverages && <Prose css={css.paper({ theme })}>
          <h2 id="temporal-scope">Temporal scope</h2>
          <TemporalCoverages temporalCoverages={dataset.temporalCoverages} />
        </Prose>}
        {dataset.geographicCoverages && <Prose css={css.paper({ theme })}>
          <h2 id="geographic-scope">Geographic scope</h2>
          <GeographicCoverages geographicCoverages={dataset.geographicCoverages} />
        </Prose>}
        {dataset.taxonomicCoverages && <Prose css={css.paper({ theme })}>
          <h2 id="taxonomic-scope">Taxonomic scope</h2>
          <TaxonomicCoverages taxonomicCoverages={dataset.taxonomicCoverages} />
        </Prose>}
        {dataset.samplingDescription && <Prose css={css.paper({ theme })}>
          <h2 id="methodology">Methodology</h2>
          <SamplingDescription dataset={dataset} />
        </Prose>}
        {dataset.additionalInfo && <Prose css={css.paper({ theme })}>
          <h2 id="additional-info">Additional info</h2>
          <HyperText text={dataset.additionalInfo} />
        </Prose>}
        {dataset?.volatileContributors && <Prose css={css.paper({ theme })}>
          <h2 id="contacts">Contacts</h2>
          <Contacts data={data}  />
        </Prose>}
        {dataset?.bibliographicCitations && <Prose css={css.paper({ theme })}>
          <h2 id="bibliographic-citations">Bibliographic citations</h2>
          <BibliographicCitations bibliographicCitations={dataset?.bibliographicCitations} />
        </Prose>}
        {dataset?.citation && <Prose css={css.paper({ theme })}>
          <h2 id="citation">Citation</h2>
          <Citation data={data} />
        </Prose>}

        {/*         
        <div css={css.paper({ theme })} style={{ marginTop: 24, marginBottom: 24, fontSize: '15px' }}>
          <Intro data={data} loading={loading} error={error} />
          <SamplingDescription data={data} />
          <BibliographicCitations data={data} />
          <Contacts data={data} />
          <Citation data={data} />
        </div> */}
      </div>
    </div>
  </>
};


