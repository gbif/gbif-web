import { Message } from '@/components/message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/smallCard';
import { ViewHeader } from '@/components/ViewHeader';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { filter2predicate } from '@/dataManagement/filterAdapter';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import useQuery from '@/hooks/useQuery';
import { useContext, useEffect } from 'react';
import { MdFileDownload } from 'react-icons/md';
import { searchConfig } from '../../searchConfig';
import { DownloadCardDescription, DownloadCardTitle, FreeTextWarning } from './shared';
import { useI18n } from '@/reactRouterPlugins';

const GBIF_ORG = import.meta.env.PUBLIC_GBIF_ORG;

const DOWNLOAD = `
query($predicate: Predicate){
  _queryId
  _variablesId
  occurrenceSearch(predicate: $predicate, size: 0) {
    documents {
      total
    }
    _meta
  }
}
`;

export function DownloadHostedPortal() {
  const defaultChecklistKey = useChecklistKey();
  // const localeSettings = useContext(LocaleContext);
  const currentFilterContext = useContext(FilterContext);
  const { scope } = useSearchContext();
  const { locale } = useI18n();
  const { data, loading, load } = useQuery(DOWNLOAD, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  const localePrefix = locale.gbifOrgLocalePrefix?.replace('/', '');

  useEffect(() => {
    const currentFilter = filter2predicate(currentFilterContext.filter, searchConfig);
    const predicate = {
      type: 'and',
      predicates: [scope, currentFilter].filter((x) => x),
    };
    load({ keepDataWhileLoading: false, variables: { predicate } });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterContext.filterHash, scope, load]);

  const fullPredicate = data?.occurrenceSearch?._meta?.normalizedPredicate?.predicate;
  const err = data?.occurrenceSearch?.meta?.normalizedPredicate?.err;

  const q = currentFilterContext?.filter?.must?.q;
  const hasFreeTextSearch = q && q.length > 0;

  // The predicate is sent as the body of a plain form POST rather than as a URL param, since
  // predicates are regularly larger than a URL can safely carry. gbif.org picks it up from the
  // posted form field and pre-fills the download editor with it.
  let serializedPredicate = '';
  try {
    serializedPredicate = fullPredicate ? JSON.stringify(fullPredicate) : '';
  } catch (e) {
    // ignore - we then simply post nothing and the user starts from an empty editor
  }

  const downloadUrl = `${GBIF_ORG}/${
    localePrefix ? `${localePrefix}/` : ''
  }occurrence/download/request?checklistKey=${defaultChecklistKey}`;

  return (
    <div className="g-my-20 g-w-96 g-max-w-full g-mx-auto">
      <ViewHeader
        message="counts.nRecords"
        loading={loading}
        total={data?.occurrenceSearch?.documents?.total}
      />
      <Card className="g-p-8 g-mt-2 g-text-center">
        <div className="g-w-16 g-h-16 g-mx-auto g-mb-4 g-text-slate-300 g-border-slate-300 g-text-4xl g-rounded-full g-border-2 g-flex g-items-center g-justify-center">
          <MdFileDownload />
        </div>

        {hasFreeTextSearch && <FreeTextWarning />}

        {!hasFreeTextSearch && (
          <>
            {err && (
              <>
                <DownloadCardTitle>
                  <Message id="download.unsupported.title" />
                </DownloadCardTitle>
                <DownloadCardDescription>
                  <p>
                    <Message id="download.unsupported.error" />
                  </p>
                  {err.message}
                </DownloadCardDescription>
              </>
            )}
            {(loading || !err) && (
              <>
                <DownloadCardTitle>
                  <Message id="download.download" />
                </DownloadCardTitle>
                <DownloadCardDescription>
                  <Message id="download.redirectNotice" />
                </DownloadCardDescription>
                {loading && (
                  <Button className="g-mt-6" disabled>
                    <Message id="download.continueToGBIF" />
                  </Button>
                )}
                {!loading && data && (
                  <form action={downloadUrl} method="post">
                    <textarea name="predicate" value={serializedPredicate} readOnly hidden />
                    <Button className="g-mt-6" type="submit">
                      <Message id="download.continueToGBIF" />
                    </Button>
                  </form>
                )}
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
