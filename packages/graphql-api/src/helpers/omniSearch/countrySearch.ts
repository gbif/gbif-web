import { matchSorter } from 'match-sorter';
import config from '@/config';
import { getParticipantByIso, Participant } from './participantSearch';

const translationEndpoint = config.translations || 'https://react-components.gbif.org/lib/translations';

// a query like "island" or "republic" is a full word in many country names. Cap how many we show
const MAX_MATCHES = 5;

type CountryMatch = {
  countryCode: string;
  participant?: Participant;
};

export default async function searchCountries(str: string, locale: string): Promise<CountryMatch[]> {
  const countryCodes = await getCountryMatches(str, locale);
  return Promise.all(
    countryCodes.map(async (countryCode) => ({
      countryCode,
      participant: await getParticipantByIso(countryCode),
    })),
  );
}

export async function getCountryMatches(str: string, locale: string): Promise<string[]> {
  const countries = await getCountries(locale);
  if (!countries) {
    return [];
  }

  const q = str.trim().replace(/\s\s/g, ' ');
  const qNorm = normalizeString(q);
  if (qNorm === '') {
    return [];
  }
  const allSuggestions = countrySuggest(q, countries);

  // remove suggestions for key ZZ or ZX
  const suggestions = allSuggestions.filter((s) => !['ZZ', 'XZ'].includes(s.key));

  // a perfect title or key match is always accepted. no matter how short the query is
  const perfectMatches = suggestions.filter((s) => normalizeString(s.title) === qNorm || s.key.toLowerCase() === qNorm);

  // short queries are too ambiguous to guess at. Only accept the perfect matches
  if (q.length < 4) {
    return perfectMatches.map((s) => s.key);
  }

  // any country where the query is a full word in the name. E.g. "korea" matches both KP and KR
  const wordMatches = suggestions.filter((s) => hasWordMatch(normalizeString(s.title), qNorm));

  // keep the order from matchSorter, but list the perfect matches first
  const matches = [...perfectMatches, ...wordMatches.filter((s) => !perfectMatches.includes(s))];

  // a long query with a single fuzzy suggestion is most likely a misspelling of that country
  if (matches.length === 0 && q.length >= 6 && suggestions.length === 1) {
    return [suggestions[0].key];
  }

  return matches.slice(0, MAX_MATCHES).map((s) => s.key);
}

// does the query appear as a whole word in the title. E.g. "guinea" is a word in "Papua New Guinea",
// but "new" is not a word in "Newfoundland". Written without a RegExp as the query is user provided
// and would have to be escaped, and \b only considers latin characters word characters.
function hasWordMatch(title: string, query: string) {
  let index = title.indexOf(query);
  while (index !== -1) {
    const isWordStart = index === 0 || !isWordCharacter(title[index - 1]);
    const end = index + query.length;
    const isWordEnd = end === title.length || !isWordCharacter(title[end]);
    if (isWordStart && isWordEnd) {
      return true;
    }
    index = title.indexOf(query, index + 1);
  }
  return false;
}

function isWordCharacter(char: string) {
  return /[\p{L}\p{N}]/u.test(char);
}

// get translation for a given language code
const cache: { [locale: string]: { key: string; title: string }[] } = {};
async function getCountries(locale: string) {
  if (cache[locale]) {
    return cache[locale];
  }
  const apiUrl = `${translationEndpoint}/${locale}.json`;
  try {
    const data = await fetch(apiUrl).then((res) => res.json());
    // only keys of type enums.countryCode.XX are country names. And we want them as a list with {key: 'XX', value: 'Country name'}
    const countryNames = Object.keys(data)
      .filter((key) => key.startsWith('enums.countryCode.'))
      .map((key) => {
        return {
          key: key.replace('enums.countryCode.', ''),
          title: data[key] as string,
        };
      });
    cache[locale] = countryNames;
    return countryNames;
  } catch (error) {
    return null;
  }
}

function removeDiacrits(str: string) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function normalizeString(str: string) {
  return removeDiacrits(str.toLowerCase().trim());
}

function countrySuggest(q: string, countries: { key: string; title: string }[]) {
  const filtered = matchSorter(countries, q ?? '', { keys: ['title', 'key'] });
  return filtered;
}
