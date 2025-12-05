import { HyperText } from '@/components/hyperText';
import { Button } from '@/components/ui/button';
import { DatasetQuery } from '@/gql/graphql';
import { MdDownload } from 'react-icons/md';

export function Citation({
  data = {},
  loading,
  error,
  ...props
}: {
  data: DatasetQuery;
  loading?: boolean;
  error?: Error;
}) {
  const { dataset } = data;
  const doi = dataset?.doi;
  return dataset?.citation?.text ? (
    <div>
      <HyperText className="g-prose" text={dataset.citation.text} />
      {doi && (
        <div style={{ marginTop: '1em' }}>
          <Button asChild variant="outline">
            <a
              href={`https://data.crosscite.org/application/x-research-info-systems/${doi}`}
              className="g-me-1 g-text-inherit"
            >
              RIS
              <MdDownload className="g-ms-1" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              className="g-text-inherit"
              href={`https://data.crosscite.org/application/x-bibtex/${doi}`}
            >
              BibTex
              <MdDownload className="g-ms-1" />
            </a>
          </Button>
        </div>
      )}
    </div>
  ) : null;
}
