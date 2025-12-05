
import { jsx } from '@emotion/react';
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '../../../dataManagement/api';
import { CollectorsPresentation } from './collectorsPresentation';

export function Collectors({
  id,
  defaultTab = 'about',
  ...props
}) {
  const { data, error, loading, load } = useQuery(COLLECTORS, { lazyLoad: true });
  const [size, setSize] = useState(10);
  const [q, setQ] = useState();

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const predicates = [
        {
          "type": "equals",
          "key": "collectionKey",
          "value": id
        }
      ];
      if (q && q !== '') {
        predicates.push({
          "type": "like",
          "key": "recordedBy",
          "value": `*${q}*`
        });
      }

      load({
        keepDataWhileLoading: true,
        variables: {
          key: id,
          size,
          predicate: {
            "type": "and",
            predicates: predicates
          }
        }
      });
    }
  }, [id, size, q]);

  const loadMore = useCallback(() => {
    setSize(size + 50);
  }, [size]);

  const search = useCallback((q) => {
    setSize(10);
    setQ(q);
  }, []);

  return <CollectorsPresentation {...{ loadMore, size, search, data, error, loading: loading || !data, id }} />
};

const COLLECTORS = `
query collectors($predicate: Predicate, $size: Int){
  occurrenceSearch(predicate: $predicate) {
    facet {
      recordedBy(size: $size) {
        key
        count
        occurrencesIdentifiedBy {
          documents {
            total
          }
        }
      }
    }
  }
}
`;
