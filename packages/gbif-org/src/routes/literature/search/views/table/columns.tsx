import { BulletList } from '@/components/bulletList';
import { DoiTag } from '@/components/identifierTag';
import { ColumnDef } from '@/components/searchTable';
import { SetAsFilter } from '@/components/searchTable/components/body/setAsFilter';
import { SetAsFilterList } from '@/components/searchTable/components/body/setAsFilterList';
import { notNull } from '@/utils/notNull';
import { truncate } from '@/utils/truncate';
import { useState } from 'react';
import { MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { SingleLiteratureSearchResult } from '.';

function getLink(item: SingleLiteratureSearchResult) {
  if (item.identifiers?.doi) {
    return `https://doi.org/${item.identifiers.doi}`;
  }
  return item.websites?.[0];
}

export const columns: ColumnDef<SingleLiteratureSearchResult>[] = [
  {
    id: 'title',
    header: 'tableHeaders.title',
    disableHiding: true,
    minWidth: 350,
    cell: (literature) => {
      const link = getLink(literature);
      return (
        <div>
          {link == null ? (
            truncate(literature.title, 200)
          ) : (
            <a href={link} className="g-pointer-events-auto g-underline">
              {truncate(literature.title, 200)} <MdLink />
            </a>
          )}
        </div>
      );
    },
  },
  // {
  //   id: 'altmetric',
  //   header: 'tableHeaders.altmetric',
  //   cell: (item) => {
  //     if (!item.identifiers?.doi) return null;

  //     return <AltmetricDonut doi={item.identifiers?.doi} className="g-pointer-events-auto" />;
  //   },
  // },
  {
    id: 'author',
    header: 'tableHeaders.author',
    cell: (item) => {
      if (!item.authors) return '';

      const authorsCap = 1;
      const displayAuthors = item.authors.filter((x) => x).slice(0, authorsCap);
      const authorStrings = displayAuthors.map(
        (author) => `${author?.lastName}, ${author?.firstName?.[0] || ''}.`
      );

      let authorsText = authorStrings.join(' ');
      if (item.authors.length > authorsCap) {
        authorsText += ' et al.';
      }

      return authorsText;
    },
  },
  {
    id: 'year',
    header: 'filters.year.name',
    cell: ({ year }) => {
      if (!year) return null;

      return (
        <SetAsFilter field="year" value={year}>
          {year}
        </SetAsFilter>
      );
    },
  },
  {
    id: 'source',
    header: 'tableHeaders.source',
    minWidth: 200,
    cell: (item) => {
      if (!item.source) return null;

      return (
        <SetAsFilter field="source" value={item.source}>
          {item.source}
        </SetAsFilter>
      );
    },
  },
  {
    id: 'dataReferenced',
    header: 'tableHeaders.dataReferenced',
    cell: (item) => {
      if (!item.gbifDOIs || item.gbifDOIs.length === 0) return null;

      return <Dois gbifDOIs={item?.gbifDOIs} />;
    },
  },
  {
    id: 'literatureType',
    header: 'filters.literatureType.name',
    cell: ({ literatureType }) => {
      if (!literatureType) return null;

      return (
        <SetAsFilter field="literatureType" value={literatureType}>
          <FormattedMessage id={`enums.literatureType.${literatureType}`} />
        </SetAsFilter>
      );
    },
  },
  {
    id: 'relevance',
    header: 'filters.relevance.name',
    cell: (item) => {
      const relevance = item.relevance?.filter(notNull);
      if (!relevance) return null;

      return (
        <SetAsFilterList
          field="relevance"
          items={relevance}
          renderValue={(value) => <FormattedMessage id={`enums.relevance.${value}`} />}
        />
      );
    },
  },
  {
    id: 'topics',
    header: 'filters.topics.name',
    cell: (item) => {
      const topics = item.topics?.filter(notNull);
      if (!topics) return null;

      return (
        <SetAsFilterList
          items={topics}
          field="topics"
          renderValue={(value) => <FormattedMessage id={`enums.topics.${value}`} />}
        />
      );
    },
  },
  {
    id: 'countriesOfResearcher',
    header: 'filters.countriesOfResearcher.name',
    cell: (item) => {
      const countriesOfResearcher = item.countriesOfResearcher?.filter(notNull);
      if (!countriesOfResearcher) return null;

      return (
        <SetAsFilterList
          items={countriesOfResearcher}
          field="countriesOfResearcher"
          renderValue={(value) => <FormattedMessage id={`enums.countryCode.${value}`} />}
        />
      );
    },
  },
  {
    id: 'countriesOfCoverage',
    header: 'filters.countriesOfCoverage.name',
    cell: (item) => {
      const countriesOfCoverage = item.countriesOfCoverage?.filter(notNull);
      if (!countriesOfCoverage) return null;

      return (
        <SetAsFilterList
          items={countriesOfCoverage}
          field="countriesOfCoverage"
          renderValue={(value) => <FormattedMessage id={`enums.countryCode.${value}`} />}
        />
      );
    },
  },
];

const DOI_CAP = 6;
function Dois({ gbifDOIs }: { gbifDOIs?: string[] | null }) {
  const [showAll, setShowAll] = useState(false);
  if (!gbifDOIs) return null;
  return (
    <>
      {Array.isArray(gbifDOIs) && gbifDOIs.length > 0 && (
        <BulletList className="g-break-words g-mt-1 g-flex g-items-center g-gap-1 g-text-xs g-flex-wrap">
          {gbifDOIs.slice(0, DOI_CAP).map((doi) => (
            <li key={doi}>
              <DoiTag id={doi} className="g-text-xs g-pointer-events-auto" />
            </li>
          ))}
          {gbifDOIs.length > DOI_CAP && (
            <>
              {!showAll && (
                <li>
                  <button onClick={() => setShowAll(true)} className="g-pointer-events-auto">
                    Show more
                  </button>
                </li>
              )}
              {showAll &&
                gbifDOIs.slice(DOI_CAP).map((doi) => (
                  <li key={doi}>
                    <DoiTag id={doi} className="g-text-xs g-pointer-events-auto" />
                  </li>
                ))}
            </>
          )}
        </BulletList>
      )}
    </>
  );
}
