/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext, useCallback, useState, useEffect } from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { MdLocationOn, MdPhotoLibrary, MdGpsFixed } from 'react-icons/md';
import { GiDna1 } from 'react-icons/gi';
import { GrTree } from 'react-icons/gr';
import { BsLightningFill } from 'react-icons/bs';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col, MajorRanks } from "../../../components";
import { Globe } from './Globe';

export function Header({
  data,
  loading,
  error,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  return <Row wrap="no-wrap" css={css.header({ theme })}>
    {data?.occurrence?.volatile?.globe && 
      <Col grow={false} style={{ marginRight: 18 }}>
        <Globe {...data?.occurrence?.volatile?.globe} />
      </Col>
    }
    <Col grow>
      <div css={css.headline({ theme })}>
        <div css={css.breadcrumb({ theme })}>
          <FormattedMessage id={`enums.basisOfRecord.${data?.occurrence?.basisOfRecord}`} /><span css={css.breadcrumbSeperator({ theme })}>
            <FormattedDate value={data?.occurrence?.eventDateSingle}
              year="numeric"
              month="long"
              day="2-digit" />
          </span>
        </div>
        <h3 dangerouslySetInnerHTML={{ __html: data?.occurrence?.gbifClassification?.usage?.formattedName }}></h3>
        {/* <div style={{color: 'orange', marginTop: 4}}>Published as: Polycauliona polycarpa hoffman</div> */}
        {/* <div style={{fontSize: 13}}><MajorRanks taxon={data?.occurrence?.gbifClassification} rank={data?.occurrence?.gbifClassification?.usage?.rank}/></div> */}
      </div>
      {/* <div>Engkabelej</div> */}
      {/* <div style={{fontSize: 12, marginTop: 18}}><MdLocationOn /> <FormattedMessage id={`enums.countryCode.${data?.occurrence?.countryCode}`} /></div> */}
      <div css={css.entitySummary({ theme })}>
        {/* <div><GrTree /> <MajorRanks taxon={data?.occurrence?.gbifClassification} rank={data?.occurrence?.gbifClassification?.usage?.rank}/></div> */}
        <div><MdLocationOn /> <FormattedMessage id={`enums.countryCode.${data?.occurrence?.countryCode}`} /></div>
        <div><MdPhotoLibrary /> {data?.occurrence?.multimediaItems?.length} images</div>
        <div><GiDna1 /> sequenced</div>
        <div><MdGpsFixed /> tracked</div>
        <div><BsLightningFill style={{color: 'orange'}}/> 3 quality flags</div>
      </div>
    </Col>
  </Row>
};
