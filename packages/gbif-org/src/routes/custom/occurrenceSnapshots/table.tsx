import { SkeletonBody, Table, Th } from '@/components/clientTable';
import { LongDate, ShortDate } from '@/components/dateFormats';
import { Paging } from '@/components/paging';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card } from '@/components/ui/largeCard';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { DownloadResult } from '../../user/downloads/downloadResult';

const columns = ['date', 'format', 'citation', 'filters'];

const OccurrenceSnapshotsTable = ({ results }) => {
  const { formatMessage } = useIntl();
  const [offset, setOffset] = useState(0);
  const [dialogContent, setDialogContent] = useState(null);
  const limit = 10;

  return (
    <Card className="gbif-table-style">
      <Table>
        <thead>
          <tr>
            {columns.map((col) => (
              <Th key={col}>
                <FormattedMessage id={`occurrenceSnapshots.table.columns.${col}`} />
              </Th>
            ))}
          </tr>
        </thead>
        {!results && <SkeletonBody rows={10} columns={columns.length} />}
        {results && (
          <tbody>
            {results.slice(offset, offset + limit).map((res, i) => (
              <tr key={i}>
                <td className="g-whitespace-nowrap">
                  <ShortDate value={res.created} />
                </td>
                <td>
                  <FormattedMessage
                    id={`enums.downloadFormat.${res.request.format}`}
                    defaultMessage={res.request.format}
                  />
                </td>
                <td className="prose-links">
                  <a href="https://www.gbif.org">GBIF.org</a> (
                  <LongDate value={res.created} />){' '}
                  <FormattedMessage id="occurrenceSnapshots.table.citation" />{' '}
                  <a href={`https://doi.org/${res.doi}`}>https://doi.org/{res.doi}</a>
                </td>
                <td>
                  {res?.request?.predicate && (
                    <Button variant="link" onClick={() => setDialogContent(res)}>
                      <FormattedMessage id="occurrenceSnapshots.table.hasFilters" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </Table>
      <div className="g-flex g-p-4">
        <div className="g-flex-auto"></div>
        <div>
          <Paging
            next={() => setOffset(offset + limit)}
            prev={() => setOffset(offset - limit)}
            isFirstPage={offset === 0}
            isLastPage={offset + limit >= (results?.length || 0)}
          />
        </div>
      </div>
      <Dialog open={!!dialogContent} onOpenChange={() => setDialogContent(null)}>
        <DialogContent
          className="gbif g-max-w-3xl g-p-10 g-bg-opacity-100"
          title={formatMessage({ id: 'occurrenceSnapshots.table.downloadDetails' })}
        >
          <DownloadResult download={dialogContent || {}} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OccurrenceSnapshotsTable;
