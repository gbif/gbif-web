import { BulletList } from '@/components/bulletList';
import { ColumnDef } from '@/components/searchTable';
import { SetAsFilter } from '@/components/searchTable/components/body/setAsFilter';
import { SetAsFilterList } from '@/components/searchTable/components/body/setAsFilterList';
import { notNull } from '@/utils/notNull';
import { truncate } from '@/utils/truncate';
import { useState } from 'react';
import { MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { SingleLiteratureSearchResult } from '.';
import { AltmetricDonut } from './AltmetricDonut';

function getLink(item: SingleLiteratureSearchResult) {
  if (item.identifiers?.doi) {
    return `https://doi.org/${item.identifiers.doi}`;
  }
  return item.websites?.[0];
}

export const columns: ColumnDef<SingleLiteratureSearchResult>[] = [
  {
    id: 'titleAndAbstract',
    header: 'tableHeaders.titleAndAbstract',
    disableHiding: true,
    minWidth: 250,
    cell: (item) => {
      return <PrimaryColumn literature={item} />;
    },
  },
  {
    id: 'altmetric',
    header: 'tableHeaders.altmetric',
    cell: (item) => {
      if (!item.identifiers?.doi) return null;

      return <AltmetricDonut doi={item.identifiers?.doi} className="g-pointer-events-auto" />;
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

const DOI_CAP = 10;
function Dois({ gbifDOIs }: { gbifDOIs?: string[] | null }) {
  const [showAll, setShowAll] = useState(false);
  if (!gbifDOIs) return null;
  return (
    <>
      {Array.isArray(gbifDOIs) && gbifDOIs.length > 0 && (
        <BulletList className="g-break-words g-mt-1 g-flex g-items-center g-gap-1 g-text-xs g-flex-wrap g-inline">
          {gbifDOIs.slice(0, DOI_CAP).map((doi) => (
            <li key={doi}>
              <a href={`https://doi.org/${doi}`} className="g-pointer-events-auto g-underline">
                {doi}
              </a>{' '}
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
                    <a
                      href={`https://doi.org/${doi}`}
                      className="g-pointer-events-auto g-underline"
                    >
                      {doi}
                    </a>{' '}
                  </li>
                ))}
            </>
          )}
        </BulletList>
      )}
    </>
  );
}

function PrimaryColumn({ literature }: { literature: SingleLiteratureSearchResult }) {
  const link = getLink(literature);
  // Helper function to get the primary link
  const getPrimaryLink = () => {
    if (literature.identifiers?.doi) {
      return `https://doi.org/${literature.identifiers.doi}`;
    }
    if (literature.websites?.[0]) {
      return literature.websites[0];
    }
    return null;
  };

  // Helper function to format authors
  const formatAuthors = () => {
    if (!literature.authors) return '';

    const displayAuthors = literature.authors.filter((x) => x).slice(0, 6);
    const authorStrings = displayAuthors.map(
      (author) => `${author?.lastName}, ${author?.firstName?.[0] || ''}.`
    );

    let authorsText = authorStrings.join(' ');
    if (literature.authors.length > 6) {
      authorsText += ' ... - ';
    }

    return authorsText;
  };

  // Helper function to get Google Scholar URL
  const getGoogleScholarUrl = () => {
    if (!literature.title || getPrimaryLink()) return null;

    const titleEncoded = encodeURIComponent(literature.title);
    const authorLastName = literature.authors?.[0]?.lastName || '';
    return `//scholar.google.com/scholar?as_q=${titleEncoded}&as_sauthors=${authorLastName}`;
  };

  const primaryLink = getPrimaryLink();
  const googleScholarUrl = getGoogleScholarUrl();

  return (
    <>
      <div>
        {primaryLink == null ? (
          truncate(literature.title, 200)
        ) : (
          <a href={primaryLink} className="g-pointer-events-auto g-font-bold g-text-primary-500">
            {truncate(literature.title, 200)} <MdLink />
          </a>
        )}
      </div>
      <div className="g-text-xs g-text-slate-500 g-mb-1">
        <span>{formatAuthors()}</span>
        <span>({literature.year}) </span>
        <span>{literature.source}</span>

        {!literature.identifiers?.doi && !literature.websites?.[0] && (
          <span>
            {literature.volume && ` ${literature.volume}`}
            {literature.issue && ` (${literature.issue})`}
            {literature.pages && ` ${literature.pages}`}
            {literature.identifiers &&
              Object.entries(literature.identifiers).map(([key, identifier]) => (
                <span key={key}>
                  {' '}
                  {key}: {identifier}
                </span>
              ))}
          </span>
        )}
      </div>
      {/* Abstract */}
      {literature.excerpt && (
        <p className="g-text-sm g-text-slate-700 g-mb-2">{literature.excerpt}</p>
      )}
      {(literature?.gbifDOIs?.length ?? 0) > 0 && (
        <div>
          <FormattedMessage id="cms.resource.dataUsedInStudy" />
          {': '}
          <Dois gbifDOIs={literature?.gbifDOIs} className="g-inline" />
        </div>
      )}
      {/* Google Scholar link */}
      {googleScholarUrl && (
        <div>
          <a
            href={googleScholarUrl}
            className="g-text-xs g-text-primary-500 hover:g-text-primary-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Scholar
          </a>
        </div>
      )}
    </>
  );
}
