import { ErrorMessage } from '@/components/errorMessage';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { CitationIcon, FeatureList, GenericFeature } from '@/components/highlights';
import { LicenceTag } from '@/components/identifierTag';
import { DownloadKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';
import { downloadCompleted } from '../utils';

export function SubHeader({
  download,
  literatureCount,
}: {
  download: DownloadKeyQuery['download'];
  literatureCount?: number;
}) {
  if (!download) return null;
  const showPostponeOption = false; // TODO this should be shown if the user is the creator of the download and the download is eligible for deletion
  const showCitation = downloadCompleted(download);

  return (
    <HeaderInfo>
      <HeaderInfoMain>
        {showCitation && (
          <FeatureList>
            <GenericFeature>
              <LicenceTag value={download.license} />
            </GenericFeature>

            {(literatureCount ?? 0) > 0 && (
              <GenericFeature>
                <CitationIcon />
                <DynamicLink
                  className="hover:g-underline g-text-inherit"
                  pageId="literatureSearch"
                  searchParams={{ gbifDownloadKey: download.key }}
                >
                  <FormattedMessage id="counts.nCitations" values={{ total: literatureCount }} />
                </DynamicLink>
              </GenericFeature>
            )}
          </FeatureList>
        )}

        {download?.status === 'FILE_ERASED' && (
          <ErrorMessage className="g-mt-4">
            <span className="g-me-1">
              <FormattedMessage id="downloadKey.downloadDeleted" />
            </span>
            <a href="mailto:helpdesk@gbif.org" className="g-underline g-text-inherit">
              <FormattedMessage id="downloadKey.contactHelpdesk" />
            </a>
          </ErrorMessage>
        )}
      </HeaderInfoMain>
    </HeaderInfo>
  );
}
