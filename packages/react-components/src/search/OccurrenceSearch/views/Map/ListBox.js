/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { useEffect, useContext, useState, useCallback } from "react";
import { MdChevronRight } from 'react-icons/md';
import { StripeLoader, Button, Row, Col } from '../../../../components';

function ListItem({ id, title, subTitle, imageSrc, onClick = () => { }, ...props }) {
  return <div css={item()} onClick={e => onClick({id})}>
    <Row wrap="no-wrap">
      <Col grow={true}>{title}</Col>
      <Col grow={false}>
        <Button appearance="text" style={{padding: 3}} onClick={e => onClick({id})}>
          <MdChevronRight />
        </Button>
      </Col>
    </Row>
  </div>
}

function ListBox({ onClick, data, error, loading, ...props }) {
  if (!error && !loading && !data) return null;

  let content;
  if (error) {
    content = 'Failed to load data';
  } else if (loading) {
    content = <>
    <StripeLoader active />
    Loading
    </>
  } else if (data) {
    const results = data?.occurrenceSearch?.documents?.results || [];
    content = <ul css={list()}>
      {results.map(x => {
        return <li key={x.gbifId}>
          <ListItem onClick={onClick} id={x.gbifId} title={
            <span dangerouslySetInnerHTML={{ __html: x.gbifClassification.usage.formattedName }}></span>
          } />
        </li>
      })}
    </ul>;
  }

  const results = data?.occurrenceSearch?.documents?.results || [];
  return <div css={container()} {...props}>
    {content}
  </div>
}

const container = ({ ...props }) => css`
  background: white;
  overflow: auto;
  border-radius: 4px;
  border: 1px solid #eee;
`;

const list = ({ ...props }) => css`
  list-style: none;
  padding: 0;
`;

const item = ({ ...props }) => css`
  padding: 5px 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 13px;
`;

export default ListBox;