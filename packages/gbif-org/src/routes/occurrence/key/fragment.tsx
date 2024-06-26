import { DynamicLink } from '@/components/dynamicLink';
import { ArticleIntro } from '@/routes/resource/key/components/articleIntro';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { LoaderArgs } from '@/types';
import { required } from '@/utils/required';
import { useLoaderData, useParams } from 'react-router-dom';
import formatXml from 'xml-formatter';

type LoaderResult = string;

export async function occurrenceFragmentLoader({
  params,
  config,
}: LoaderArgs): Promise<LoaderResult> {
  const key = required(params.key, 'No key was provided in the URL');

  const response = await fetch(`${config.v1Endpoint}/occurrence/${key}/fragment`);

  // The response could either be of type JSON or XML, but the Content-Type header does not differentiate
  const text = await response.text();
  const isJson = text.startsWith('{');

  if (isJson) return JSON.stringify(JSON.parse(text), null, 4);
  return formatXml(text);
}

export function OccurrenceFragment() {
  const fragment = useLoaderData() as LoaderResult;
  const { key } = useParams();

  return (
    <article>
      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer>
          <ArticlePreTitle>
            <DynamicLink to="/occurrence/search">Occurrence</DynamicLink>
          </ArticlePreTitle>
          <ArticleTitle>Occurrence {key}</ArticleTitle>
          <ArticleIntro>
            <p className="g-text-red-500 g-text-base g-font-medium g-pb-2">
              The data publisher has removed this record from the GBIF index, but the last version
              is shown below.
            </p>
            <p className="g-text-base">
              Records no longer in a published dataset are removed from the GBIF index. Publishers
              may sometimes have reasons to remove individual records or an entire dataset or assign
              new local identifiers.
            </p>
          </ArticleIntro>
        </ArticleTextContainer>
        <div className="g-py-8">
          <pre className="g-bg-slate-100 g-p-8 g-w-full g-max-w-7xl g-m-auto">{fragment}</pre>
        </div>
      </PageContainer>
    </article>
  );
}
