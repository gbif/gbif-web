import type { TermInfo } from '../../data/types';

// percentage is count / lines, so it sorts by the count
export type TermSortKey = 'term' | 'count' | 'percentage' | 'interpreted';
export type TermSort = { key: TermSortKey; direction: 'asc' | 'desc' } | undefined;

// "http://rs.tdwg.org/dwc/terms/scientificName" sorts as "scientificName"
export function termLocalName(term: string) {
  return term.split(/[/#]/).pop() || term;
}

function numberFor(term: TermInfo, key: TermSortKey) {
  const value = key === 'interpreted' ? term.interpretedIndexed : term.rawIndexed;
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

// Missing values go last in both directions; ties keep the order the API sent.
export function sortTerms(terms: TermInfo[], sort: TermSort, collator: Intl.Collator): TermInfo[] {
  if (!sort) return terms;
  const sign = sort.direction === 'asc' ? 1 : -1;
  return terms
    .map((term, index) => ({ term, index }))
    .sort((a, b) => {
      if (sort.key === 'term') {
        const nameA = a.term.term ?? '';
        const nameB = b.term.term ?? '';
        const compared =
          collator.compare(termLocalName(nameA), termLocalName(nameB)) ||
          collator.compare(nameA, nameB);
        return sign * compared || a.index - b.index;
      }
      const valueA = numberFor(a.term, sort.key);
      const valueB = numberFor(b.term, sort.key);
      if (valueA === undefined || valueB === undefined) {
        if (valueA === valueB) return a.index - b.index;
        return valueA === undefined ? 1 : -1;
      }
      return sign * (valueA - valueB) || a.index - b.index;
    })
    .map(({ term }) => term);
}

// Names start A–Z and numbers start highest first; the third click returns to the API's order.
export function nextTermSort(current: TermSort, key: TermSortKey): TermSort {
  const first = key === 'term' ? 'asc' : 'desc';
  if (!current || current.key !== key) return { key, direction: first };
  if (current.direction === first) return { key, direction: first === 'asc' ? 'desc' : 'asc' };
  return undefined;
}
