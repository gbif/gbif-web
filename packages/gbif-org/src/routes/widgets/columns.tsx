import { MdLink } from 'react-icons/md';
function getAuthors(item) {
  const tooLong = item.authors?.length > 10;
  return (
    (item.authors || [])
      .slice(0, 10)
      .map(
        (author) =>
          `${author.lastName}${author.firstName ? ' ' + Array.from(author.firstName)[0] + '.' : ''}`
      )
      .join(', ') + (tooLong ? ' et. al.' : '')
  );
}

function getLink(item) {
  if (item.identifiers?.doi) {
    return `https://doi.org/${item.identifiers.doi}`;
  }
  return item.websites?.[0];
}

export const columns = [
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
          <div className="g-text-sm g-text-primary-500">{getAuthors(item)}</div>
          <span className="g-text-sm g-text-gray-500">{truncatedAbstract}</span>
        </>
      );
    },
  },
];
