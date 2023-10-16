import { jsx } from '@emotion/react';
import React from 'react';
// import Autolinker from 'autolinker';
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import doiRegex from 'doi-regex';
import { Doi } from '../IdentifierBadge';
import Orcid from '../Orcid/Orcid';
import Lsid from '../Lsid/Lsid';
import BooleanValue from '../BooleanValue/BooleanValue'
import { content } from './styles'
import { Unknown } from '../Message/Message';

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: false
});
// md.linkify.tlds(['org', 'com'], false);
md.linkify.set({ fuzzyLink: false });

const getLsid = (text) => {
  if (typeof text !== "string" || /\s/.test(text.trim())) {
    return null
  } else {
    const trimmed = text.trim();
    if (trimmed.startsWith('urn:lsid:')) {
      return trimmed;
    } else {
      return null
    }
  }
}

const getOrcid = (text) => {
  if (typeof text !== "string" || /\s/.test(text.trim())) {
    return null
  } else {
    const trimmed = text.trim();
    if (trimmed.startsWith('orcid.org/')) {
      return 'https://' + trimmed;
    } else if (trimmed.startsWith('https://orcid.org/') || trimmed.startsWith('http://orcid.org/')) {
      return trimmed;
    } else {
      return null
    }
  }
}

const getDoi = (text) => {
  if (typeof text !== "string" || /\s/.test(text.trim())) {
    return null
  } else {
    const doi = text.trim().match(doiRegex())?.[0];
    if (doi) {
      return 'https://doi.org/' + doi;
    } else {
      return null;
    }
  }
}

export const HyperText = ({ text, inline, sanitizeOptions = { ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br'] }, fallback, ...props }) => {
  if (text === false || text === true) {
    return <BooleanValue value={text} {...props} />
  }
  if (typeof text === "undefined") {
    if (fallback) {
      return <Unknown id={fallback ?? 'phrases.notProvided'} />
    }
    return null;
  }
  if (text === '' && fallback) {
    return <Unknown id={typeof fallback === 'String' ? fallback : 'phrases.notProvided'} />
  }
  if (typeof text !== "string") {
    return <span {...props}>{text}</span>;
  }

  const doi = getDoi(text);
  if (doi) {
    return <Doi id={doi} {...props} />
  }
  const orcid = getOrcid(text);
  if (orcid) {
    return <Orcid href={orcid} {...props} />
  }
  const lsid = getLsid(text);
  if (lsid) {
    return <Lsid identifier={lsid} {...props} />
  }

  let html = text;

  html = inline ? md.renderInline(html) : md.render(html);
  const sanitized = DOMPurify.sanitize(html, sanitizeOptions);

  return <div css={content({ inline })} dangerouslySetInnerHTML={{ __html: sanitized }} {...props}></div>
}

HyperText.content = content;