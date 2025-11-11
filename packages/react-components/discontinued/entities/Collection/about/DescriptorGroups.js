import { css, jsx } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import { useQuery } from '../../../dataManagement/api';
import { Card } from "../../shared";
import { BiSpreadsheet as SpreadSheetIcon } from "react-icons/bi";
import { DataTable, Th, Td, TBody, Button, Switch, Skeleton } from '../../../components';
import { MdDownload } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import config from '../../../../.env.json';

export function DescriptorGroups({ collectionKey }) {
  const { data, error, loading, load } = useQuery(DESCRIPTOR_GROUPS, { lazyLoad: true });

  useEffect(() => {
    if (typeof collectionKey !== 'undefined') {
      const query = {
        variables: {
          key: collectionKey
        }
      };
      load(query);
    }
  }, [collectionKey]);

  if (loading) return <Card loading />
  if (error) return <Card error={error} />
  if (!data || !data.collection) return null;

  return <Card>
    {data?.collection?.descriptorGroups?.results?.map((group, index) => <DescriptorGroupPresentation last={index === data.collection.descriptorGroups.results.length - 1} key={group.key} collectionKey={collectionKey} groupKey={group.key} {...group} />)}
  </Card>
}

function DescriptorGroupPresentation({ collectionKey, groupKey, title, description, last }) {
  const [showPreview, setShowPreview] = useState(false);

  return <div style={{ display: 'flex', borderBottom: last ? 'none' : '1px solid #eee', padding: '12px 0' }}>
    <div style={{ marginRight: 12, flex: '0 0 auto' }}>
      <div style={{ color: 'var(--color800)' }}>
        <SpreadSheetIcon style={{ fontSize: 18 }} />
      </div>
    </div>
    <div style={{ flex: '1 1 auto', width: 100 }}>
      <h4 style={{ marginTop: 0, marginBottom: 8 }}>{title}</h4>
      <div style={{ color: 'var(--color600)' }}>
        {description}
      </div>
      <div style={{ fontSize: 12, marginTop: 12 }}>
        <Button as="a" look="primary" href={`${config.API_V1}/grscicoll/collection/${collectionKey}/descriptorGroup/${groupKey}/export?format=CSV`} style={{ color: 'var(--color800)' }}>
          <MdDownload style={{ marginRight: 8 }} /><FormattedMessage id="phrases.download" />
        </Button>
        <label><Switch checked={showPreview} style={{ marginLeft: 16, marginRight: 4 }} onChange={() => setShowPreview(!showPreview)} /><FormattedMessage id="phrases.preview" /></label>
      </div>
      {showPreview && <div css={css`margin-top: 12px;`}>
        <Table collectionKey={collectionKey} groupKey={groupKey} />
      </div>}
    </div>
  </div>
}

function Table({ collectionKey, groupKey }) {
  const limit = 20;
  const [offset, setOffset] = useState(0);
  const { data, error, loading, load } = useQuery(DESCRIPTOR_GROUP, { lazyLoad: true });

  useEffect(() => {
    if (typeof collectionKey !== 'undefined' && typeof groupKey !== 'undefined') {
      const query = {
        keepDataWhileLoading: true,
        variables: {
          key: groupKey,
          collectionKey: collectionKey,
          limit,
          offset
        }
      };
      load(query);
    }
  }, [collectionKey, groupKey, offset]);

  const hasResults = data?.collectionDescriptorGroup?.descriptors?.results?.length > 0;
  const keys = hasResults ? Object.keys(data?.collectionDescriptorGroup?.descriptors?.results[0].verbatim) : [];

  if (error) return <FormattedMessage id="phrases.failedToLoadData" />

  const descriptors = data?.collectionDescriptorGroup?.descriptors;
  const first = () => {
    setOffset(0);
  };
  const prev = () => {
    setOffset(Math.max(offset - descriptors.limit, 0));
  };
  const next = () => {
    setOffset(offset + descriptors.limit);
  };
  const size = descriptors?.limit ?? limit;
  const from = descriptors?.offset ?? 0;
  const total = descriptors?.count ?? 0;

  return <div css={css`
            display: flex;
            flex-direction: column;
            width: 100%;
        `}>
    {!hasResults && <Skeleton />}
    {hasResults && <DataTable style={{ height: '400px' }} {...{ first, prev, next, size, from, total }}>
      <thead>
        <tr>
          {keys.map(key => <Th key={key}>{key}</Th>)}
        </tr>
      </thead>
      <TBody loading={loading}>
        {descriptors.results.map(d => <tr key={d.key}>
          {keys.map(k => <Td key={k}>{d.verbatim[k]}</Td>)}
        </tr>)}
      </TBody>
    </DataTable>}
  </div>
}

const DESCRIPTOR_GROUPS = `
    query DescriptorGroups($key: ID!) {
      collection(key: $key) {
      descriptorGroups(limit: 100) {
      results {
      key
        title
        description
      }
    }
  }
}
    `;

const DESCRIPTOR_GROUP = `
query($key: ID!, $collectionKey: ID!, $limit: Int, $offset: Int) {
  collectionDescriptorGroup(key: $key, collectionKey: $collectionKey) {
  title
    description
    descriptors(limit: $limit, offset: $offset) {
      count
      offset
      limit
      results {
      key
        verbatim
      }
    }
  }
}
    `;