import { HelpText, HelpTextSkeleton, useHelp } from '@/components/helpText';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/smallCard';
import { FormattedMessage } from 'react-intl';

export function AboutContent() {
  const { title, body, error, loading } = useHelp('what-is-gbif-literature');
  const {
    title: titleSearch,
    body: bodySearch,
    error: errorSearch,
    loading: loadingSearch,
  } = useHelp('how-to-use-literature-search');
  if (loading || loadingSearch) return <HelpTextSkeleton includeTitle />;

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>{title}</AccordionTrigger>
          <AccordionContent className="g-prose g-text-sm">
            {body && <div dangerouslySetInnerHTML={{ __html: body }} />}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>{titleSearch}</AccordionTrigger>
          <AccordionContent>
            {bodySearch && <div dangerouslySetInnerHTML={{ __html: bodySearch }} />}
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
        <FormattedMessage id="apiHelp.searchCollections" /> <br />
        <a href="https://api.gbif.org/v1/literature">https://api.gbif.org/v1/literature</a>
      </Card>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.searchExample" /> <br />
        <a href={`https://api.gbif.org/v1/literature/search?q=dna&offset=0&limit=2`}>
          https://api.gbif.org/v1/literature/search?q=dna&offset=0&limit=2
        </a>
      </Card>
    </div>
  );
}
