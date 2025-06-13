import config from '#/config';
import { matchSorter } from 'match-sorter';
import { getParticipantByIso, Participant } from './participantSearch';

const translationEndpoint =
  config.translations || 'https://react-components.gbif.org/lib/translations';

type CountryMatch = {
  countryCode: string;
  participant?: Participant;
};

export default async function searchCountries(
  str: string,
  locale: string,
): Promise<CountryMatch | undefined> {
  const countryMatch = await getCountryMatch(str, locale);
  if (!countryMatch) {
    return undefined;
  }
  const participantMatch = await getParticipantByIso(countryMatch);
  return {
    countryCode: countryMatch,
    participant: participantMatch,
  };
}

export async function getCountryMatch(
  str: string,
  locale: string,
): Promise<string | undefined> {
  const countries = await getCountries(locale);
  if (!countries) {
    return undefined;
  }

  const q = str.trim().replace(/\s\s/g, ' ');
  const qNorm = normalizeString(q);
  const allSuggestions = countrySuggest(q, countries);

  // remove suggestions for key ZZ or ZX
  const suggestions = allSuggestions.filter(
    (s) => !['ZZ', 'XZ'].includes(s.key),
  );
  // if there is only one suggestion. And it matches with more than 5 letters and a full word, then we should use it
  if (suggestions.length > 0 && q.length >= 4) {
    // if full word in suggestions[0].title match the input string. Use a regex to match the full word
    const regex = new RegExp(`\\b${qNorm}\\b`, 'i');
    const match = regex.test(normalizeString(suggestions[0].title));
    if (match) {
      return suggestions[0].key;
    }
    if (q.length >= 6 && suggestions.length === 1) {
      return suggestions[0].key;
    }
  } else {
    // if perfect title or key match then accept it as well. no matter how long
    const perfectMatch = suggestions.find((s) => {
      if (normalizeString(s.title) === qNorm || s.key.toLowerCase() === qNorm) {
        return true;
      }
      return false;
    });
    if (perfectMatch) {
      return perfectMatch.key;
    }
  }
  return undefined;
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

function countrySuggest(
  q: string,
  countries: { key: string; title: string }[],
) {
  const filtered = matchSorter(countries, q ?? '', { keys: ['title', 'key'] });
  return filtered;
}
