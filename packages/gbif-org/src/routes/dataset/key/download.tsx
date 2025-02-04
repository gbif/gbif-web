import { Message } from '@/components/message';
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
import { MdDownload } from 'react-icons/md';
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
                <CardTitle>
                  <FormattedMessage id="dataset.processedOccurrences" />
                </CardTitle>
                <CardDescription className="g-text-base g-prose g-pt-6">
                  <Message id="dataset.processedOccurrencesDescription" />
                </CardDescription>
              </CardHeader>
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
          {dataset?.checklistBankDataset?.key && (
            <div>
              <Card className="g-flex-none md:g-w-96 g-max-w-full g-mx-4 g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="dataset.checklistBankDownload" />
                  </CardTitle>
                  <CardDescription className="g-text-base g-prose g-pt-6">
                    <Message id="dataset.checklistBankDownloadDescription" />
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="default" className="g-text-center g-w-full" asChild>
                    <a
                      href={`${import.meta.env.PUBLIC_CHECKLIST_BANK_WEBSITE}/dataset/gbif-${
                        dataset.key
                      }/download`}
                      rel="noopener noreferrer"
                      className="g-text-white"
                    >
                      <FormattedMessage id="phrases.continue" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
          {dwcAEndpoint && (
            <div>
              <Card className="g-flex-none md:g-w-96 g-max-w-full g-mx-4 g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="dataset.originalArchive" />
                  </CardTitle>
                  <CardDescription className="g-text-base g-prose g-pt-6">
                    <Message id="dataset.originalArchiveDescription" />
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="default" className="g-text-center g-w-full" asChild>
                    <a
                      href={`${dwcAEndpoint.url}`}
                      rel="noopener noreferrer"
                      className="g-text-white"
                    >
                      <FormattedMessage id="phrases.download" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
        <div className="g-mt-4 g-text-slate-600">
          <a
            className="g-underline g-text-inherit g-flex-inline g-items-center"
            href={`${import.meta.env.PUBLIC_API_V1}/dataset/${key}/document`}
          >
            <MdDownload />
            <span className="g-ms-2">
              <FormattedMessage id="dataset.annotatedEml" />
            </span>
          </a>
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
