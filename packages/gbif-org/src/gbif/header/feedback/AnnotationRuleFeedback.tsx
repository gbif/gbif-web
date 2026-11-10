import { FormattedMessage } from 'react-intl';
import { MdOpenInNew } from 'react-icons/md';

export function getAnnotationRuleUrl(taxonKey: string): string | null {
  const toolUrl = import.meta.env.PUBLIC_ANNOTATIONS_TOOL_URL;
  if (!toolUrl) return null;
  return `${toolUrl}/#/?taxonKey=${encodeURIComponent(taxonKey)}`;
}

export function AnnotationRuleFeedback({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="g-block g-w-full g-p-4 g-text-start g-border g-rounded-lg g-bg-gray-50 hover:g-bg-gray-100 g-transition-colors"
    >
      <h4 className="g-font-medium g-mb-1">
        <FormattedMessage
          id="feedback.annotationRule"
          defaultMessage="Flag suspicious records"
        />
        <MdOpenInNew className="g-ms-2 g-h-4 g-w-4" />
      </h4>
      <p className="g-text-sm g-text-muted-foreground">
        <FormattedMessage
          id="feedback.annotationRuleDescription"
          defaultMessage="Create a rule that would flag suspicious records or areas (experimental)"
        />
      </p>
    </a>
  );
}
