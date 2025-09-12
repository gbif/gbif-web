import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DynamicLink } from '@/reactRouterPlugins';
import { useUser } from '@/contexts/UserContext';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

type PageType = {
  type: 'occurrenceKey' | null;
  key: string | null;
  id: string | null;
};

interface GbifFeedbackProps {
  pageType: PageType | null;
  onClose: () => void;
}

type SubmissionState = 'IDLE' | 'SENDING' | 'SUCCESS' | 'FAILED';

export function GbifFeedback({ pageType, onClose }: GbifFeedbackProps) {
  const location = useLocation();
  const { user, isLoggedIn } = useUser();
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [mentionsCsv, setMentionsCsv] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('IDLE');
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    title: false,
    description: false,
  });
  const errors = {
    title: !titleValue && 'Required',
    description: !descriptionValue && 'Required',
  };
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Check for validation errors and mark fields as touched
      if (errors.title || errors.description) {
        setTouched({ title: true, description: true });
        return;
      }

      setSubmissionState('SENDING');

      const headers = {
        'Content-Type': 'application/json',
      };
      if (user?.graphqlToken) {
        Object.assign(headers, { Authorization: `Bearer ${user.graphqlToken}` });
      }

      fetch(`${import.meta.env.PUBLIC_FORMS_ENDPOINT}/feedback`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: titleValue,
          description: descriptionValue,
          location: location.pathname + location.search,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to send feedback');
          }
        })
        .then((data) => {
          setSubmissionState('SUCCESS');
          setReferenceId(data.referenceId || null);
          // Clear form
          setTitleValue('');
          setDescriptionValue('');
          setTouched({ title: false, description: false });
        })
        .catch(() => {
          setSubmissionState('FAILED');
        });
    },
    [
      user?.graphqlToken,
      titleValue,
      descriptionValue,
      pageType?.type,
      pageType?.key,
      errors.title,
      errors.description,
    ]
  );

  const resetForm = useCallback(() => {
    setSubmissionState('IDLE');
    setReferenceId(null);
  }, []);

  useEffect(() => {
    const csvRegex = /\bcsv\b/i;
    const concatenated = titleValue + ' ' + descriptionValue + '';
    const containsCsv = csvRegex.test(concatenated);
    if (containsCsv) {
      setMentionsCsv(true);
    } else {
      setMentionsCsv(false);
    }
  }, [descriptionValue, titleValue]);

  return (
    <div className="g-mt-4">
      {!isLoggedIn && (
        <div className="g-mt-4">
          <div className="g-text-sm g-text-slate-700 g-mb-4 g-bg-blue-50 g-p-4 g-rounded-lg g-border g-border-blue-200">
            <p className="g-mb-3">
              <FormattedMessage
                id="feedback.pleaseLogin"
                defaultMessage="Please login to leave feedback."
              />
            </p>
            <p className="g-text-xs g-text-slate-600">
              <FormattedMessage
                id="feedback.pleaseLoginReason"
                defaultMessage="Why? Unfortunately we are seeing lots of spam advertisement in our feedback system if we do not require users to login."
              />
            </p>
          </div>
          <div className="g-flex g-gap-2">
            <a
              href="https://github.com/gbif/portal-feedback/issues/new"
              className="g-inline-flex g-items-center g-px-3 g-py-2 g-text-sm g-font-medium g-text-gray-700 g-bg-white g-border g-border-gray-300 g-rounded-md g-shadow-sm hover:g-bg-gray-50"
            >
              <FormattedMessage
                id="feedback.leaveIssueOnGithub"
                defaultMessage="Leave issue on GitHub"
              />
            </a>
            <a
              href="mailto:helpdesk@gbif.org"
              className="g-inline-flex g-items-center g-px-3 g-py-2 g-text-sm g-font-medium g-text-gray-700 g-bg-white g-border g-border-gray-300 g-rounded-md g-shadow-sm hover:g-bg-gray-50"
            >
              <FormattedMessage id="feedback.emailHelpdesk" defaultMessage="Email Helpdesk" />
            </a>
          </div>
        </div>
      )}
      {isLoggedIn && submissionState === 'SUCCESS' && (
        <div className="g-mt-4">
          <div className="g-text-center g-mb-4">
            <div className="g-text-lg g-font-semibold g-text-green-700 g-mb-2">
              <FormattedMessage id="feedback.confirmation.title" defaultMessage="Thank you" />
            </div>
            <p className="g-text-sm g-text-slate-700 g-mb-4">
              <FormattedMessage
                id="feedback.confirmation.description"
                defaultMessage="Your feedback has been logged as an issue in Github. If necessary and if contact details were provided, we might reach out to you for further information."
              />
            </p>
            <div className="g-flex g-gap-2 g-justify-center">
              {referenceId && (
                <a
                  href={referenceId}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="g-inline-flex g-items-center g-px-3 g-py-2 g-text-sm g-font-medium g-text-white g-bg-blue-600 g-border g-border-blue-600 g-rounded-md g-shadow-sm hover:g-bg-blue-700"
                >
                  <FormattedMessage
                    id="feedback.confirmation.seeIssue"
                    defaultMessage="See issue"
                  />
                </a>
              )}
              <Button onClick={resetForm} variant="outline" className="g-text-sm">
                <FormattedMessage
                  id="feedback.confirmation.createAnother"
                  defaultMessage="Create another"
                />
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoggedIn && submissionState === 'FAILED' && (
        <div className="g-mt-4">
          <div className=" g-mb-4">
            <div className="g-text-lg g-font-semibold g-text-red-700 g-mb-2">
              <FormattedMessage id="feedback.failure.title" defaultMessage="Something went wrong" />
            </div>
            <div className="g-text-sm g-text-red-600 g-mb-4 g-bg-red-50 g-p-4 g-rounded-lg g-border g-border-red-200">
              <FormattedMessage
                id="feedback.failure.description"
                defaultMessage="This isn't good — the feedback system doesn't work. Please send us a mail or go straight to {githubLink}. We are sorry about the trouble."
                values={{
                  githubLink: (
                    <a
                      className="g-underline"
                      href="https://github.com/gbif/portal-feedback/issues/new"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Github
                    </a>
                  ),
                }}
              />
            </div>
            <div className="g-flex g-gap-2 g-justify-center">
              <a
                href="mailto:helpdesk@gbif.org"
                className="g-inline-flex g-items-center g-px-3 g-py-2 g-text-sm g-font-medium g-text-gray-700 g-bg-white g-border g-border-gray-300 g-rounded-md g-shadow-sm hover:g-bg-gray-50"
              >
                <FormattedMessage id="feedback.emailHelpdesk" defaultMessage="Email Helpdesk" />
              </a>
              <Button onClick={resetForm} variant="outline" className="g-text-sm">
                <FormattedMessage id="feedback.failure.tryAgain" defaultMessage="Try again" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoggedIn && (submissionState === 'IDLE' || submissionState === 'SENDING') && (
        <>
          <form>
            <div className="">
              <Label htmlFor="summary">
                <FormattedMessage id="feedback.summary" defaultMessage="Summary" />
              </Label>
              <Input
                required
                id="summary"
                className={`g-h-8 ${errors.title && touched.title ? 'g-border-red-500' : ''}`}
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={() => handleBlur('title')}
                disabled={submissionState === 'SENDING'}
              />
              {errors.title && touched.title && (
                <p className="g-mt-1 g-text-sm g-text-red-600">
                  <FormattedMessage id="feedback.required" defaultMessage="Required" />
                </p>
              )}
            </div>
            <div className="g-mt-4">
              <Label htmlFor="description">
                <FormattedMessage id="feedback.description" defaultMessage="Description" />
              </Label>
              <Textarea
                id="description"
                rows={5}
                className={errors.description && touched.description ? 'g-border-red-500' : ''}
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                onBlur={() => handleBlur('description')}
                disabled={submissionState === 'SENDING'}
              />
              {errors.description && touched.description && (
                <p className="g-mt-1 g-text-sm g-text-red-600">
                  <FormattedMessage id="feedback.required" defaultMessage="Required" />
                </p>
              )}
            </div>
            {mentionsCsv && (
              <div className="g-mt-2 g-text-xs g-text-slate-800 g-mb-4 g-bg-orange-200 g-p-2 g-rounded-lg">
                <FormattedMessage
                  id="feedback.csvWarning"
                  defaultMessage="It looks like your feedback mentions CSV files. Please see: {faqLink}"
                  values={{
                    faqLink: (
                      <DynamicLink
                        onClick={onClose}
                        className="g-underline"
                        pageId="faq"
                        searchParams={{ q: 'question:opening-gbif-csv-in-excel' }}
                      >
                        <FormattedMessage
                          id="feedback.csvFaqEntry"
                          defaultMessage="FAQ entry on CSV files"
                        />
                      </DynamicLink>
                    ),
                  }}
                />
              </div>
            )}
            <div className="g-mt-4">
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!titleValue || !descriptionValue || submissionState === 'SENDING'}
              >
                {submissionState === 'SENDING' ? (
                  <FormattedMessage id="feedback.sending" defaultMessage="Sending..." />
                ) : (
                  <FormattedMessage id="feedback.sendFeedback" defaultMessage="Send feedback" />
                )}
              </Button>
            </div>
          </form>

          <div className="g-text-xs g-mt-4 g-text-muted-foreground">
            <p className="g-mb-2">
              <FormattedMessage
                id="feedback.publicRepo"
                defaultMessage="Feedback will be sent to Github in a public repository. You can also send an email to the {helpdeskLink} for private enquiries."
                values={{
                  helpdeskLink: (
                    <a className="g-underline" href="mailto:helpdesk@gbif.org">
                      <FormattedMessage id="feedback.helpdesk" defaultMessage="GBIF helpdesk" />
                    </a>
                  ),
                  communicationLink: (
                    <a className="g-underline" href="mailto:communication@gbif.org">
                      <FormattedMessage
                        id="feedback.communications"
                        defaultMessage="GBIF communication"
                      />
                    </a>
                  ),
                  githubLink: (
                    <a
                      className="g-underline"
                      href="https://github.com/gbif/portal-feedback/issues"
                    >
                      Github
                    </a>
                  ),
                }}
              />
            </p>
            <FormattedMessage
              id="feedback.helpDeskOption"
              defaultMessage="Feedback will be sent to Github in a public repository. You can also send an email to the {helpdeskLink} for private enquiries."
              values={{
                helpdeskLink: (
                  <a className="g-underline" href="mailto:helpdesk@gbif.org">
                    <FormattedMessage id="feedback.helpdesk" defaultMessage="GBIF helpdesk" />
                  </a>
                ),
                communicationLink: (
                  <a className="g-underline" href="mailto:communication@gbif.org">
                    <FormattedMessage
                      id="feedback.communications"
                      defaultMessage="GBIF communication"
                    />
                  </a>
                ),
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
