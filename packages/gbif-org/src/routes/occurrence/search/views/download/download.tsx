import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import useQuery from '@/hooks/useQuery';
import { useEffect, useContext } from 'react';
import { MdFileDownload } from 'react-icons/md';
import { searchConfig } from '../../searchConfig';
import { filter2predicate } from '@/dataManagement/filterAdapter';
import { Card } from '@/components/ui/smallCard';
import { Message } from '@/components/message';
import { Button } from '@/components/ui/button';
import { ViewHeader } from '@/components/ViewHeader';

const GBIF_ORG = import.meta.env.PUBLIC_GBIF_ORG;

const DOWNLOAD = `
query($predicate: Predicate){
  occurrenceSearch(predicate: $predicate, size: 0) {
    documents {
      total
    }
    _downloadPredicate
  }
}
`;

export function Download() {
  // const localeSettings = useContext(LocaleContext);
  const currentFilterContext = useContext(FilterContext);
  const { scope } = useSearchContext();
  const { data, loading, load } = useQuery(DOWNLOAD, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  // const localePrefix = localeSettings?.localeMap?.gbif_org;
  const localePrefix = 'en';

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [scope, filter2predicate(currentFilterContext.filter, searchConfig)].filter(
        (x) => x
      ),
    };
    load({ keepDataWhileLoading: true, variables: { predicate } });
  }, [currentFilterContext.filterHash, scope, load]);

  const fullPredicate = data?.occurrenceSearch?._downloadPredicate?.predicate;
  const err = data?.occurrenceSearch?._downloadPredicate?.err;

  const q = currentFilterContext?.filter?.must?.q;
  const hasFreeTextSearch = q && q.length > 0;

  return (
    <div className="g-my-20 g-w-96 g-max-w-full g-mx-auto">
      <ViewHeader message="counts.nRecords" loading={loading} total={data?.occurrenceSearch?.documents?.total} />

      <Card className="g-p-8 g-mt-2 g-text-center">
        <div className="icon g-w-16 g-h-16 g-mx-auto g-mb-4 g-text-slate-300 g-border-slate-300 g-text-4xl g-rounded-full g-border-2 g-flex g-items-center g-justify-center">
          <MdFileDownload />
        </div>

        {hasFreeTextSearch && (
          <>
            <Title>
              <Message id="download.unsupported.title" />
            </Title>
            <Description>
              <Message id="download.unsupported.description" />
            </Description>
            <Button
              className="g-mt-6"
              disabled={loading}
              onClick={() => currentFilterContext.setField('q', [])}
              variant="primaryOutline"
            >
              <Message id="download.unsupported.remove" />
            </Button>
          </>
        )}

        {!hasFreeTextSearch && (
          <>
            {err && (
              <>
                <Title>
                  <Message id="download.unsupported.title" />
                </Title>
                <Description>
                  <p>
                    <Message id="download.unsupported.error" />
                  </p>
                  {err.message}
                </Description>
              </>
            )}
            {!err && fullPredicate && (
              <>
                <Title>
                  <Message id="download.download" />
                </Title>
                <Description>
                  <Message id="download.redirectNotice" />
                </Description>
                <Button className="g-mt-6" asChild disabled={loading}>
                  <a
                    href={`${GBIF_ORG}/${
                      localePrefix ? `${localePrefix}/` : ''
                    }occurrence/download/request?predicate=${encodeURIComponent(
                      JSON.stringify(fullPredicate)
                    )}#create`}
                  >
                    <Message id="download.continueToGBIF" />
                  </a>
                </Button>
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return <h3 className="g-my-2 g-font-medium g-text-slate-500">{children}</h3>;
}

function Description({ children }: { children: React.ReactNode }) {
  return <div className="g-text-sm g-mt-4 [&_p]:g-mb-2 g-text-slate-500">{children}</div>;
}
