import { Table } from '@tanstack/react-table';
import { MdChevronLeft, MdChevronRight, MdFirstPage } from 'react-icons/md';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { FooterButton } from './footerButton';
import { InlineSkeletonWrapper } from './inlineSkeletonWrapper';

type Props<TData> = {
  table: Table<TData>;
  loading: boolean;
};

export function TableFooter<TData>({ table, loading }: Props<TData>) {
  return (
    <div className="g-flex g-justify-between g-items-center g-border-t g-px-2">
      <div className="g-flex g-flex-1">
        {table.getCanPreviousPage() && (
          <>
            <FooterButton
              onClick={table.firstPage}
              icon={<MdFirstPage />}
              toolTip={<FormattedMessage id="pagination.first" />}
            />
            <FooterButton
              onClick={table.previousPage}
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
              current: <FormattedNumber value={table.getState().pagination.pageIndex + 1} />,
              total: <FormattedNumber value={table.getPageCount()} />,
            }}
          />
        </span>
      </InlineSkeletonWrapper>
      <div className="g-flex g-flex-1 g-justify-end">
        {table.getCanNextPage() && (
          <FooterButton
            onClick={table.nextPage}
            icon={<MdChevronRight />}
            toolTip={<FormattedMessage id="pagination.next" />}
          />
        )}
      </div>
    </div>
  );
}
