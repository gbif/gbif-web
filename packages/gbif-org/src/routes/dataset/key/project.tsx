import { ContactList } from '@/components/contactList';
import EmptyTab from '@/components/EmptyTab';
import { HyperText } from '@/components/hyperText';
import { Unknown } from '@/components/message';
import { TableOfContents } from '@/components/tableOfContents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { CardDescription } from '@/components/ui/smallCard';
import useBelow from '@/hooks/useBelow';
import { Aside, AsideSticky, SidebarLayout } from '@/routes/occurrence/key/pagelayouts';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PopoverContent } from '@radix-ui/react-popover';
import { useMemo } from 'react';
import { MdMenu } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useDatasetKeyLoaderData } from '.';

export function DatasetKeyProject() {
  const { data } = useDatasetKeyLoaderData();
  const { dataset } = data;
  const removeSidebar = useBelow(1100);
  const { project } = dataset ?? {};

  const tableOfContents = useMemo(() => {
    if (!project) return [];
    const tableOfContents = [{ id: 'abstract', title: <FormattedMessage id="dataset.abstract" /> }];
    if (project.studyAreaDescription) {
      tableOfContents.push({
        id: 'studyAreaDescription',
        title: <FormattedMessage id="dataset.studyArea" />,
      });
    }
    if (project.designDescription) {
      tableOfContents.push({
        id: 'designDescription',
        title: <FormattedMessage id="dataset.description" />,
      });
    }
    if (project.funding) {
      tableOfContents.push({ id: 'funding', title: <FormattedMessage id="dataset.funding" /> });
    }
    if (project.contacts) {
      tableOfContents.push({ id: 'contacts', title: <FormattedMessage id="dataset.contacts" /> });
    }
    return tableOfContents;
  }, [project]);

  if (!dataset) {
    return null; //TODO return loader or error
  }
  if (!project) return <EmptyTab />;

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl g-relative">
        {/* <div className={`${removeSidebar ? '' : 'g-flex'}`}> */}
        <SidebarLayout
          reverse
          className="g-grid-cols-[1fr_250px] xl:g-grid-cols-[1fr_300px]"
          stack={removeSidebar}
        >
          <div className="g-flex-grow">
            <Card className="g-mb-4" id="abstract">
              <CardHeader className="gbif-word-break">
                <CardTitle>{project.title ?? <Unknown id="phrases.notProvided" />}</CardTitle>
                <CardDescription>
                  <FormattedMessage id="dataset.projectId" />: {project.identifier}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="g-prose g-max-w-full">
                  <HyperText text={project.abstract} fallback />
                </div>
              </CardContent>
            </Card>

            {project.studyAreaDescription && (
              <Card className="g-mb-4" id="studyAreaDescription">
                <CardHeader className="gbif-word-break">
                  <CardTitle>
                    <FormattedMessage id="dataset.studyArea" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="g-prose g-max-w-full">
                    <HyperText text={project.studyAreaDescription} fallback />
                  </div>
                </CardContent>
              </Card>
            )}

            {project.designDescription && (
              <Card className="g-mb-4" id="designDescription">
                <CardHeader className="gbif-word-break">
                  <CardTitle>
                    <FormattedMessage id="dataset.description" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="g-prose g-max-w-full">
                    <HyperText text={project.designDescription} fallback />
                  </div>
                </CardContent>
              </Card>
            )}

            {project.funding && (
              <Card className="g-mb-4" id="funding">
                <CardHeader className="gbif-word-break">
                  <CardTitle>
                    <FormattedMessage id="dataset.funding" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="g-prose g-max-w-full">
                    <HyperText text={project.funding} fallback />
                  </div>
                </CardContent>
              </Card>
            )}

            {project.contacts && (
              <Card className="g-mb-4" id="contacts">
                <CardHeader className="gbif-word-break">
                  <CardTitle>
                    <FormattedMessage id="dataset.contacts" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactList contacts={project.contacts} />
                </CardContent>
              </Card>
            )}
          </div>
          {!removeSidebar && (
            <Aside>
              <AsideSticky className="-g-mt-4">
                <Card>
                  <h4 className="g-text-sm g-font-semibold g-mx-4 g-mt-3 g-text-slate-600">
                    <FormattedMessage id="phrases.pageToc" />
                  </h4>
                  <nav className="g-pb-2">
                    <TableOfContents sections={tableOfContents} className="" />
                  </nav>
                </Card>
              </AsideSticky>
            </Aside>
          )}
        </SidebarLayout>
        {removeSidebar && (
          <Popover>
            <PopoverTrigger className="g-sticky g-bottom-4 g-float-end -g-me-2 g-bg-white g-rounded g-p-2 g-shadow-md g-cursor-pointer g-z-50 g-border g-border-slate-200">
              <MdMenu className="" />
            </PopoverTrigger>
            <PopoverContent>
              <Card>
                <h4 className="g-text-sm g-font-semibold g-mx-4 g-mt-3 g-text-slate-600">
                  <FormattedMessage id="phrases.pageToc" />
                </h4>
                <nav className="g-pb-2">
                  <TableOfContents sections={tableOfContents} className="" />
                </nav>
              </Card>
            </PopoverContent>
          </Popover>
        )}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
