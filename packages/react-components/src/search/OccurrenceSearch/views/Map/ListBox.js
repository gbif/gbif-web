/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { useEffect, useContext, useState, useCallback } from "react";
import { MdChevronRight } from 'react-icons/md';
import { Image, StripeLoader, Button, Row, Col } from '../../../../components';
import { FormattedDate } from 'react-intl';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { styledScrollBars } from '../../../../style/shared';

function ListItem({ BasisOfRecordLabel, id, item, imageSrc, onClick = () => { }, ...props }) {
  const theme = useContext(ThemeContext);

  return <div css={listItem({ theme })} onClick={e => onClick({ id })}>
    <Row wrap="no-wrap" alignItems="center">
      <Col grow={true} css={listItemContent({ theme })}>
        <h4 dangerouslySetInnerHTML={{ __html: item.gbifClassification.usage.formattedName }} ></h4>
        {item.eventDateSingle && <div>
          <FormattedDate value={item.eventDateSingle}
            year="numeric"
            month="long"
            day="2-digit" />
        </div>}
        <div>
          <BasisOfRecordLabel id={item.basisOfRecord} />
        </div>
      </Col>
      <Col grow={false}>
        <Button className="gbif-map-listItem-chevreon" appearance="text" style={{ padding: 3 }} onClick={e => onClick({ id })}>
          <MdChevronRight />
        </Button>
      </Col>
      {item.primaryImage?.identifier && <Col grow={false}>
        <Image src={item.primaryImage?.identifier} w={80} h={80} style={{ display: 'block', background: theme.paperBackground200, width: 80, height: 80 }} />
      </Col>}
    </Row>
  </div>
}

function ListBox({ labelMap, onCloseRequest, onClick, data, error, loading, ...props }) {
  const theme = useContext(ThemeContext);
  if (!error && !loading && !data) return null;
  const BasisOfRecordLabel = labelMap.basisOfRecord;

  let content;
  if (loading) {
    return <section  {...props}>
      <div css={container({ theme })}>
        <StripeLoader active />
        <div css={listItemContent({ theme })}>Loading</div>
      </div>
    </section>
  } else if (error) {
    return <section  {...props}>
      <div css={container({ theme })}>
        <StripeLoader active error />
        <div css={listItemContent({ theme })}>Failed to fetch data</div>
      </div>
    </section>
  } else if (data) {
    const results = data?.occurrenceSearch?.documents?.results || [];
    content = <ul css={list({ theme })}>
      {results.map((x, index) => {
        return <li key={x.gbifId}>
          <ListItem BasisOfRecordLabel={BasisOfRecordLabel} onClick={() => onClick({ index })} id={x.gbifId} item={x} />
        </li>
      })}
    </ul>;
  }

  return <section  {...props}>
    <Row css={container({ theme })} direction="column">
      <Col grow={false} as="header" >
        <Row alignItems="center">
          <Col grow>{data?.occurrenceSearch?.documents.total} results</Col>
          <Col grow={false}><Button appearance="outline" onClick={onCloseRequest}>Close</Button></Col>
        </Row>
      </Col>
      <Col grow as="main">
        {content}
      </Col>
    </Row>
  </section>
}

const container = ({ theme, ...props }) => css`
  background: ${theme.paperBackground500};
  overflow: auto;
  border-radius: ${theme.borderRadius}px;
  border: 1px solid ${theme.paperBorderColor};
  max-height: inherit;
  flex-wrap: nowrap;
  header {
    padding: 8px 16px;
    border-bottom: 1px solid ${theme.paperBorderColor};
    font-size: 12px;
    font-weight: 500;
  }
  main {
    overflow: auto;
    ${styledScrollBars({ theme })};
  }
  footer {
    border-top: 1px solid ${theme.paperBorderColor};
    padding: 8px 16px;
  }
`;

const list = ({ theme, ...props }) => css`
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid ${theme.paperBorderColor};
`;

const listItemContent = ({ ...props }) => css`
  padding: 8px 16px;
  font-size: 13px;
  overflow: hidden;
  h4 {
    margin: 0 0 8px 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const listItem = ({ theme, ...props }) => css`
  border-bottom: 1px solid ${theme.paperBorderColor};
  cursor: pointer;
  :hover {
    background: ${theme.paperBackground700};
  }
  .gbif-map-listItem-chevreon {
    color: ${theme.color500};
  }
`;


export default ListBox;