import { normalizeString } from '@/utils/normalizeString';

// split on anything that isn't a letter or a number, so that "Basis of record"
// becomes ['basis', 'of', 'record'] and "record type, evidence" becomes
// ['record', 'type', 'evidence']
const NON_WORD = /[^\p{L}\p{N}]+/u;

const EXACT_WORD_SCORE = 1;
const PREFIX_SCORE = 0.8;
const JOINED_WORDS_SCORE = 0.6;
// small penalty per word position so that a hit in the filter name (which comes
// first in the search value) ranks above a hit in an alias or the group name
const POSITION_PENALTY = 0.01;
const MAX_PENALIZED_POSITION = 20;

function scoreToken(words: string[], token: string): number {
  let best = 0;
  for (let i = 0; i < words.length; i++) {
    const positionPenalty = Math.min(i, MAX_PENALIZED_POSITION) * POSITION_PENALTY;
    let score = 0;
    if (words[i] === token) {
      score = EXACT_WORD_SCORE - positionPenalty;
    } else if (words[i].startsWith(token)) {
      score = PREFIX_SCORE - positionPenalty;
    } else if (
      // the user left out the spaces, e.g. "basisofrecord" or "redlist"
      token.length > words[i].length &&
      words.slice(i).join('').startsWith(token)
    ) {
      score = JOINED_WORDS_SCORE - positionPenalty;
    }
    if (score > best) best = score;
  }
  return best;
}

/**
 * Score a command item for cmdk. Matching is done word by word instead of as a
 * plain substring, so searching for "id" no longer matches "evidence".
 * Every word in the search has to be the start of a word in the item, e.g.
 * "rec typ" matches "record type", but "cord" matches nothing.
 */
export function filterSearchScore(value: string, search: string): number {
  const tokens = normalizeString(search).split(NON_WORD).filter(Boolean);
  if (tokens.length === 0) return 1;

  const words = normalizeString(value).split(NON_WORD).filter(Boolean);

  let total = 0;
  for (const token of tokens) {
    const score = scoreToken(words, token);
    // all words in the search must match, else the item is filtered out
    if (score === 0) return 0;
    total += score;
  }
  return total / tokens.length;
}

/**
 * The text cmdk matches a filter against: the name the user sees, plus any
 * aliases (synonyms) and optionally the group it belongs to.
 */
export function getFilterSearchValue({
  translatedFilterName,
  aliases,
  group,
}: {
  translatedFilterName: string;
  aliases?: string;
  group?: string;
}): string {
  return [translatedFilterName, aliases, group].filter(Boolean).join(' ');
}
