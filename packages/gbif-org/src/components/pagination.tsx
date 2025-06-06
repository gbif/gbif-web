import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import useBelow from '@/hooks/useBelow';
import { cn } from '@/utils/shadcn';

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
  onChange,
}: {
  offset: number;
  limit: number;
  count: number;
  onChange: (offset: number) => void;
}) {
  const isMobile = useBelow(640 /* sm from tailwind */);

  const { pages, currentPage, previousPageOffset, nextPageOffset, hasBefore, hasAfter } = getPages({
    offset,
    limit,
    count,
    maxPages: isMobile ? 3 : 5,
  });

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem
            className="g-text-inherit g-cursor-pointer"
            onClick={() => onChange(previousPageOffset)}
          >
            <PaginationPrevious className="g-text-inherit" />
          </PaginationItem>
        )}
        {hasBefore && (
          <PaginationItem className="g-text-inherit">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pages.map((page) => {
          const isActive = currentPage === page.pageNumber;

          return (
            <PaginationItem
              className={cn({ 'g-cursor-pointer': !isActive, 'g-pointer-events-none': isActive })}
              key={page.pageNumber}
              onClick={() => onChange(page.offset)}
            >
              <PaginationLink isActive={isActive} className="g-text-inherit">
                {page.pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {hasAfter && (
          <PaginationItem className="g-text-inherit">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {offset + limit < count && (
          <PaginationItem
            className="g-text-inherit g-cursor-pointer"
            onClick={() => onChange(nextPageOffset)}
          >
            <PaginationNext className="g-text-inherit" />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
