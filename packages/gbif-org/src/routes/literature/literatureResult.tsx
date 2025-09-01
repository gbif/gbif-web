import { Tag } from '@/components/resultCards';
import { Card } from '@/components/ui/largeCard';
import { LiteratureResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment LiteratureResult on Literature {
    id
    title
    excerpt
    authors {
      firstName
      lastName
    }
    literatureType
    relevance
    topics
    keywords
    websites
    year
    source
    keywords
    abstract
    pages
    countriesOfResearcher
    countriesOfCoverage
    peerReview
    openAccess
    topics
    volume
    issue
    identifiers {
      doi
    }
  }
`);

export function LiteratureResult({ literature }: { literature: LiteratureResultFragment }) {
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
    <Card className="g-mb-2">
      {/* Header stripe */}
      <div className="">
        <div className="g-p-4">
          <span className="g-text-xs g-text-slate-600 g-uppercase g-tracking-wide">
            <FormattedMessage id="enums.cms.contentType.literature" />
          </span>
          <h3 className="g-text-lg g-font-semibold g-mt-1">
            {primaryLink ? (
              <DynamicLink
                to={primaryLink}
                className="hover:g-text-primary-500 g-flex g-items-center g-gap-1"
              >
                {literature.title}
                <ExternalLinkIcon className="g-w-4 g-h-4" />
              </DynamicLink>
            ) : (
              <span>{literature.title}</span>
            )}
          </h3>
        </div>
      </div>

      {/* Content stripe */}
      <div className="g-p-4">
        {/* Meta information */}
        <div className="g-text-sm g-text-slate-600 g-mb-3">
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
          <p className="g-text-sm g-text-slate-700 g-mb-4 g-leading-relaxed">
            {literature.excerpt}
          </p>
        )}

        {/* Keywords */}
        {literature.keywords && literature.keywords.length > 0 && (
          <div className="g-mb-4">
            <ul className="g-flex g-flex-wrap g-gap-1">
              {literature.keywords.slice(0, 6).map((keyword, index) => (
                <li key={index} className="g-text-xs g-text-slate-500">
                  {keyword}
                  {index < Math.min(literature.keywords.length, 6) - 1 && ' •'}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chips/Tags */}
        <div className="g-flex g-flex-wrap g-gap-2 g-mb-4">
          {literature.literatureType && (
            <Tag>
              <DynamicLink
                to={`/resource/search?contentType=literature&literatureType=${literature.literatureType}`}
              >
                <FormattedMessage
                  id={`enums.cms.vocabularyTerms.literatureType.${literature.literatureType}`}
                />
              </DynamicLink>
            </Tag>
          )}

          {literature.openAccess && (
            <Tag className="g-bg-green-100 g-text-green-700">
              <DynamicLink to={`/resource/search?contentType=literature&openAccess=true`}>
                <FormattedMessage id={'resourceSearch.filters.openAccess'} />
              </DynamicLink>
            </Tag>
          )}

          {literature.peerReview && (
            <Tag className="g-bg-blue-100 g-text-blue-700">
              <DynamicLink to={`/resource/search?contentType=literature&peerReview=true`}>
                <FormattedMessage id={'resourceSearch.filters.peerReview'} />
              </DynamicLink>
            </Tag>
          )}
        </div>

        {/* GBIF DOIs */}
        {literature.gbifDownloadKey && literature.gbifDownloadKey.length > 0 && (
          <div className="g-mb-4">
            <span className="g-text-xs g-text-slate-500 g-block g-mb-2">
              <FormattedMessage id={'resource.dataUsedInStudy'} />
            </span>
            <div className="g-flex g-flex-wrap g-gap-1">
              {literature.gbifDownloadKey.slice(0, 50).map((doi, index) => (
                <Tag key={index}>
                  <DynamicLink to={`https://doi.org/${doi}`}>DOI: {doi}</DynamicLink>
                </Tag>
              ))}
            </div>
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
      </div>
    </Card>
  );
}
