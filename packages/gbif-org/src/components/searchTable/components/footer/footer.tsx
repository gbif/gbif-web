import { MdChevronLeft, MdChevronRight, MdFirstPage } from 'react-icons/md';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { FooterButton } from './footerButton';
import { InlineSkeletonWrapper } from '../inlineSkeletonWrapper';
import { usePagination } from '../../hooks/usePagination';
import { PaginationState, SetPaginationState } from '../../hooks/usePaginationState';

type Props = {
  loading: boolean;
  paginationState: PaginationState;
  setPaginationState: SetPaginationState;
  rowCount?: number;
};

export function Footer({ loading, paginationState, setPaginationState, rowCount }: Props) {
  const { hasPreviousPage, firstPage, previousPage, pageNumber, pageCount, hasNextPage, nextPage } =
    usePagination({
      paginationState,
      setPaginationState,
      rowCount,
    });

  return (
    <div className="g-flex g-justify-between g-items-center g-border-t g-px-2">
      <div className="g-flex g-flex-1">
        {hasPreviousPage && (
          <>
            <FooterButton
              disable={loading}
              onClick={firstPage}
              icon={<MdFirstPage />}
              toolTip={<FormattedMessage id="pagination.first" />}
            />
            <FooterButton
              disable={loading}
              onClick={previousPage}
              icon={<MdChevronLeft />}
              toolTip={<FormattedMessage id="pagination.previous" />}
            />
          </>
        )}
      </div>
      <InlineSkeletonWrapper loading={loading}>
        <span className="g-text-xs">
          <FormattedMessage
            id="pagination.pageXofY"
            defaultMessage={'Loading'}
            values={{
              current: <FormattedNumber value={pageNumber} />,
              total: <FormattedNumber value={pageCount ?? 0} />,
            }}
          />
        </span>
      </InlineSkeletonWrapper>
      <div className="g-flex g-flex-1 g-justify-end">
        {hasNextPage && (
          <FooterButton
            disable={loading}
            onClick={nextPage}
            icon={<MdChevronRight />}
            toolTip={<FormattedMessage id="pagination.next" />}
          />
        )}
      </div>
    </div>
  );
}
