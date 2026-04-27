import { Button } from '@/components/ui/button';
import { FormattedMessage } from 'react-intl';

export interface PagingProps {
  next: () => void;
  prev: () => void;
  isLastPage: boolean;
  isFirstPage: boolean;
}

export function Paging({ next, prev, isLastPage, isFirstPage }: PagingProps) {
  if (isFirstPage && isLastPage) return null;
  return (
    <div className="g-mb-2">
      {!(isLastPage && isFirstPage) && (
        <Button
          size="sm"
          variant="secondary"
          onClick={prev}
          className="g-me-2"
          disabled={isFirstPage}
        >
          <FormattedMessage id="pagination.previous" />
        </Button>
      )}
      {!isLastPage && (
        <Button size="sm" variant="secondary" onClick={next}>
          <FormattedMessage id="pagination.next" />
        </Button>
      )}
    </div>
  );
}
