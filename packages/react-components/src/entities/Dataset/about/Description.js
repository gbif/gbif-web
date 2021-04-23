
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Properties, Accordion, Button } from "../../../components";
import RouteContext from '../../../dataManagement/RouteContext';
import { Intro, BibliographicCitations, SamplingDescription, Contacts, Citation } from './details';

const { Term: T, Value: V } = Properties;

export function Description({
  data = {},
  loading,
  error,
  dataset,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const routeContext = useContext(RouteContext);
  // if (loading || !occurrence) return <h1>Loading</h1>;


  return <>
    {/* <div css={css.withSideNav({ theme })}> */}
    <div >
      {/* <nav css={css.sideNav({ theme })}>
        <ul>
          <li>
            <a href="#about" activeClassName="isActive" css={css.navItem({ theme })}>Staff</a>
          </li>
          <li>
            <a onClick={e => {window.location.href = "#contacts";}} className="isActive" css={css.navItem({ theme })}>Contacts</a>
          </li>
        </ul>
      </nav> */}
      <div style={{ width: '100%', marginLeft: 12 }}>
        <div css={css.paper({ theme })} style={{ marginTop: 24, marginBottom: 24, fontSize: '15px' }}>
          <div style={{maxWidth: 700, margin: 'auto'}}>
            <Intro data={data} loading={loading} error={error} />
            <SamplingDescription data={data} />
            <BibliographicCitations data={data} />
            <Contacts data={data} />
            <Citation data={data} />
          </div>
        </div>
      </div>
    </div>
  </>
};