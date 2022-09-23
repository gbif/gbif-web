
import { jsx, css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as styles from './styles';
import { ResourceLink, Progress } from "../../../components";
import sortBy from 'lodash/sortBy';
import { MdSearch } from 'react-icons/md';
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
                <div css={styles.progressCircular({ percent: collection.completeness.percent, size: '48px' })}>{collection.completeness.present}/{collection.completeness.total}</div>
              </div>
              <div>
                <div css={styles.active}>Active</div>
              </div>
            </div>
          </article>
        })}
      </div>
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