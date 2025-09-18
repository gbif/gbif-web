import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Paging } from '../../taxon/key/VernacularNameTable';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DownloadResult } from '../../user/downloads/downloadResult';
const columns = ['Date', 'Format', 'Citation', 'Filters'];

const OccurrenceSnapshotsTable = ({ results }) => {
  const [offset, setOffset] = useState(0);
  const [dialogContent, setDialogContent] = useState(null);
  const limit = 10;
  // Table implementation goes here
  return (
    <Card>
      <div className="g-overflow-auto">
        <table className="g-w-full g-text-sm">
          <thead className="g-shadow-sm">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="g-p-4 g-text-left g-whitespace-nowrap "
                  style={{ width: `${100 / columns.length}%` }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!results &&
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
                  <td>
                    <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
                  </td>
                </tr>
              ))}
            {results &&
              results.slice(offset, offset + limit).map((res, i) => (
                <tr className="g-font-bold">
                  <td key={'date'} className="g-p-4 ">
                    {<FormattedDate value={res.created} />}
                  </td>
                  <td key={'date'} className="g-p-4 ">
                    {
                      <FormattedMessage
                        id={`downloadFormat.${res.request.format}`}
                        defaultMessage={res.request.format}
                      />
                    }
                  </td>
                  <td key={'date'} className="g-p-4 " style={{ width: `50%` }}>
                    {
                      <span>
                        <a href="https://www.gbif.org" className="g-link g-text-blue-500">
                          GBIF.org
                        </a>{' '}
                        (
                        <FormattedDate value={res.created} />) GBIF Occurrence Download{' '}
                        <a className="g-link g-text-blue-500" href={`https://doi.org/${res.doi}`}>
                          https://doi.org/{res.doi}
                        </a>
                      </span>
                    }
                  </td>
                  <td>
                    {res?.request?.predicate && (
                      <Button variant="link" onClick={() => setDialogContent(res)}>
                        Yes
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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
      </div>
      <Dialog open={!!dialogContent} onOpenChange={() => setDialogContent(null)}>
        <DialogContent
          className="gbif g-max-w-3xl g-p-10 g-bg-opacity-100"
          title="Download details"
        >
          <DownloadResult download={dialogContent || {}} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OccurrenceSnapshotsTable;
