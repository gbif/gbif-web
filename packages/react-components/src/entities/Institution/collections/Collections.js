
import { jsx, css } from '@emotion/react';
import React, { useContext, useEffect } from 'react';
import { useQuery } from '../../../dataManagement/api';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as styles from './styles';
import { ResourceLink, Progress } from "../../../components";
import { EmptyInboxIcon } from "../../../components/Icons/Icons";
import sortBy from 'lodash/sortBy';
import { MdSearch } from 'react-icons/md';
import { ImDrawer2 } from 'react-icons/im';
// import { FormattedMessage } from 'react-intl';

export function Collections({
  institution,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { collections } = institution;
  const totalGBifSize = collections.reduce((a, c) => a += c.occurrenceCount || 0, 0);
  const totalEstimatedSize = collections.reduce((a, c) => a += c.numberSpecimens || 0, 0);

  if (collections.length === 0) {
    return <div css={css`text-align: center; margin-top: 96px;`}>
      <EmptyInboxIcon css={css`font-size: 100px; color: var(--color400);`}/>
      <div css={css`font-size: 18px; margin: 24px; color: var(--color400); font-weight: 500;`}>This institution has no known collections</div>
      <OrphanedCollectionCodes institution={institution} css={css`margin-top: 48px;`}/>
    </div>
  }
  return <div css={styles.collections({ theme })}>
    <div style={{ width: '100%', marginBottom: 24 }}>
      {/* <div css={css`font-size: 20px; color: #aaa; margin: 48px 0;`}>
        <MdSearch /> Search
      </div> */}
      <div>
        {sortBy(collections, ['numberSpecimens', 'occurrenceCount']).map(collection => {
          return <article css={styles.collectionCard}>
            <div css={styles.summary}>
              <div>
                <ResourceLink discreet type="collectionKey" id={collection.key}>
                  <h4>{collection.name}</h4>
                </ResourceLink>
                <div css={styles.comment}>Code: {collection.code}</div>
              </div>
              <div>
                <Progress percent={100 * collection.numberSpecimens / (institution.numberSpecimens || totalEstimatedSize)} style={{ height: 16, margin: 10 }} />
                <div css={styles.comment}>
                  {collection.numberSpecimens} specimens
                </div>
              </div>
              <div>
                <Progress percent={collection.occurrenceCount ? 100 * collection.occurrenceCount / totalGBifSize : 0} style={{ height: 16, margin: 10 }} />
                <div css={styles.comment}>
                  {collection.occurrenceCount} in GBIF
                </div>
              </div>
              <div>
                <div css={styles.progressCircular({ percent: collection.richness, size: '48px' })}>{collection.richness}</div>
              </div>
              <div>
                <div css={styles.active}>Active</div>
              </div>
            </div>
          </article>
        })}
      </div>
      <OrphanedCollectionCodes institution={institution} />
    </div>
  </div>
};

/*
title
excerpt
size relative to total and digitized
digitized bar relative to total digitized
digitized relative to stated total
circle: completeness of metadata (description, taxonomicCoverage, geography, numberSpecimens, email, address, homepage)
status: inactive/active
*/

function OrphanedCollectionCodes({ institution, ...props }) {
  const { data, error, loading, load } = useQuery(OCCURRENCE_STATS, { lazyLoad: true });
  const { key } = institution;
  
  useEffect(() => {
    load({
      variables: {
        predicate: {
          type: 'and',
          predicates: [
            {
              type: "equals",
              key: "institutionKey",
              value: key
            },
            {
              "type": "not",
              "predicate": {
                "type": "isNotNull",
                "key": "collectionKey"
              }
            },
            {
              "type": "isNotNull",
              "key": "collectionCode"
            }
          ]
        }
      }
    });
  }, [key]);

  if (data?.orphaned?.cardinality?.collectionCode === 0 || error || loading) return null;

  return <div css={css`padding: 96px; color: var(--color600);`}>
    <div css={css`font-weight: bold; margin-bottom: 12px;`}>We see these unknown codes being used in published data</div>
    {/* <ul css={css`margin: 0; padding: 12px 0;`} css=> */}
    <ul css={styles.bulletList}>
      {data?.orphaned?.facet?.collectionCode.map(code => <li key={code.key}>{code.key}</li>)}
    </ul>
  </div>
}


const OCCURRENCE_STATS = `
query ocurrenceSearch($predicate: Predicate){
  orphaned: occurrenceSearch(predicate: $predicate) {
    cardinality {
      collectionCode
    }
    facet {
      collectionCode(size: 10) {
        key
        count
      }
    }
  }
}
`;

