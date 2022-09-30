
import { jsx, css } from '@emotion/react';
import React, { useContext, useEffect } from 'react';
import { useQuery } from '../../../dataManagement/api';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as styles from './styles';
import { ResourceLink, Progress, Skeleton, Tooltip } from "../../../components";
import { EmptyInboxIcon } from "../../../components/Icons/Icons";
import sortBy from 'lodash/sortBy';
import { MdSearch } from 'react-icons/md';
import { ImDrawer2 } from 'react-icons/im';
import { FormattedMessage } from 'react-intl';
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
      <EmptyInboxIcon css={css`font-size: 100px; color: var(--color400);`} />
      <div css={css`font-size: 18px; margin: 24px; color: var(--color400); font-weight: 500;`}>This institution has no known collections</div>
      <OrphanedCollectionCodes institution={institution} css={css`margin-top: 48px;`} />
    </div>
  }
  return <div css={styles.collections({ theme })}>
    <div style={{ width: '100%', marginBottom: 24 }}>
      {/* <div css={css`font-size: 20px; color: #aaa; margin: 48px 0;`}>
        <MdSearch /> Search
      </div> */}
      <div>
        {sortBy(collections, ['numberSpecimens', 'occurrenceCount']).reverse().map(collection => {
          return <article css={styles.collectionCard}>
            <div css={styles.summary}>
              <div>
                <Tooltip title={`Metadata richness: ${collection.richness}%`}>
                  <div css={styles.progressCircular({ percent: collection.richness, size: '48px' })}></div>
                </Tooltip>
              </div>
              <div>
                <ResourceLink discreet type="collectionKey" id={collection.key}>
                  <h3 css={styles.headline}>{collection.name} {!collection.active && <span css={css`font-style: italic; color: var(--color400);`}>Inactive</span>}</h3>
                </ResourceLink>
                <div css={styles.comment}>Code: {collection.code}</div>
              </div>
              <div>
                <Tooltip title={`Relative to institution size`}>
                  <div>
                    <Progress css={styles.main} unknown={!institution.numberSpecimens} percent={institution.numberSpecimens > 0 ? 100 * collection.numberSpecimens / institution.numberSpecimens : 0} style={{ height: 16, margin: 10 }} />
                    <div css={styles.comment}>
                      <FormattedMessage id="counts.nRecords" values={{ total: collection.numberSpecimens }} />
                    </div>
                  </div>
                </Tooltip>
              </div>
              <div>
                <Tooltip title={`Relative to collection size`}>
                  <div>
                    <Progress css={styles.main} unknown={!collection.numberSpecimens} percent={collection.occurrenceCount ? 100 * collection.occurrenceCount / collection.numberSpecimens : 0} style={{ height: 16, margin: 10 }} />
                    <div css={styles.comment}>
                      <FormattedMessage id="counts.inGbif" values={{ total: collection.occurrenceCount }} />
                    </div>
                  </div>
                </Tooltip>
              </div>
            </div>
            <div css={css`margin-top: 24px; color: var(--color700);`}>
              {collection.excerpt}
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

  if (!data && loading) return <Skeleton style={{ margin: '96px 0' }} width="250px" />
  if (data?.orphaned?.cardinality?.collectionCode === 0 || error || loading) return null;

  return <div css={css`padding: 96px 0; color: var(--color600);`}>
    <div css={css`color: orange; font-weight: bold; margin-bottom: 12px;`}>We see these unknown collection codes being used in published data</div>
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

