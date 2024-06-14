import { HyperText } from '@/components/hyperText';
import { Button } from '@/components/ui/button';

export function Citation({ data = {}, loading, error, ...props }) {
  const { dataset } = data;
  const doi = dataset.doi;
  return dataset?.citation?.text ? (
    <div>
      <HyperText className="g-prose" text={dataset.citation.text} />
      {doi && (
        <div style={{ marginTop: '1em' }}>
          <Button asChild variant="outline">
            <a
              href={`https://data.crosscite.org/application/x-research-info-systems/${doi}`}
              className="g-me-1"
            >
              RIS
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={`https://data.crosscite.org/application/x-bibtex/${doi}`}>BibTex</a>
          </Button>
        </div>
      )}
    </div>
  ) : null;
}
