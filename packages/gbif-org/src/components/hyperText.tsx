import doiRegex from 'doi-regex';
import pkg from 'isomorphic-dompurify';
import { marked } from 'marked'; // https://marked.js.org
import { FormattedMessage, FormattedNumber } from 'react-intl';
import EmptyValue from './emptyValue';
import { DoiTag, Lsid, OrcId } from './identifierTag';
const { sanitize } = pkg;

const getLsid = (text: any) => {
  if (typeof text !== 'string' || /\s/.test(text.trim())) {
    return null;
  } else {
    const trimmed = text.trim();
    if (trimmed.startsWith('urn:lsid:')) {
      return trimmed;
    } else {
      return null;
    }
  }
};

const getOrcid = (text: any) => {
  if (typeof text !== 'string' || /\s/.test(text.trim())) {
    return null;
  } else {
    const trimmed = text.trim();
    if (trimmed.startsWith('orcid.org/')) {
      return 'https://' + trimmed;
    } else if (
      trimmed.startsWith('https://orcid.org/') ||
      trimmed.startsWith('http://orcid.org/')
    ) {
      return trimmed;
    } else {
      return null;
    }
  }
};

const getDoi = (text: any) => {
  if (typeof text !== 'string' || /\s/.test(text.trim())) {
    return null;
  } else {
    const doi = text.trim().match(doiRegex())?.[0];
    if (doi) {
      return 'https://doi.org/' + doi;
    } else {
      return null;
    }
  }
};

export const HyperText = ({
  text,
  sanitizeOptions = { ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br', 'code', 'pre'] },
  fallback,
  className,
  ...props
}: {
  text: string | boolean | undefined | null | React.ReactNode;
  sanitizeOptions?: any; // DOMPurify.Config,
  fallback?: string | boolean;
  [key: string]: any;
}) => {
  if (text === false || text === true) {
    return <BooleanValue value={text} {...props} />;
  }
  if (typeof text === 'undefined' || text === '' || text === null) {
    if (fallback) {
      return <EmptyValue id={typeof fallback === 'string' ? fallback : 'phrases.notProvided'} />;
    }
    return null;
  }

  if (typeof text !== 'string') {
    return <span {...props}>{text}</span>;
  }

  if (typeof text == 'number') {
    return <FormattedNumber value={text} />;
  }

  const doi = getDoi(text);
  if (doi) {
    return <DoiTag id={doi} {...props} />;
  }
  const orcid = getOrcid(text);
  if (orcid) {
    return <OrcId href={orcid} {...props} />;
  }
  const lsid = getLsid(text);
  if (lsid) {
    return <Lsid identifier={lsid} {...props} />;
  }

  const trimmedContent = text.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '');

  try {
    const html = marked.parse(trimmedContent) as string;
    const sanitizedHtml = sanitize(html, sanitizeOptions);

    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        {...props}
      ></div>
    );
  } catch (e) {
    console.error(e);
    return text;
  }
};

export const BooleanValue = ({ value }: { value: any }) =>
  value === false || value === true ? (
    value ? (
      <FormattedMessage id="phrases.yes" />
    ) : (
      <FormattedMessage id="phrases.no" />
    )
  ) : null;
