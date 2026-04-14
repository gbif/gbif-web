import { Table } from '@/components/dashboard/shared';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

const DEFAULT_LIMIT = 10;

interface VernacularNameTableProps {
  columnTitle?: string;
  vernacularName?: string | null;
  language?: string | null;
}

export function VernacularNameTable({ vernacularNames }: VernacularNameTableProps) {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);

  return (
    <>
      <div className="g-text-sm g-text-slate-500 g-mb-1">
        <>
          <FormattedMessage id="counts.nResults" values={{ total: vernacularNames.length }} />
          {vernacularNames.length > limit && (
            <Button
              variant="link"
              onClick={() => {
                setLimit(vernacularNames.length);
                setOffset(0);
              }}
            >
              <FormattedMessage id="taxon.showAll" />
            </Button>
          )}
          {limit > DEFAULT_LIMIT && (
            <Button
              variant="link"
              onClick={() => {
                setLimit(DEFAULT_LIMIT);
                setOffset(0);
              }}
            >
              <FormattedMessage id="taxon.showLess" />
            </Button>
          )}
        </>
      </div>
      <div style={{ overflow: 'auto' }}>
        <Table removeBorder={false}>
          <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
            {vernacularNames.slice(offset, offset + limit).map((e, i) => {
              return (
                <tr key={i}>
                  <td>
                    <div>
                      {e.vernacularName}{' '}
                      {e.language && (
                        <span className="g-text-sm g-text-slate-500">
                          {' '}
                          <FormattedMessage
                            id={`enums.language.${e.language}`}
                            defaultMessage={e.language}
                          />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Paging
          next={() => setOffset(offset + limit)}
          prev={() => setOffset(offset - limit)}
          isFirstPage={offset === 0}
          isLastPage={offset + limit >= vernacularNames.length}
        />
      </div>
    </>
  );
}

interface PagingProps {
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
