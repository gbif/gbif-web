/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { useEffect, useContext, useState, useCallback } from "react";
import { MdChevronRight } from 'react-icons/md';
import { Image, StripeLoader, Button, Row, Col } from '../../../../components';
import { FormattedDate } from 'react-intl';

function ListItem({ BasisOfRecordLabel, id, item, imageSrc, onClick = () => { }, ...props }) {
  return <div css={listItem()} onClick={e => onClick({ id })}>
    <Row wrap="no-wrap" alignItems="center">
      <Col grow={true} css={listItemContent()}>
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
        <Button appearance="text" style={{ padding: 3 }} onClick={e => onClick({ id })}>
          <MdChevronRight />
        </Button>
      </Col>
      {item.primaryImage?.identifier && <Col grow={false}>
        <Image src={item.primaryImage?.identifier} w={80} h={80} style={{ display: 'block', background: '#ededed', width: 80, height: 80 }} />
      </Col>}
    </Row>
  </div>
}

function ListBox({ labelMap, onCloseRequest, onClick, data, error, loading, ...props }) {
  // if (!error && !loading && !data) return null;
  const BasisOfRecordLabel = labelMap.basisOfRecord;
  
  // console.log('error', error);
  // console.log('loading', loading);

  let content;
  if (loading) {
    return <section  {...props}>
      <div css={container()}>
        <StripeLoader active />
        <div css={listItemContent()}>Loading</div>
      </div>
    </section>
  } else if (error) {
    return <section  {...props}>
      <div css={container()}>
        <StripeLoader active error />
        <div css={listItemContent()}>Failed to fetch data</div>
      </div>
    </section>
  } else if (data) {
    const results = data?.occurrenceSearch?.documents?.results || [];
    content = <ul css={list()}>
      {results.map((x, index) => {
        return <li key={x.gbifId}>
          <ListItem BasisOfRecordLabel={BasisOfRecordLabel} onClick={() => onClick({index})} id={x.gbifId} item={x} />
        </li>
      })}
    </ul>;
  }

  return <section  {...props}>
    <Row css={container()} direction="column">
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

const container = ({ ...props }) => css`
  background: white;
  overflow: auto;
  border-radius: 4px;
  border: 1px solid #eee;
  max-height: inherit;
  flex-wrap: nowrap;
  header {
    padding: 8px 16px;
    border-bottom: 1px solid #eee;
    font-size: 12px;
    font-weight: 500;
  }
  footer {
    border-top: 1px solid #eee;
    padding: 8px 16px;
  }
`;

const list = ({ ...props }) => css`
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #eee;
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

const listItem = ({ ...props }) => css`
  border-bottom: 1px solid #efefef;
  cursor: pointer;
  :hover {
    background: #efefef;
  }
`;


export default ListBox;