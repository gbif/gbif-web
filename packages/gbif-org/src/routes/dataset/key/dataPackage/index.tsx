import { HyperText } from '@/components/hyperText';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useDatasetKeyLoaderData } from '..';
import Explorer from './Explorer';

export function DatasetKeyDataPackage() {
  const { data } = useDatasetKeyLoaderData();
  const { dataset } = data;

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {/* <div className={`${removeSidebar ? '' : 'g-flex'}`}> */}
        <div className="g-min-h-[70vh]">
          <div>
            <Alert variant="theme" className="g-mb-4">
              <AlertDescription>
                <HyperText
                  className="[&_a]:g-underline [&_a]:g-text-inherit"
                  text={`We do not yet have support for Darwin Core Data packages. In the interim, this is an experimental datapackage explorer.`}
                  sanitizeOptions={{ ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br'] }}
                />
              </AlertDescription>
            </Alert>
          </div>

          {dataset.key && <Explorer datasetKey={dataset.key} />}
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
