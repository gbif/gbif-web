import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/largeCard';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';

export function DatasetKeyDownload() {
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl g-flex">
        <Card className="g-flex-none g-w-1/2 g-me-2 g-text-center">
          <CardHeader>
            <CardTitle>GBIF annotated occurrence archive</CardTitle>
            <CardDescription className="g-text-lg">
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
            <Button variant="default">Continue</Button>
          </CardFooter>
        </Card>
        <Card className="g-flex-none g-w-1/2">
          <CardHeader>
            <CardTitle>Source archive</CardTitle>
            <CardDescription>
              <p>
                The source archive is the data as published to GBIF without any normalization or
                processing via GBIF.
              </p>
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="default">Source archive</Button>
          </CardFooter>
        </Card>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
