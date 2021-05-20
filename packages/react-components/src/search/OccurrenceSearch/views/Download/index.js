import { jsx } from '@emotion/react';
import React, { useEffect, useContext, useState, useCallback } from "react";
import { FilterContext } from '../../../../widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import * as css from './styles';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { MdFileDownload } from 'react-icons/md'
import { Button } from '../../../../components';

const DOWNLOAD = `
query($predicate: Predicate){
  occurrenceSearch(predicate: $predicate, size: 0) {
    _downloadPredicate
  }
}
`;

function Download() {
  const theme = useContext(ThemeContext);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(DOWNLOAD, { lazyLoad: true, keepDataWhileLoading: true });

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig)
      ].filter(x => x)
    }
    load({ variables: { predicate } });
  }, [currentFilterContext.filterHash, rootPredicate]);

  const fullPredicate = data?.occurrenceSearch?._downloadPredicate?.predicate;
  const err = data?.occurrenceSearch?._downloadPredicate?.err;

  const q = currentFilterContext?.filter?.must?.q;
  const hasFreeTextSearch = q && q.length > 0;
  
  return <div css={css.card({theme})} style={{margin: '24px auto'}}>
      <div css={css.icon}>
        <MdFileDownload />
      </div>

      {hasFreeTextSearch && <>
        <h4 css={css.title({theme})}>Unsupported query</h4>
        <div css={css.description({theme})}>
          Free text search can be used for exploration, but do not have download support.
        </div>
        <Button disabled={loading} onClick={e => currentFilterContext.setField('q')} appearance="primaryOutline">Remove filter</Button>
      </>}

      {!hasFreeTextSearch && <>
        {err && <>
          <h4 css={css.title({theme})}>Unsupported query</h4>
          <div css={css.description({theme})}>
            <p>The filter looks to be unsupported</p>
            {err.message}
          </div>
        </>}
        {!err && fullPredicate && <>
          <h4 css={css.title({theme})}>Download</h4>
          <div css={css.description({theme})}>
            <p>
              You are about to download, to do so you will be redirected to GBIF.org.
            </p>
            <p>
              Be aware that an account is needed to download the content.
            </p>
          </div>
          <Button 
            as="a" 
            href={`https://www.gbif.org/occurrence/download/request?predicate=${encodeURIComponent(JSON.stringify(fullPredicate))}#create`} 
            disabled={loading}
            appearance="primary">Continue</Button>
        </>}
      </>}
    </div>
}

export default Download;

