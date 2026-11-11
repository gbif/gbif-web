// EML text fields are plain text or HTML, never Markdown: parsed as Markdown, the indentation an
// IPT leaves in <abstract> turns the whole text into a one-line code block.

const MARKUP = /<\/?[a-z][a-z0-9]*(\s[^>]*)?\/?>/i;
const URL_PATTERN = /\bhttps?:\/\/[^\s<>"]+/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]}'"]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function linkify(line: string) {
  let html = '';
  let last = 0;
  for (const match of line.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0;
    const url = match[0].replace(TRAILING_PUNCTUATION, '');
    html += escapeHtml(line.slice(last, start));
    html += `<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`;
    last = start + url.length;
  }
  return html + escapeHtml(line.slice(last));
}

export function emlTextToHtml(text: string | undefined): string | undefined {
  const trimmed = text?.trim();
  if (!trimmed) return undefined;
  if (MARKUP.test(trimmed)) return trimmed;

  const paragraphs = trimmed
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .split('\n')
        .map((line) => line.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .map(linkify)
        .join('<br>')
    )
    .filter(Boolean);
  return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');
}
