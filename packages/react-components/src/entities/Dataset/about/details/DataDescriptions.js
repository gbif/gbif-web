import React, { useState, useEffect } from "react";
import { jsx, css } from '@emotion/react';
import { Properties, Button, HyperText } from "../../../../components";
import { FormattedMessage } from "react-intl";

const { Term: T, Value: V } = Properties;

export function DataDescriptions({
  dataDescriptions = [],
  ...props
}) {
  return <>
    <GenericListContent
      list={dataDescriptions}
      translationPrefix="test"
      fields={['charset', 'name', 'format', 'formatVersion', 'url']} />
  </>
}

function GenericListContent({ list, fields, translationPrefix, overwrites, ...props }) {
  if (!list || list.length === 0) return null;

  return <div {...props}>
    {list.length === 1 && <ContentItem item={list[0]} {...{ overwrites, translationPrefix, fields }} />}
    {list.length > 1 && <div css={listArea()}>
      <div style={{ fontSize: '12px', margin: '0 12px' }}>{list.length} entries</div>
      {list.map((item, i) => <ListCard>
        <ContentItem key={i} item={item} fields={fields} overwrites={overwrites} />
      </ListCard>)}
    </div>}
  </div>
}

function ContentItem({ item, translationPrefix, fields, overwrites = {} }) {
  return <Properties css={properties} breakpoint={800}>
    {fields.map(field => {
      if (overwrites[field]) {
        return <Field key={field} {...{ item, translationPrefix, field }}>
          {overwrites[field]({ item })}
        </Field>
      } else {
        return <Field key={field} {...{ item, translationPrefix, field }} />
      }
    })}
  </Properties>
}

function Field({ item, field, translationPrefix = '', children }) {
  if (!item[field]) return null;
  return <>
    <T><FormattedMessage id={`${translationPrefix}${field}`} defaultMessage={field} /></T>
    <V>{children ? children : <HyperText text={item[field]} />}</V>
  </>
}

function ListCard(props) {
  return <div css={listCard()} {...props} />
}

export const properties = css`
  font-size: 85%;
`;

export const listArea = props => css`

`;

export const listCard = props => css`
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid rgb(238, 238, 238);
  box-shadow: rgb(0 0 0 / 2%) 0px 1px 2px 2px;
  border-radius: 4px;
  background: white;
`;
