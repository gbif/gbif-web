
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { ResourceLink } from "../../../components";
import sortBy from 'lodash/sortBy';

export function Collections({
  institution,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { collections } = institution;

  return <div css={css.collections({ theme })}>
    <div style={{ width: '100%', marginBottom: 24 }}>
      <div>
        {sortBy(collections, ['active', 'code']).map(collection => {
          return <article style={{opacity: collection.active ? '1' : '.2'}}>
            <ResourceLink type="collectionKey" id={collection.key}>
              <h3>{collection.name}</h3>
            </ResourceLink>
            <div>{collection.code}</div>
            <div>{JSON.stringify(collection.active)}</div>
            <div>{collection.excerpt}</div>
          </article>
        })}
      </div>
    </div>
  </div>
};
