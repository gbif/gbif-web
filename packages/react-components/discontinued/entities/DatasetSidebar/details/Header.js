
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col , Properties} from "../../../components";
const { Term: T, Value: V } = Properties;

import {Logo} from "./Logo"
import { License } from './License';
export function Header({
  data,
  loading,
  error,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const item = data?.dataset;
  return <><Row><div css={css.breadcrumb({ theme })}>
  Dataset<span css={css.breadcrumbSeperator({ theme })}>
    <FormattedDate value={item?.created}
      year="numeric"
      month="long"
      day="2-digit" />
  </span>
</div></Row>
  <Row wrap="no-wrap" css={css.header({ theme })}>
    <Col grow>
      <div css={css.headline({ theme })}>
        
        <h3>{data?.dataset?.title}</h3>
      </div>
      {data?.dataset?.volatileContributors && getHighlightedContributors(data.dataset, theme)}
    </Col>
    { <Col>
    {data?.dataset?.logoUrl &&<Logo url={data.dataset.logoUrl} />}
    
    </Col>}
  </Row>
  <Row>
  <Properties
      style={{ fontSize: 13, marginBottom: 12 }}
      horizontal={true}
      
    >
    {data?.dataset?.publishingOrganizationKey && data?.dataset?.publishingOrganizationTitle && <> <T><FormattedMessage id={`dataset.publishBy`} defaultMessage="Published by" /></T>
      <V><a href={`https://www.gbif.org/publisher/${data?.dataset?.publishingOrganizationKey}`} >{data?.dataset?.publishingOrganizationTitle}</a></V>
      </>}
    {data?.dataset?.license && <> <T><FormattedMessage id="license" defaultMessage="License"/></T>
    <V><License url={data.dataset.license} /></V></>}
    </Properties>
    </Row></>
};

const getHighlightedContributors = (dataset, theme) =>{
  if(!dataset) return null;
  const highlighted = dataset.volatileContributors?.length > 0 ?  dataset.volatileContributors.filter(c => c._highlighted) : null;
  if(!highlighted || highlighted.length === 0) return null;
  return <p style={{fontSize: '14px'}} >{highlighted.map(p => `${p.firstName ? p.firstName+" ":""}${p.lastName}`).join(" • ")}</p>
     
}

const getPublisher = (dataset, theme) => {
  if(!dataset) return null;
  return (dataset.publishingOrganizationKey && dataset.publishingOrganizationTitle) ? 
<p style={{fontSize: '14px'}}>
  <span><FormattedMessage id={`dataset.publishBy`} defaultMessage="Published by" /></span> <a href={`https://www.gbif.org/publisher/${dataset.publishingOrganizationKey}`} >{dataset.publishingOrganizationTitle}</a>
</p> : null
}