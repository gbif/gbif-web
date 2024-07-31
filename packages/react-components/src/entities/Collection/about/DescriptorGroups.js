import { css, jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from '../../../dataManagement/api';
import { Card } from "../../shared";
// import { BiSpreadsheet as SpreadSheetIcon } from "react-icons/bi";
import { RiFileDownloadLine as SpreadSheetIcon } from "react-icons/ri";
import { DataTable, Th, Td, TBody } from '../../../components';

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

  return data.collection.descriptorGroups.results.map(group => <DescriptorGroupPresentation key={group.key} collectionKey={collectionKey} groupKey={group.key} {...group} />);
}

function DescriptorGroupPresentation({ collectionKey, groupKey, title, description }) {
  const { data, error, loading, load } = useQuery(DESCRIPTOR_GROUP, { lazyLoad: true });

  useEffect(() => {
    if (typeof collectionKey !== 'undefined' && typeof groupKey !== 'undefined') {
      const query = {
        variables: {
          key: groupKey,
          collectionKey: collectionKey,
        }
      };
      load(query);
    }
  }, [collectionKey, groupKey]);

  const hasResults = data?.collectionDescriptorGroup?.descriptors?.results?.length > 0;
  const keys = hasResults ? Object.keys(data?.collectionDescriptorGroup?.descriptors?.results[0].verbatim) : [];

  return <Card style={{ marginTop: 0, marginBottom: 8, paddingTop: 12, paddingBottom: 12 }}>
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: 24 }}>
        <a href={`https://api.gbif-uat.org/v1/grscicoll/collection/${collectionKey}/descriptorSet/${groupKey}/export?format=CSV`} style={{ color: 'var(--color800)' }}>
          <SpreadSheetIcon style={{ fontSize: 32 }} />
        </a>
      </div>
      <div>
        <h4 style={{ marginTop: 0, marginBottom: 8 }}>{title}</h4>
        <div style={{ color: 'var(--color600)' }}>
          {description}
        </div>
        <div>
          {loading && 'Loading...'}
          {error && 'Error'}
          {hasResults && <>
            {/* <table css={css`
              thead th {
                font-weight: 400;
                background: #8a97a0;
                color: #FFF;
              }

              tr {
                background: #f4f7f8;
                border-bottom: 1px solid #FFF;
                margin-bottom: 5px;
              }

              tr:nth-child(even) {
                background: #e8eeef;
              }

              th, td {
                text-align: left;
                padding: 20px;
                font-weight: 300;
              }

              tfoot tr {
                background: none;
              }

              tfoot td {
                padding: 10px 2px;
                font-size: 0.8em;
                font-style: italic;
                color: #8a97a0;
              }
              `}> */}
              <DataTable>
              <thead>
                <tr>
                  {keys.map(key => <Th key={key}>{key}</Th>)}
                </tr>
              </thead>
              <TBody>
                {data.collectionDescriptorGroup.descriptors.results.map(d => <tr key={d.key}>
                  {keys.map(k => <Td key={k}>{d.verbatim[k]}</Td>)}
                </tr>)}
              </TBody>
            </DataTable>
          </>}
        </div>
      </div>
    </div>
  </Card>
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
      results {
        key
        verbatim
      }
    }
  }
}
`;