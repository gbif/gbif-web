import { DynamicLink } from '@/components/dynamicLink';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { MdFeedback } from 'react-icons/md';

// a form to let the users send feedback {title, description} - the decription is a text area.
// inform the user that the feedback will be sent to Github in a public repository.
// And that the user alternatively can send an email to the GBIF helpdesk for private enquiries.
export function FeedbackPopover({ trigger = <MdFeedback /> }): React.ReactElement {
  // const { isTestEnvironment } = useConfig(); // we might wanna show a warning if it is a test environment
  const [open, setOpen] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [mentionsCsv, setMentionsCsv] = useState(false);

  useEffect(() => {
    const csvRegex = /\bcsv\b/i;
    const concatenated = titleValue + descriptionValue + '';
    const containsCsv = csvRegex.test(concatenated);
    if (containsCsv) {
      setMentionsCsv(true);
    } else {
      setMentionsCsv(false);
    }
  }, [descriptionValue, titleValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="g-w-96 g-shadow-2xl g-p-6">
        <div className="">
          <div className="g-space-y-2">
            <h4 className="g-font-medium g-leading-none">Questions and comments</h4>
            <p className="g-text-sm g-text-muted-foreground">
              See also the{' '}<DynamicLink className="g-underline" to="/faq" onClick={() => setOpen(false)}>FAQ</DynamicLink>
            </p>
          </div>
        </div>
        <div className="g-mt-4">
          <form>
            <div className="">
              <Label htmlFor="summary">Summary</Label>
              <Input required id="summary" className="g-h-8" value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)} />
            </div>
            <div className="g-mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={5} value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}/>
            </div>
            {mentionsCsv && (
              <div className="g-mt-2 g-text-xs g-text-slate-800 g-mb-4 g-bg-orange-200 g-p-2 g-rounded-lg">
                It looks like your feedback mentions CSV files. Please see:{' '}
                <DynamicLink className="g-underline" to="/faq">
                  FAQ entry on CSV files
                </DynamicLink>
              </div>
            )}
            <div className="g-mt-4">
              <Button>Send feedback</Button>
            </div>
          </form>
          <div className="g-text-xs g-mt-4 g-text-muted-foreground">
            Feedback will be sent to Github in a public repository. You can also send an email to
            the{' '}
            <a className="g-underline" href="mailto:helpdesk@gbif.org">
              GBIF helpdesk
            </a>{' '}
            for private enquiries.
          </div>
        </div>
        {/* <div className="g-max-w-96">
          <div className="g-bg-slate-200 g-font-semibold g-p-4 g-flex g-items-center">
            <div className="g-flex-auto">Feedback and questions</div>
            <Button className="g-flex-none g-bg-slate-50" variant="ghost" asChild>
              <DynamicLink to="/faq" onClick={() => setOpen(false)}>
                See FAQ
              </DynamicLink>
            </Button>
          </div>
          <div className="g-p-4">
            <form>
              <label htmlFor="title" className="g-text-sm  g-text-slate-500 g-block g-mb-1">
                Title
              </label>
              <Input
                placeholder="Summary"
                type="text"
                id="title"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                className="g-block g-w-full g-p-2 g-rounded-md g-border g-bg-white g-shadow-sm g-mb-4"
              />
              <label htmlFor="description" className="g-block g-text-slate-500  g-text-sm g-mb-1">
                Description
              </label>
              <Textarea
                placeholder="Please describe your feedback or question"
                id="description"
                onChange={(e) => setDescriptionValue(e.target.value)}
                rows={5}
                className="g-block g-w-full g-p-2 g-rounded-md g-border g-bg-white g-shadow-sm g-mb-4"
                value={descriptionValue}
              />
              {mentionsCsv && (
                <div className="g-text-xs g-text-slate-800 g-mb-4 g-bg-orange-200 g-p-2 g-rounded-lg">
                  It looks like your feedback mentions CSV files. Please see:{' '}
                  <DynamicLink className="g-underline" to="/faq">FAQ entry on CSV files</DynamicLink>
                </div>
              )}
              <div className="g-flex g-gap-2">
                <button
                  type="submit"
                  className="g-text-sm g-bg-primary-500 g-text-white g-p-2 g-rounded-md g-shadow-sm g-font-semibold"
                >
                  Send feedback
                </button>
              </div>
            </form>
            <div className="g-text-xs g-mt-4">
              Feedback will be sent to Github in a public repository. You can also send an email to
              the{' '}
              <a className="g-underline" href="mailto:helpdesk@gbif.org">
                GBIF helpdesk
              </a>{' '}
              for private enquiries.
            </div>
          </div>
        </div> */}
      </PopoverContent>
    </Popover>
  );
}
