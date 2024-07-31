import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from '../../../dataManagement/api';
import { Card } from "../../shared";

export function DescriptorGroups({collectionKey}) {
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

function DescriptorGroupPresentation({collectionKey, groupKey, title, description}) {
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

  return <Card style={{ marginTop: 0, marginBottom: 24 }}>
    <h3>{title}</h3>
    <div>
      {description}
    </div>
    <div>
      {loading && 'Loading...'}
      {error && 'Error'}
      {data && data.collectionDescriptorGroup && data.collectionDescriptorGroup.descriptors.results.map(d => <div key={d.key}>
        {Object.keys(d.verbatim).map(k => <span key={k}>{k}: {d.verbatim[k]}</span>)}
      </div>)}
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