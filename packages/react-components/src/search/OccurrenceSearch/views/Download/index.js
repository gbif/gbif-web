import { jsx } from '@emotion/react';
import React, { useEffect, useContext, useState, useCallback } from "react";
import { FilterContext } from '../../../../widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { useQuery } from '../../../../dataManagement/api';
import LocaleContext from '../../../../dataManagement/LocaleProvider/LocaleContext';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import * as css from './styles';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { MdFileDownload } from 'react-icons/md'
import { Button, Message } from '../../../../components';
import env from '../../../../../.env.json';

const DOWNLOAD = `
query($predicate: Predicate){
  occurrenceSearch(predicate: $predicate, size: 0) {
    _downloadPredicate
  }
}
`;

function Download() {
  const theme = useContext(ThemeContext);
  const localeSettings = useContext(LocaleContext);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(DOWNLOAD, { lazyLoad: true });

  const localePrefix = localeSettings?.localeMap?.gbif_org;

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig)
      ].filter(x => x)
    }
    load({ keepDataWhileLoading: true, variables: { predicate } });
  }, [currentFilterContext.filterHash, rootPredicate]);

  const fullPredicate = data?.occurrenceSearch?._downloadPredicate?.predicate;
  const err = data?.occurrenceSearch?._downloadPredicate?.err;

  const q = currentFilterContext?.filter?.must?.q;
  const hasFreeTextSearch = q && q.length > 0;

  return <div css={css.card({ theme })} style={{ margin: '24px auto' }}>
    <div css={css.icon}>
      <MdFileDownload />
    </div>

    {hasFreeTextSearch && <>
      <h4 css={css.title({ theme })}><Message id="download.unsupported.title" /></h4>
      <div css={css.description({ theme })}>
        <Message id="download.unsupported.description" />
      </div>
      <Button disabled={loading} onClick={e => currentFilterContext.setField('q')} appearance="primaryOutline"><Message id="download.unsupported.remove" /></Button>
    </>}

    {!hasFreeTextSearch && <>
      {err && <>
        <h4 css={css.title({ theme })}><Message id="download.unsupported.title" /></h4>
        <div css={css.description({ theme })}>
          <p><Message id="download.unsupported.error" /></p>
          {err.message}
        </div>
      </>}
      {!err && fullPredicate && <>
        <h4 css={css.title({ theme })}><Message id="download.download" /></h4>
        <div css={css.description({ theme })}>
          <Message allowNewLines id="download.redirectNotice"
            values={{
              p: chunks => <p>{chunks}</p>,
              br: chunks => <><br />{chunks}</>,
              icon: <svg />,
            }}
          />
        </div>
        <Button
          as="a"
          href={`${env.GBIF_ORG}/${localePrefix ? `${localePrefix}/` : ''}occurrence/download/request?predicate=${encodeURIComponent(JSON.stringify(fullPredicate))}#create`}
          disabled={loading}
          appearance="primary"><Message id="download.continueToGBIF" /></Button>
      </>}
    </>}
  </div>
}

export default Download;

