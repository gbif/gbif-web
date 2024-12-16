import { Card } from '@/components/ui/smallCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpText } from '@/components/helpText';

export function AboutContent() {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is an occurrence?</AccordionTrigger>
          <AccordionContent className="g-prose g-text-sm">
            Data is loaded from contentful help items async. E.g.
            <HelpText
              identifier={'which-coordinate-systems-are-used-for-gbif-occurence-downloads'}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Other example entry</AccordionTrigger>
          <AccordionContent>Data is loaded from contentful help items async</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function ApiContent() {
  return (
    <div className="g-text-sm g-prose">
      <h3>API access</h3>
      <p>
        All data is available via the{' '}
        <a href="https://techdocs.gbif.org/en/openapi/v1/occurrence">GBIF API</a>. No registration
        or API key is required.
      </p>
      <p>
        Please remember to properly cite usage and to throttle requests in scripts. You need to{' '}
        <a href="https://techdocs.gbif.org/en/openapi/v1/occurrence#/Occurrence%20downloads/requestDownload">
          do a download
        </a>{' '}
        to get a citation string.
      </p>
      <h4>Examples</h4>
      <Card className="g-p-2 g-mb-2">
        Get all occurrences <br />
        <a href="https://api.gbif.org/v1/occurrence/search">
          https://api.gbif.org/v1/occurrence/search
        </a>
      </Card>
      <Card className="g-p-2">
        First 5 occurrences of taxon 9778871 (Flabellina McMurtrie, 1831) that have been recorded in
        May between year 2000-2024
        <br />
        <br />
        <a
          className="g-break-all"
          href="https://api.gbif.org/v1/occurrence/search?month=5&taxonKey=9778871&year=2000,2024&occurrenceStatus=present&limit=5&offset=0"
        >
          https://api.gbif.org/v1/occurrence/search?month=5&taxonKey=9778871&year=2000,2024&occurrenceStatus=present&limit=5&offset=0
        </a>
      </Card>
    </div>
  );
}
