import { jsx, css } from '@emotion/react';
import React, { useEffect } from 'react';
import { useQuery } from '../../../../dataManagement/api';
import { ProgressItem } from "../../../../components";
import { SkeletonLoader } from './SkeletonLoader';

export function TopTaxa({
  predicate,
  ...props
}) {
  const { data, error, loading, load } = useQuery(OCCURRENCE_STATS, { lazyLoad: true });

  useEffect(() => {
    load({
      variables: {
        predicate
      }
    });
  }, [predicate]);

  const total = data?.occurrenceSearch?.documents?.total;

  if (error) return <div>Failed to load stats</div>
  if (!data || loading) return <SkeletonLoader />

  return <>
    <h4 css={css`margin: 0 0 24px 0; font-size: 14px;`}>Top 10 shared taxa</h4>
    <div>
      <ul css={css`padding: 0; margin: 0; list-style: none;`}>
        {data?.occurrenceSearch?.facet?.taxonKey.map((x, i) => {
          return <li>
            <ProgressItem style={{ marginBottom: 12 }} fraction={x.count / total} title={<span dangerouslySetInnerHTML={{__html: x.taxon.formattedName}}></span>} subtleText />
          </li>
        })}
      </ul>
    </div>
  </>
};

const OCCURRENCE_STATS = `
query topTaxa($predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    facet {
      taxonKey(size: 10) {
        count
        taxon {
          formattedName
        }
      }
    }
  }
}
`;

