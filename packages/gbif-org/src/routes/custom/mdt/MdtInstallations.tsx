import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';

import { MdtDataContext } from './MdtData';
import { useContext, useEffect, useState } from 'react';
import { MdtDatasetsQuery } from '@/gql/graphql';
import { Skeleton } from '@/components/ui/skeleton';
import { FormattedMessage } from 'react-intl';
import { FormattedNumber } from '@/components/dashboard/shared';
import { DynamicLink } from '@/reactRouterPlugins';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MdInfo } from 'react-icons/md';

export const MdtInstallations = () => {
  const { data }: { data: MdtDatasetsQuery } = useContext(MdtDataContext);
  const [summedData, setSummedData] = useState<Array<{
    occurrenceCount: number;
    __typename?: 'Installation';
    key: string;
    title?: string | null;
    homepage?: string | null;
    dataset: {
      __typename?: 'DatasetListResults';
      count: number;
      results: any[];
    };
  }> | null>(null);
  useEffect(() => {
    if (data?.installationSearch?.results) {
      const updatedResults = data?.installationSearch?.results.map((installation) => ({
        ...installation,
        link: installation?.endpoints
          ?.find((e) => e?.type === 'FEED')
          ?.url.split('/service/rss')[0],
        occurrenceCount: installation.dataset?.results.reduce((acc, curr) => {
          return acc + (curr.occurrenceCount || 0);
        }, 0),
      }));
      setSummedData([
        ...updatedResults,
        {
          title: 'Other/unknown installations',
          key: 'other',
          occurrenceCount:
            data?.datasetSearchByPredicate?.results.reduce(
              (acc, curr) => acc + (curr?.occurrenceCount || 0),
              0
            ) || 0,
          dataset: {
            count: data?.datasetSearchByPredicate?.results.length || 0,
            results: data?.datasetSearchByPredicate?.results || [],
          },
        },
      ]);
    }
  }, [data]);

  return (
    <ArticleContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {summedData && (
          <table className="g-w-full g-text-sm g-mb-8 g-bg-white">
            <thead className="g-shadow-sm">
              <tr>
                <th className="g-p-4 g-text-left g-whitespace-nowrap " style={{ width: '50%' }}>
                  <FormattedMessage id="mdt.installations.table.name" defaultMessage="Name" />
                </th>
                <th className="g-p-4 g-text-left g-whitespace-nowrap " style={{ width: '25%' }}>
                  <FormattedMessage
                    id="mdt.installations.table.datasets"
                    defaultMessage="Datasets"
                  />
                </th>
                <th className="g-p-4 g-text-left g-whitespace-nowrap " style={{ width: '25%' }}>
                  <FormattedMessage
                    id="mdt.installations.table.occurrences"
                    defaultMessage="Occurrences"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {summedData.map((inst) => (
                <tr key={inst.key}>
                  <td className="g-p-4 ">
                    {inst?.link ? (
                      <a
                        href={inst.link}
                        target="_blank"
                        rel="noreferrer"
                        className="g-text-blue-500 hover:g-underline"
                      >
                        {inst.title || inst.key}
                      </a>
                    ) : (
                      <span>{inst.title || inst.key}</span>
                    )}
                    {inst?.description && (
                      <Popover>
                        <PopoverTrigger>
                          <MdInfo className="g-inline g-ms-1" />
                        </PopoverTrigger>
                        {inst?.description && (
                          <PopoverContent className="g-max-w-sm">
                            <span dangerouslySetInnerHTML={{ __html: inst.description }}></span>
                          </PopoverContent>
                        )}
                      </Popover>
                    )}
                  </td>
                  <td className="g-p-4 ">
                    <DynamicLink
                      pageId={'occurrenceSearch'}
                      searchParams={{
                        datasetKey: inst.dataset?.results.map((ds) => ds?.key),
                        view: 'datasets',
                      }}
                    >
                      <FormattedNumber value={inst.dataset?.count || 0} />
                    </DynamicLink>
                  </td>
                  <td className="g-p-4 ">
                    <DynamicLink
                      pageId={'occurrenceSearch'}
                      searchParams={{
                        datasetKey: inst.dataset?.results.map((ds) => ds?.key),
                        view: 'map',
                      }}
                    >
                      <FormattedNumber value={inst.occurrenceCount || 0} />
                    </DynamicLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!summedData &&
          Array.from({ length: 10 }).map((x, i) => (
            <tr key={i}>
              <td>
                <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
              </td>
              <td>
                <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
              </td>
              <td>
                <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
              </td>
            </tr>
          ))}
      </ArticleTextContainer>
    </ArticleContainer>
  );
};
