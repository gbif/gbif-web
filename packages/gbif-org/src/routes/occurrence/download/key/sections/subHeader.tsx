import { ErrorMessage } from '@/components/errorMessage';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { CitationIcon, FeatureList, GenericFeature } from '@/components/highlights';
import { HyperText } from '@/components/hyperText';
import { LicenceTag } from '@/components/identifierTag';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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

        {showPostponeOption && (
          <Alert variant="warning" className="g-mt-4">
            <AlertDescription>
              <HyperText
                className="[&_a]:g-underline [&_a]:g-text-inherit"
                text={
                  'Unless GBIF discovers citations of this download, the data file is eligible for deletion after March 14, 2019.\n\nRead more about our deletion policy.'
                }
                sanitizeOptions={{ ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br'] }}
              />
              <Button className="g-mt-2" variant="outline">
                Postpone deletion
              </Button>
            </AlertDescription>
          </Alert>
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
