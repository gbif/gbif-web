import { notNull } from '@/utils/notNull';
import { MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { SingleLiteratureSearchResult } from '.';
import { SetAsFilter } from '@/components/searchTable/components/body/setAsFilter';
import { SetAsFilterList } from '@/components/searchTable/components/body/setAsFilterList';
import { ColumnDef } from '@/components/searchTable';

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
      const maxLength = 200;
      const truncatedAbstract =
        item.abstract != null && item.abstract.length > maxLength
          ? `${item.abstract.substr(0, maxLength)}...`
          : item.abstract;
      const link = getLink(item);

      return (
        <>
          <div>
            {link == null ? (
              item.title
            ) : (
              <a href={link} className="g-pointer-events-auto">
                {item.title} <MdLink />
              </a>
            )}
          </div>
          <span className="g-text-sm g-text-gray-500">{truncatedAbstract}</span>
        </>
      );
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
];
