import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { FeedbackQuery, FeedbackQueryVariables } from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import useQuery from '@/hooks/useQuery';
import { DynamicLink, useI18n } from '@/reactRouterPlugins';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useEffect, useState } from 'react';
import { MdFeedback, MdArrowBack } from 'react-icons/md';
import { useMatches } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { DataProviderFeedback } from './DataProviderFeedback';
import { GbifFeedback } from './GbifFeedback';
import { GithubFeedback, MailFeedback } from './GithubFeedback';
import { useConfig } from '@/config/config';
import { cn } from '@/utils/shadcn';
import TestSiteAlert from '@/components/TestSiteAlert';

type PageType = {
  type: 'occurrenceKey' | null;
  key: string | null;
  id: string | null;
};

type FeedbackOption = 'gbif' | null;

function getPageType(matches: ReturnType<typeof useMatches>): PageType {
  const page = matches.find((match) => match.id.startsWith('occurrenceKey-'));
  if (!page) {
    return { type: null, key: null, id: null };
  }
  const key = page?.params?.key ?? null;
  return { type: 'occurrenceKey', key, id: `pageType:occurrenceKey key:${key}` };
}

type FeedbackPopoverProps = {
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function FeedbackPopover({
  trigger = <MdFeedback />,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: FeedbackPopoverProps): React.ReactElement {
  const config = useConfig();
  const { locale } = useI18n();
  const isMobileBreakpoint = useBelow(640);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;
  // Render as sheet on mobile breakpoint OR when opened externally (e.g. from the mobile sidebar)
  const isMobile = isMobileBreakpoint || controlledOpen !== undefined;
  const { feedback } = useConfig();
  const [selectedOption, setSelectedOption] = useState<FeedbackOption>('gbif'); //null
  const matches = useMatches();
  const [pageType, setPageType] = useState<PageType | null>(null);
  const {
    data: feedbackData,
    loading,
    error,
    load,
  } = useQuery<FeedbackQuery, FeedbackQueryVariables>(FEEDBACK_QUERY, {
    lazyLoad: true,
  });

  useEffect(() => {
    if (open && pageType?.id) {
      load({ variables: { pageType: pageType.type, key: pageType.key } });
    }
  }, [pageType?.id, load, open]);

  useEffect(() => {
    // check if any of the matches has an id that matches "occurrenceKey"
    const newPageType = getPageType(matches);
    if (newPageType?.id !== pageType?.id) {
      setPageType(newPageType);
    }
  }, [matches, pageType?.id]);

  // Reset state when popover closes
  useEffect(() => {
    if (!open) {
      setSelectedOption(null);
    }
  }, [open]);

  if (!feedback?.enabled) {
    return <></>;
  }

  const data = pageType?.id ? feedbackData : null;

  const hasDataProviderOptions =
    data?.feedbackOptions &&
    (data.feedbackOptions.contactEmail || data.feedbackOptions.externalServiceUrl);

  const handleClose = () => {
    setOpen(false);
  };

  const handleBack = () => {
    setSelectedOption(null);
  };

  const getTitle = () => {
    if (selectedOption === 'gbif') {
      return <FormattedMessage id="feedback.contactGbif" defaultMessage="Contact GBIF" />;
    }
    return <FormattedMessage id="feedback.title" defaultMessage="Questions and comments" />;
  };

  const getDescription = () => {
    if (selectedOption === 'gbif') {
      return (
        <FormattedMessage
          id="feedback.seeAlsoFaq"
          defaultMessage="See also the {faqLink}"
          values={{
            faqLink: (
              <DynamicLink className="g-underline" to="/faq" onClick={() => setOpen(false)}>
                <FormattedMessage id="feedback.faq" defaultMessage="FAQ" />
              </DynamicLink>
            ),
          }}
        />
      );
    }
    return null;
  };

  const renderContent = () => {
    // Show loading state
    if (loading) {
      return (
        <Skeleton className="g-mt-4 g-w-full g-p-4 g-h-24 g-text-start g-border g-rounded-lg">
          Loading
        </Skeleton>
      );
    }

    if (selectedOption === 'gbif') {
      if (feedback?.gbifFeedback !== false) {
        return <GbifFeedback pageType={pageType} onClose={handleClose} />;
      }
    }

    // Handle main content based on data provider options availability
    const shouldShowOptions = !error && hasDataProviderOptions && !selectedOption;

    if (shouldShowOptions) {
      return renderOptionSelection();
    }

    // Default to GBIF feedback (covers error cases and no data provider options)
    if (feedback?.gbifFeedback) {
      return <GbifFeedback pageType={pageType} onClose={handleClose} />;
    } else {
      return (
        <div className="g-space-y-3">
          <GithubFeedback onClose={handleClose} />
          <MailFeedback onClose={handleClose} />
        </div>
      );
    }
  };

  const renderOptionSelection = () => {
    const feedbackOptions = data?.feedbackOptions;
    return (
      <div className="g-space-y-4 g-mt-4">
        <div className="g-space-y-3">
          {feedback.gbifFeedback && (
            <button
              onClick={() => setSelectedOption('gbif')}
              className="g-w-full g-p-4 g-text-start g-border g-rounded-lg g-bg-gray-50 hover:g-bg-gray-100 g-transition-colors"
            >
              <h4 className="g-font-medium g-mb-1">
                <FormattedMessage id="feedback.contactGbif" defaultMessage="Contact GBIF" />
              </h4>
              <p className="g-text-sm g-text-muted-foreground">
                <FormattedMessage
                  id="feedback.contactUsDescription"
                  defaultMessage="For website issues, data processing problems, or general GBIF questions"
                />
              </p>
            </button>
          )}
          <DataProviderFeedback feedbackOptions={feedbackOptions!} />
          {!feedback?.gbifFeedback && (
            <>
              <GithubFeedback onClose={handleClose} />
              <MailFeedback onClose={handleClose} />
            </>
          )}
        </div>
      </div>
    );
  };

  const body = (
    <>
      <div className={cn('g-space-y-2', isMobile && 'g-pe-12')}>
        <div className="g-flex g-items-center g-gap-2">
          {selectedOption && (
            <button
              onClick={handleBack}
              className="g-pe-1 hover:g-bg-gray-100 g-rounded g-flex g-items-center g-justify-center"
            >
              <MdArrowBack className="g-w-4 g-h-4" />
            </button>
          )}
          <h4 className={`g-font-medium g-leading-none ${config.testSite ? 'test-box' : ''}`}>
            {getTitle()}
          </h4>
        </div>
        <p className="g-text-sm g-text-muted-foreground">{getDescription()}</p>
      </div>

      {renderContent()}
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {trigger && controlledOpen === undefined && (
          <SheetTrigger asChild>{trigger}</SheetTrigger>
        )}
        <SheetContent
          side={locale.textDirection === 'rtl' ? 'left' : 'right'}
          className={cn(
            'g-w-full sm:g-max-w-full g-h-full g-overflow-y-auto g-p-4',
            config.testSite && 'gbif-test-background'
          )}
          dir={locale.textDirection || 'ltr'}
        >
          <VisuallyHidden asChild>
            <SheetTitle>{getTitle()}</SheetTitle>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <SheetDescription>
              <FormattedMessage id="feedback.title" defaultMessage="Questions and comments" />
            </SheetDescription>
          </VisuallyHidden>
          {body}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {trigger && <PopoverTrigger asChild>{trigger}</PopoverTrigger>}
      <PopoverContent
        className={`g-w-96 g-shadow-2xl g-p-6 ${config.testSite ? 'gbif-test-background' : ''}`}
      >
        {body}
      </PopoverContent>
    </Popover>
  );
}

const FEEDBACK_QUERY = /* GraphQL */ `
  query Feedback($pageType: String!, $key: ID!) {
    feedbackOptions(pageType: $pageType, key: $key) {
      contactEmail
      contactName
      externalServiceName
      externalServiceUrl
    }
  }
`;
