import { HyperText } from '@/components/hyperText';
import TestSiteAlert from '@/components/TestSiteAlert';
import { Button } from '@/components/ui/button';
import { MdDownload } from 'react-icons/md';
const testSite = import.meta.env.PUBLIC_TEST_SITE === 'true';

type Props = {
  text: string;
  doi?: string | null;
};

export function Citation({ text, doi }: Props) {
  return (
    <div>
      <TestSiteAlert className="g-mb-4" />
      <div className={testSite ? 'g-select-none g-pointer-events-none' : ''}>
        <HyperText className="g-prose" text={text} />
      </div>
      {doi && (
        <div style={{ marginTop: '1em' }}>
          <Button asChild variant="outline" disabled={testSite}>
            <a
              href={
                testSite
                  ? undefined
                  : `https://data.crosscite.org/application/x-research-info-systems/${doi}`
              }
              className="g-me-1 g-text-inherit"
            >
              RIS
              <MdDownload className="g-ms-1" />
            </a>
          </Button>
          <Button asChild variant="outline" disabled={testSite}>
            <a
              className="g-text-inherit"
              href={testSite ? undefined : `https://data.crosscite.org/application/x-bibtex/${doi}`}
            >
              BibTex
              <MdDownload className="g-ms-1" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
