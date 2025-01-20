import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/largeCard';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useDatasetKeyLoaderData } from '.';

export function DatasetKeyDownload() {
  const { key } = useParams();
  const { data } = useDatasetKeyLoaderData();
  const { dataset } = data;

  const fullPredicate = {
    type: 'equals',
    key: 'datasetKey',
    value: key,
  };

  const dwcAEndpoint = dataset?.endpoints?.find(function (e) {
    return e.type == 'DWC_ARCHIVE';
  });

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <div className="g-flex g-flex-wrap -g-mx-4">
          <div>
            <Card className="g-flex-none md:g-w-96 g-max-w-full g-mx-4 g-mb-4">
              <CardHeader>
                <CardTitle>GBIF annotated occurrence archive</CardTitle>
                <CardDescription className="g-text-base g-prose g-pt-6">
                  <p>
                    Download the occurrence records after GBIF processing. During processing, names,
                    dates etc are normalised. The data is also enriched with information from other
                    sources.
                  </p>
                  <p>Be aware that an account is needed to download the content.</p>
                </CardDescription>
              </CardHeader>
              {/* <CardContent>
            <p>
              Download the occurrence records after GBIF processing. During processing, names, dates
              etc are normalised. The data is also enriched with information from other sources.
            </p>
            <p>Be aware that an account is needed to download the content.</p>
          </CardContent> */}
              <CardFooter>
                <Button variant="default" className="g-text-center g-w-full" asChild>
                  <a
                    className="g-text-white"
                    href={`${
                      import.meta.env.PUBLIC_GBIF_ORG
                    }/occurrence/download/request?predicate=${encodeURIComponent(
                      JSON.stringify(fullPredicate)
                    )}#create`}
                  >
                    <FormattedMessage id="download.continueToGBIF" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
          {dwcAEndpoint && (
            <div>
              <Card className="g-flex-none md:g-w-96 g-max-w-full g-mx-4">
                <CardHeader>
                  <CardTitle>Source archive</CardTitle>
                  <CardDescription className="g-text-base g-prose g-pt-6">
                    <p>
                      The source archive is the data as published to GBIF without any normalization
                      or processing via GBIF.
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="default" className="g-text-center g-w-full" asChild>
                    <a
                      href={`${dwcAEndpoint.url}`}
                      rel="noopener noreferrer"
                      className="g-text-white"
                    >
                      Source archive
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
        <div className="g-mt-4 g-text-slate-600">
          For diagnostics you might want to look at the EML record after normalisation.{' '}
          <a
            className="g-underline g-text-inherit"
            href={`${import.meta.env.PUBLIC_API_V1}/dataset/${key}/document`}
          >
            Download processed EML
          </a>
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
