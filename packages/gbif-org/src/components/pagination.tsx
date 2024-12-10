import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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

export function PaginationFooter({
  offset,
  limit = 20,
  count,
  maxPages = 5,
  onChange
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
            <PaginationPrevious />
          </PaginationItem>
        )}
        {hasBefore && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pages.map((page) => (
          <PaginationItem key={page.pageNumber} onClick={() => onChange(page.offset)}>
            <PaginationLink isActive={currentPage === page.pageNumber}>
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
            <PaginationNext  />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}