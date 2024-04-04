import { useEffect, useState } from 'react';
import {
  InstallationDatasetsQuery,
  InstallationDatasetsQueryVariables,
  InstallationQuery,
} from '@/gql/graphql';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import useQuery from '@/hooks/useQuery';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { DatasetResult } from '@/routes/dataset/datasetResult';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/largeCard';
import Properties, { Property, PropertyLabel, Term, Value } from './Properties';
import EmptyValue from '@/components/EmptyValue';
import { FormattedMessage } from 'react-intl';
import { DynamicLink } from '@/components/dynamicLink';

export function InstallationKeyAbout() {
  const { data } = useParentRouteLoaderData(RouteId.Installation) as { data: InstallationQuery };
  const [offset, setOffset] = useState(0);

  const { installation } = data;

  const {
    data: datasetData,
    error,
    load,
    loading,
  } = useQuery<InstallationDatasetsQuery, InstallationDatasetsQueryVariables>(DATASET_QUERY, {
    throwAllErrors: true,
    lazyLoad: true,
  });

  useEffect(() => {
    // load datasets and refresh when pages change
    if (!installation?.key) return;

    load({
      variables: {
        installation: installation.key,
        limit: 5,
        offset,
      },
    });
  }, [installation?.key, offset]);

  const datasets = datasetData?.installation?.dataset;

  if (loading || !datasetData || !installation) return <CardListSkeleton />;

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          {installation.description && (
            <div
              className="prose mb-6"
              dangerouslySetInnerHTML={{ __html: installation.description }}
            ></div>
          )}

          <div>
            <Properties>
              <Property labelId={'installation.installationType'}>
                <FormattedMessage id={`enums.installationType.${installation.type}`} />
              </Property>
              {installation.organization && (
                <Property labelId={'installation.hostedBy'}>
                  <DynamicLink to={`/publisher/${installation.organization.key}`}>
                    {installation.organization.title}
                  </DynamicLink>
                </Property>
              )}
              <Property
                labelId={'installation.endpoints'}
                value={installation.endpoints?.map((x) => x?.url)}
              />
            </Properties>
          </div>
        </CardContent>
      </Card>

      <CardHeader>
        <CardTitle>
          <FormattedMessage
            id="counts.nHostedDatasets"
            values={{ total: installation.dataset.count }}
          />
        </CardTitle>
      </CardHeader>
      {datasets && datasets.results.map((item) => <DatasetResult key={item.key} dataset={item} />)}

      {datasets?.count && datasets?.count > datasets?.limit && (
        <PaginationFooter
          offset={datasets.offset}
          count={datasets.count}
          limit={datasets.limit}
          onChange={(x) => setOffset(x)}
        />
      )}
    </div>
  );
}

const DATASET_QUERY = /* GraphQL */ `
  query InstallationDatasets($installation: ID!, $limit: Int!, $offset: Int!) {
    installation(key: $installation) {
      dataset(limit: $limit, offset: $offset) {
        limit
        offset
        count
        endOfRecords
        results {
          ...DatasetResult
        }
      }
    }
  }
`;

function getPages({
  offset,
  limit = 20,
  count,
  maxPages = 5,
}: {
  offset: number;
  limit: number;
  count: number;
  maxPages?: number;
}) {
  const extraPages = Math.max(maxPages - 1, 0);
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);
  const start = Math.max(1, currentPage - Math.floor(extraPages / 2));
  const end = Math.min(start + extraPages, totalPages);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i).map((x) => ({
    pageNumber: x,
    offset: limit * (x - 1),
  }));
  const previousPageOffset = Math.max(offset - limit, 0);
  const nextPageOffset = Math.min(offset + limit, totalPages * limit);
  const hasBefore = pages[0].pageNumber > 1;
  const hasAfter = pages[pages.length - 1].pageNumber < totalPages;
  return {
    pages,
    currentPage,
    totalPages,
    previousPageOffset,
    nextPageOffset,
    hasBefore,
    hasAfter,
  };
}

function PaginationFooter({
  offset,
  limit = 20,
  count,
  maxPages = 5,
  onChange,
}: {
  offset: number;
  limit: number;
  count: number;
  maxPages?: number;
  onChange: (offset: number) => void;
}) {
  const { pages, currentPage, previousPageOffset, nextPageOffset, hasBefore, hasAfter } = getPages({
    offset,
    limit,
    count,
    maxPages,
  });

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem onClick={() => onChange(previousPageOffset)}>
            <PaginationPrevious href="#" />
          </PaginationItem>
        )}
        {hasBefore && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pages.map((page) => (
          <PaginationItem key={page.pageNumber} onClick={() => onChange(page.offset)}>
            <PaginationLink href="#" isActive={currentPage === page.pageNumber}>
              {page.pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        {hasAfter && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {offset + limit < count && (
          <PaginationItem onClick={() => onChange(nextPageOffset)}>
            <PaginationNext href="#" />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
