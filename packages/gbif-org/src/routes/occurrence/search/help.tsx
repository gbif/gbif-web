import { HelpText, HelpTextSkeleton, useHelp } from '@/components/helpText';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/smallCard';
import { PiGitBranchBold as TaxonomyIcon } from 'react-icons/pi';
import { FormattedMessage } from 'react-intl';

export function AboutContent() {
  const { title, body, error, loading } = useHelp('what-is-an-occurrence');
  const {
    title: titleTaxonomy,
    body: bodyTaxonomy,
    error: errorTaxonomy,
    loading: loadingTaxonomy,
  } = useHelp('taxonomy-and-occurrence-search');
  const {
    title: titleSearch,
    body: bodySearch,
    error: errorSearch,
    loading: loadingSearch,
  } = useHelp('how-to-search-occurrences');
  if (loading || loadingSearch) return <HelpTextSkeleton includeTitle />;

  return (
    <div>
      <Accordion type="single" collapsible className="w-full ">
        <AccordionItem value="item-1">
          <AccordionTrigger>{title}</AccordionTrigger>
          <AccordionContent className="g-prose g-text-sm">
            {body && <div dangerouslySetInnerHTML={{ __html: body }} />}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>{titleSearch}</AccordionTrigger>
          <AccordionContent className="g-prose g-text-sm">
            {bodySearch && <div dangerouslySetInnerHTML={{ __html: bodySearch }} />}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div>
              {titleTaxonomy} <TaxonomyIcon className="g-text-base" />
            </div>
          </AccordionTrigger>
          <AccordionContent className="g-prose g-text-sm">
            {bodyTaxonomy && <div dangerouslySetInnerHTML={{ __html: bodyTaxonomy }} />}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function ApiContent() {
  return (
    <div className="g-text-sm g-prose">
      <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
        <HelpText identifier={'api-access'} includeTitle />
      </div>
      <h4>
        <FormattedMessage id="apiHelp.examples" />
      </h4>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.searchOccurrences" /> <br />
        <a href="https://api.gbif.org/v1/occurrence/search">
          https://api.gbif.org/v1/occurrence/search
        </a>
      </Card>
      <Card className="g-p-2">
        <FormattedMessage id="apiHelp.searchOccurrencesExample" /> <br />
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
