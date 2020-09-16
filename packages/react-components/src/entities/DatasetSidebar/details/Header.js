/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext } from 'react';
import { FormattedDate } from 'react-intl';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col } from "../../../components";

export function Header({
  data,
  loading,
  error,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const item = data?.dataset;
  return <Row wrap="no-wrap" css={css.header({ theme })}>
    <Col grow>
      <div css={css.headline({ theme })}>
        <div css={css.breadcrumb({ theme })}>
          Dataset<span css={css.breadcrumbSeperator({ theme })}>
            <FormattedDate value={item?.created}
              year="numeric"
              month="long"
              day="2-digit" />
          </span>
        </div>
        <h3>{data.dataset.title}</h3>
      </div>
    </Col>
  </Row>
};
