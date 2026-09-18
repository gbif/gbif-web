import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { getSequenceAvailability } from './utils';

/**
 * A FASTA archive only contains the records of the search that carry a DNA sequence - the download
 * service applies that restriction itself. This tells the user what that means for the search they
 * are currently looking at: whether the format is usable at all, and if it is, how much of the
 * search ends up in the archive. It is rendered in the format list, in the configuration step and
 * in the terms step, so it keeps saying the same thing if the filters change mid-flow.
 */
export function SequenceAvailabilityNotice({
  totalRecords,
  sequencedRecords,
  loading,
  className = '',
}: {
  totalRecords?: number;
  sequencedRecords?: number;
  loading?: boolean;
  className?: string;
}) {
  const availability = getSequenceAvailability({ totalRecords, sequencedRecords, loading });

  if (availability === 'loading') {
    return <Skeleton className={`g-h-16 ${className}`} />;
  }

  // Nothing worth saying when every record in the search has a sequence, or when the counts failed
  // to load - in the latter case the format stays enabled rather than being blocked on a bad count.
  if (availability === 'unknown' || availability === 'all') return null;

  const discarded = Math.max((totalRecords ?? 0) - (sequencedRecords ?? 0), 0);

  return (
    <Alert variant="info" className={`g-text-sm ${className}`}>
      <AlertTitle>
        {availability === 'none' ? (
          <FormattedMessage
            id="occurrenceDownloadFlow.sequences.noSequencesTitle"
            defaultMessage="No DNA sequences in this search"
          />
        ) : (
          <FormattedMessage
            id="occurrenceDownloadFlow.sequences.someSequencesTitle"
            defaultMessage="Only records with DNA sequences are included"
          />
        )}
      </AlertTitle>
      <AlertDescription>
        {availability === 'none' ? (
          <FormattedMessage
            id="occurrenceDownloadFlow.sequences.noSequencesDescription"
            defaultMessage="This format is only available for searches that contain DNA sequences. "
          />
        ) : (
          <FormattedMessage
            id="occurrenceDownloadFlow.sequences.someSequencesDescription"
            defaultMessage="{included} of the {total} records in your search have a DNA sequence. The remaining {discarded} records will not be part of the download."
            values={{
              included: (
                <strong>
                  <FormattedNumber value={sequencedRecords ?? 0} />
                </strong>
              ),
              total: <FormattedNumber value={totalRecords ?? 0} />,
              discarded: (
                <strong>
                  <FormattedNumber value={discarded} />
                </strong>
              ),
            }}
          />
        )}
      </AlertDescription>
    </Alert>
  );
}
